import React, { useState, useMemo } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { Box, TextField, Button, Typography, CircularProgress, Backdrop } from "@mui/material";
import { loginUser, loginWithGoogle, getCurrentUser } from "../apis/authAPI";
import { login } from "../redux/slices/authSlice";
import { fetchCreatedEvents, fetchRSVPedEvents } from "../redux/slices/userEventsSlice";
import { AppDispatch } from "../redux/store";
import AnimateSVG from "../components/AnimateSVG";
import fingerprintSVG from "../assets/fingerprint.svg?raw";
import "../styles/vendor/fingerprint-styles.css";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoize the style object to prevent unnecessary re-renders
  const svgStyle = useMemo(() => ({
    width: "100%",
    maxWidth: "70%",
    height: "auto",
  }), []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    try {
      const response = await loginUser({
        email,
        password,
      });
      
      // Store the refresh token immediately
      localStorage.setItem("refreshToken", response.refresh_token);
      
      try {
        // Try to fetch complete user profile data
        const userProfile = await getCurrentUser();
        
        dispatch(
          login({
            user: userProfile,
            accessToken: response.access_token,
          })
        );
        
        // Fetch user events data in the background for better UX
        dispatch(fetchCreatedEvents());
        dispatch(fetchRSVPedEvents());
        
      } catch (profileError) {
        console.warn("Failed to fetch user profile, using minimal data:", profileError);
        // Fallback to minimal user data if profile fetch fails
        dispatch(
          login({
            user: { email: response.email, name: "", role: "user" },
            accessToken: response.access_token,
          })
        );
      }
      
      // Use navigate instead of window.location.href for smoother transition
      navigate("/home");
    } catch (error) {
      setLoginError("Login failed. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (response: CredentialResponse): Promise<void> => {
    const token = response.credential;
    if (!token) {
      setLoginError("Google login failed. No credential received.");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      const backendResponse = await loginWithGoogle({ token });
      
      // Store the refresh token immediately
      localStorage.setItem("refreshToken", backendResponse.refresh_token);
      
      try {
        // Try to fetch complete user profile data
        const userProfile = await getCurrentUser();
        
        dispatch(
          login({
            user: userProfile,
            accessToken: backendResponse.access_token,
          })
        );
        
        // Fetch user events data in the background for better UX
        dispatch(fetchCreatedEvents());
        dispatch(fetchRSVPedEvents());
        
      } catch (profileError) {
        console.warn("Failed to fetch user profile, using minimal data:", profileError);
        // Fallback to minimal user data if profile fetch fails
        dispatch(
          login({
            user: { email: backendResponse.email, name: "", role: "user" },
            accessToken: backendResponse.access_token,
          })
        );
      }
      
      // Use navigate instead of window.location.href for smoother transition
      navigate("/home");
    } catch (error) {
      setLoginError("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginFailure = (): void => {
    setLoginError("Google login failed. Please try again.");
  };

  const handleCreateAccount = (): void => {
    navigate("/signup");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          backgroundColor: theme.palette.background.paper,
          position: "relative",
        }}
      >
        <AnimateSVG
          svgMarkup={fingerprintSVG}
          style={svgStyle}
        />
      </Box>

      {/* Form section */}
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          padding: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          backgroundColor: theme.palette.mode === 'dark' 
            ? "rgba(30, 30, 30, 0.85)" 
            : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          SAHANA
        </Typography>
        {loginError && (
          <Typography color="error" align="center" gutterBottom>
            {loginError}
          </Typography>
        )}
        <Box component="form" onSubmit={handleLogin}>
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
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            required
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{
              color: "#ffffff",
              marginTop: 2,
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Box>
        <Box textAlign="center" mt={2}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Lazy?
          </Typography>
          {!isLoading && (
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          )}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
        <Button
          fullWidth
          variant="text"
          color="secondary"
          sx={{ marginTop: 2 }}
          onClick={handleCreateAccount}
          disabled={isLoading}
        >
          Create New Account
        </Button>
      </Box>

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
          Logging you in...
        </Typography>
      </Backdrop>
    </Box>
  );
};

export default LoginPage;
