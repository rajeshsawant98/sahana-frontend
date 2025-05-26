import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { Box, TextField, Button, Typography } from "@mui/material";
import AnimateSVG from "../components/AnimateSVG";
import fingerprintSVG from "../assets/fingerprint.svg?raw";
import "../styles/vendor/fingerprint-styles.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      dispatch(
        login({
          user: { email: response.data.email },
          accessToken: response.data.access_token,
        })
      );
      localStorage.setItem("refreshToken", response.data.refresh_token);
      window.location.href = "/home";
    } catch (error) {
      setLoginError("Login failed. Please check your email and password.");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential;
    try {
      const backendResponse = await axiosInstance.post("/auth/google", {
        token,
      });
      dispatch(
        login({
          user: { email: backendResponse.data.email },
          accessToken: backendResponse.data.access_token,
        })
      );
      localStorage.setItem("refreshToken", backendResponse.data.refresh_token);
      window.location.href = "/home";
    } catch (error) {
      setLoginError("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    setLoginError("Google login failed. Please try again.");
  };

  const handleCreateAccount = () => {
    navigate("/signup");
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
            onChange={(e) => setEmail(e.target.value)}
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
