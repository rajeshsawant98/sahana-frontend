import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NavBar } from "../components/navigation";
import { AnimateSVG } from "../components/ui";
import groupDiscussionSVG from "../assets/group-discussion.svg?raw";
import "../styles/vendor/group-discussion-styles.css";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/events');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <>
      {/* Transparent NavBar */}
      <NavBar />

      {/* Landing Page Content */}
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Animated Background Illustration */}
        <AnimateSVG
          svgMarkup={groupDiscussionSVG}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "75%",
            height: "100%",
            overflow: "hidden",
            zIndex: 0,
          }}
        />

        {/* Hero Section */}
        <Container
          maxWidth="md"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            paddingTop: 7,
          }}
        >
          <Typography
            variant="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: "primary.main",
              lineHeight: 1.2,
            }}
          >
            Sahana
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              mb: 4,
            }}
          >
            Discover. Connect. Experience.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {isAuthenticated ? "Explore Events" : "Get Started"}
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;
