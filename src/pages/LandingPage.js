import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import NavBar from '../components/NavBar';
import backgroundImage from '../assets/GD.svg'; // Import the SVG

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
        {/* Background Image */}
        <Box
          component="img"
          src={backgroundImage} // Use the imported image
          alt="Background Illustration"
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '65%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />

        {/* Hero Section */}
        <Container
          maxWidth="md"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1, // Ensure it stays above the background image
            paddingTop: 7, // Adjust padding if needed
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