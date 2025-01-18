import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#FFFFFF', // Solid white for a modern look
        height: '100%',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Features', 'Pricing', 'About', 'Login'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText
                primary={text}
                sx={{
                  color: '#333333', // Darker color for text
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'transparent', // Solid white background
        boxShadow: 'none', // No shadow for a cleaner look
        borderBottom: 'none', // Light border for separation
      }}
    >
      <Toolbar sx={{ height: '60px' }}> {/* Thinner navbar */}
        {/* Logo or App Name */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
           // fontFamily: 'Inter, sans-serif', // Use the selected modern font
            fontWeight: '600',
            color: '#333333', // Dark gray text color for a sleek appearance
            cursor: 'pointer',
          }}
        >
          Sahana
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          <Button
            color="inherit"
            sx={{
              color: '#333333',
              fontFamily: 'Inter, sans-serif', // Use modern font here too
              fontWeight: '500',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#FFBF49', // Golden Yellow on hover
              },
            }}
          >
            Features
          </Button>
          <Button
            color="inherit"
            sx={{
              color: '#333333',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '500',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#FFBF49',
              },
            }}
          >
            Pricing
          </Button>
          <Button
            color="inherit"
            sx={{
              color: '#333333',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '500',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#FFBF49',
              },
            }}
          >
            About
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: 20,
              padding: '6px 20px',
              textTransform: 'none',
              fontWeight: '500',
              background: '#49A3FF',
              '&:hover': {
                background: '#5AB5FF',
              },
            }}
          >
            Login
          </Button>
        </Box>

        {/* Mobile Hamburger Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              color: '#333333',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {drawerContent}
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;