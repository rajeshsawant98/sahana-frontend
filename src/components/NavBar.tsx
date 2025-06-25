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
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import LogoutButton from '../components/buttons/LogoutButton';
import LocationNavbar from './LocationNavbar';
import DarkModeToggle from './DarkModeToggle';

interface NavItem {
  text: string;
  route: string;
}

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems: NavItem[] = [
    { text: 'Events', route: '/events' },
    { text: 'Nearby Events', route: '/nearby-events' },
    { text: 'Interests', route: '/interests' },
    { text: 'Profile', route: '/profile' },
    { text: 'Login', route: '/login' },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        backgroundColor: darkMode ? '#1e1e1e' : '#FFFFFF',
        height: '100%',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map(({ text, route }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton 
              onClick={() => navigate(route)}
              sx={{
                border: 'none !important',
                outline: 'none !important',
                boxShadow: 'none !important',
                '&:hover': {
                  backgroundColor: 'transparent',
                  border: 'none !important',
                  outline: 'none !important',
                  boxShadow: 'none !important',
                  '& .MuiListItemText-primary': {
                    color: '#FFBF49',
                  },
                },
                '&:focus': {
                  outline: 'none !important',
                  border: 'none !important',
                  boxShadow: 'none !important',
                },
                '&:active': {
                  outline: 'none !important',
                  border: 'none !important',
                  boxShadow: 'none !important',
                },
              }}
            >
              <ListItemText
                primary={text}
                sx={{
                  color: darkMode ? '#ffffff' : '#333333',
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
            color: darkMode ? '#ffffff' : '#333333',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/home')}
        >
          Sahana
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
          <LocationNavbar />
          <Button
            color="inherit"
            sx={{
              color: darkMode ? '#ffffff' : '#333333',
              fontWeight: '500',
              transition: 'color 0.3s',
              border: 'none !important',
              outline: 'none !important',
              boxShadow: 'none !important',
              '&:hover': {
                color: '#FFBF49',
                backgroundColor: 'transparent',
                border: 'none !important',
                outline: 'none !important',
                boxShadow: 'none !important',
              },
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
              '&:active': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
            }}
            onClick={() => navigate('/events')}
          >
            Events
          </Button>
          <Button
            color="inherit"
            sx={{
              color: darkMode ? '#ffffff' : '#333333',
              fontWeight: '500',
              transition: 'color 0.3s',
              border: 'none !important',
              outline: 'none !important',
              boxShadow: 'none !important',
              '&:hover': {
                color: '#FFBF49',
                backgroundColor: 'transparent',
                border: 'none !important',
                outline: 'none !important',
                boxShadow: 'none !important',
              },
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
              '&:active': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
            }}
            onClick={() => navigate('/interests')}
          >
            Interests
          </Button>
          <Button
            color="inherit"
            sx={{
              color: darkMode ? '#ffffff' : '#333333',
              fontWeight: '500',
              transition: 'color 0.3s',
              border: 'none !important',
              outline: 'none !important',
              boxShadow: 'none !important',
              '&:hover': {
                color: '#FFBF49',
                backgroundColor: 'transparent',
                border: 'none !important',
                outline: 'none !important',
                boxShadow: 'none !important',
              },
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
              '&:active': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
            }}
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>
          <DarkModeToggle />
          <LogoutButton />
        </Box>

        {/* Mobile Hamburger Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
          <DarkModeToggle />
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              color: darkMode ? '#ffffff' : '#333333',
              border: 'none !important',
              outline: 'none !important',
              boxShadow: 'none !important',
              '&:hover': {
                backgroundColor: 'transparent',
                border: 'none !important',
                outline: 'none !important',
                boxShadow: 'none !important',
              },
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
              '&:active': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
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
