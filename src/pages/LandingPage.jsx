import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import NavBar from '../components/NavBar';
import AnimatedSVG from '../components/AnimatedSVG';

const LandingPage = () => {
  return (
    <>
      {/* Transparent NavBar */}
      <NavBar />

      {/* Landing Page Content */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        }}
      >
        {/* Animated Background Illustration */}
        <AnimatedSVG />

        {/* Hero Section */}
        <Container
          maxWidth="md"
          sx={{
            position: 'absolute',
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
              color: 'primary.main',
              lineHeight: 1.2,
            }}
          >
            Sahana
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#424242',
              mb: 4,
            }}
          >
            Discover. Connect. Experience.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              color: '#fff',
              px: 6,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;