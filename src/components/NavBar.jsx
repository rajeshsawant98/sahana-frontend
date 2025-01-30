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
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import LogoutButton from '../components/buttons/LogoutButton';

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate(); // For programmatic navigation

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
        backgroundColor: '#FFFFFF',
        height: '100%',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {[
          { text: 'Events', route: '/events' },
          { text: 'Interests', route: '/interests' }, // New Preferences page
          { text: 'Profile', route: '/profile' },
          { text: 'Login', route: '/login' },
        ].map(({ text, route }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(route)}>
              <ListItemText
                primary={text}
                sx={{
                  color: '#333333',
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
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderBottom: 'none',
      }}
    >
      <Toolbar sx={{ height: '60px' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: '600',
            color: '#333333',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/home')} // Logo navigates to home
        >
          Sahana
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          <Button
            color="inherit"
            sx={{
              color: '#333333',
              fontWeight: '500',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#FFBF49',
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => navigate('/events')}
          >
            Events
          </Button>
          <Button
            color="inherit"
            sx={{
              color: '#333333',
              fontWeight: '500',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#FFBF49',
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => navigate('/interests')} // Navigate to Preferences
          >
            Interests
          </Button>
          <Button
            color="inherit"
            sx={{
              color: '#333333',
              fontWeight: '500',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#FFBF49',
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>
          <LogoutButton />
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