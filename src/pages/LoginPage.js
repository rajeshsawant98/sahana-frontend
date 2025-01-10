import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);

       // Store the JWT token in localStorage
       localStorage.setItem('access_token', response.data.access_token);

      navigate('/home'); // Redirect to home after successful login
    } catch (error) {
      console.error('Login failed!', error.response ? error.response.data : error);
      setLoginError('Login failed. Please check your email and password.');
    }
  };

  // Handle Google Login success
  const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential;

    try {
      const backendResponse = await axios.post('/auth/google', { token });
      console.log('Google login successful:', backendResponse.data);


       // Store the JWT token in localStorage
       localStorage.setItem('access_token', backendResponse.data.access_token);

      navigate('/home'); // Redirect to home after successful login
    } catch (error) {
      console.error('Google Login Failed!', error);
      setLoginError('Google login failed. Please try again.');
    }
  };

  // Handle Google Login failure
  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failed!', error);
    setLoginError('Google login failed. Please try again.');
  };

  // Redirect to sign-up page
  const handleCreateAccount = () => {
    navigate('/signup');
  };

  return (
    <div>
      <h1>Login</h1>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      
      {/* Email/Password Login */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Login with Email</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>

        {/* Google SSO Login */}
      <div>
        <h2>Login with Google</h2>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
        />
      </div>
      
        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
          onClick={handleCreateAccount}
        >
          Create New Account
        </button>
      </div>

      
    </div>
  );
};

export default LoginPage;