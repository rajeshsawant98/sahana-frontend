import React, { useState } from 'react';
import { Box, TextField, Button, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import signupBackground from '../assets/SignUp.svg';

const SignUpComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register', {
        email,
        password,
        name,
      });
    
      // Logging the entire response for debugging
      console.log('Backend response:', response.data);
    
      // Extract and store the access token
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
    
      console.log('Sign-up successful:', response.data.message);
    
      // Navigate to the home page
      navigate('/home');
    } catch (error) {
      console.error('Sign-up failed!', error.response ? error.response.data : error);
      setError('Sign-up failed. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left side (60% - Image) */}
      <Box
        sx={{
          width: '70%',
          backgroundImage: `url(${signupBackground})`, // Replace with your image path
          backgroundColor: 'white',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: "no-repeat",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      {/* Right side (40% - Form) */}
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
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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