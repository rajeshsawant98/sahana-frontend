import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import axiosInstance from '../utils/axiosInstance';
import { login } from "../redux/slices/authSlice";
import { AppDispatch } from '../redux/store';
import signupBackground from '../assets/SignUp.svg';

interface SignUpResponse {
  access_token: string;
  refresh_token: string;
  email: string;
  name?: string;
}

const SignUpComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axiosInstance.post<SignUpResponse>('/auth/register', {
        email,
        password,
        name,
      });

      console.log('Backend response:', response.data);

      const { access_token, refresh_token } = response.data;

      // ✅ Store access token in Redux
      dispatch(login({
        user: { email, name, role: "user" },
        accessToken: access_token,
      }));

      // ✅ Store refresh token in localStorage
      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token);
      }

      navigate('/home');
    } catch (error) {
      console.error('Sign-up failed!', error);
      setError('Sign-up failed. Please try again.');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left side (70% - Image) */}
      <Box
        sx={{
          width: '70%',
          backgroundImage: `url(${signupBackground})`,
          backgroundColor: 'white',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: "no-repeat",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      {/* Right side (30% - Form) */}
      <Box
        sx={{
          width: '30%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 4,
        }}
      >
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          New Account?
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSignUp}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#FFBF49', // Golden Yellow button color
              color: '#ffffff', // White text on button
              '&:hover': {
                backgroundColor: '#FFA500', // Slightly darker golden yellow on hover
              },
              marginTop: 2,
            }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignUpComponent;
