import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { registerUser, getCurrentUser } from '../../apis/authAPI';
import { login } from "../../redux/slices/authSlice";
import { fetchInitialCreatedEvents, fetchInitialRsvpEvents } from "../../redux/slices/userEventsSlice";
import { AppDispatch } from '../../redux/store';
import signupBackground from '../../assets/SignUp.svg';

const SignUpComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await registerUser({
        email,
        password,
        name,
      });

      const { access_token, refresh_token } = response;

      // ✅ Store refresh token in localStorage
      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token);
      }

      try {
        // Try to fetch complete user profile data
        const userProfile = await getCurrentUser();

        // ✅ Store complete user profile in Redux
        dispatch(login({
          user: userProfile,
          accessToken: access_token,
        }));
        
        // Fetch user events data in the background for better UX
        dispatch(fetchInitialCreatedEvents({ page_size: 12 }));
        dispatch(fetchInitialRsvpEvents({ page_size: 12 }));
        
      } catch (profileError) {
        // Fallback to minimal user data if profile fetch fails
        dispatch(login({
          user: { email, name, role: "user" },
          accessToken: access_token,
        }));
      }

      navigate('/');
    } catch (error) {
      console.error('Sign-up failed!', error);
      setError('Sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          backgroundColor: theme.palette.background.paper,
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
          backgroundColor: theme.palette.background.default,
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
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            margin="normal"
            required
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: '#FFBF49', // Golden Yellow button color
              color: '#ffffff', // White text on button
              '&:hover': {
                backgroundColor: '#FFA500', // Slightly darker golden yellow on hover
              },
              marginTop: 2,
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        {/* Full-screen loading backdrop */}
        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          open={isLoading}
        >
          <CircularProgress color="primary" size={60} />
          <Typography variant="h6" color="inherit">
            Creating your account...
          </Typography>
        </Backdrop>
      </Box>
    </Box>
  );
};

export default SignUpComponent;
