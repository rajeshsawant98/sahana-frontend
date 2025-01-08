import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginComponent = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (response) => {
    const token = response.credential;

    try {
      const backendResponse = await axios.post('http://localhost:8000/api/auth/google', { token });
      console.log('Backend response:', backendResponse.data);
      navigate('/home');  // Redirect to home after successful login
    } catch (error) {
      console.error('Login Failed!', error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed!', error);
  };

  return (
    <div>
      <h1>React Google Login</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
  );
};

export default GoogleLoginComponent;