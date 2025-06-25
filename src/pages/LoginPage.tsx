import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, TextField, Button, Typography } from "@mui/material";
import { loginUser, loginWithGoogle } from "../apis/authAPI";
import { login } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";
import AnimateSVG from "../components/AnimateSVG";
import fingerprintSVG from "../assets/fingerprint.svg?raw";
import "../styles/vendor/fingerprint-styles.css";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await loginUser({
        email,
        password,
      });
      dispatch(
        login({
          user: { email: response.email, name: "", role: "user" },
          accessToken: response.access_token,
        })
      );
      localStorage.setItem("refreshToken", response.refresh_token);
      window.location.href = "/home";
    } catch (error) {
      setLoginError("Login failed. Please check your email and password.");
    }
  };

  const handleGoogleLoginSuccess = async (response: CredentialResponse): Promise<void> => {
    const token = response.credential;
    if (!token) {
      setLoginError("Google login failed. No credential received.");
      return;
    }

    try {
      const backendResponse = await loginWithGoogle({ token });
      dispatch(
        login({
          user: { email: backendResponse.email, name: "", role: "user" },
          accessToken: backendResponse.access_token,
        })
      );
      localStorage.setItem("refreshToken", backendResponse.refresh_token);
      window.location.href = "/home";
    } catch (error) {
      setLoginError("Google login failed. Please try again.");
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
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <AnimateSVG
          svgMarkup={fingerprintSVG}
          style={{
            width: "100%",
            maxWidth: "70%",
            height: "auto",
          }}
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
          backgroundColor: "rgba(255, 255, 255, 0.85)",
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              color: "#ffffff",
              marginTop: 2,
            }}
          >
            Login
          </Button>
        </Box>
        <Box textAlign="center" mt={2}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Lazy?
          </Typography>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
          />
        </Box>
        <Button
          fullWidth
          variant="text"
          color="secondary"
          sx={{ marginTop: 2 }}
          onClick={handleCreateAccount}
        >
          Create New Account
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
