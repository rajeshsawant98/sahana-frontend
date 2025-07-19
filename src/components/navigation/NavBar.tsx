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
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { LogoutButton } from '../auth';
import LocationNavbar from './LocationNavbar';
import { DarkModeToggle } from '../ui';

interface NavItem {
  text: string;
  route: string;
}

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Dynamic navigation items based on authentication status and role
  const navItems: NavItem[] = isAuthenticated 
    ? [
        { text: 'Events', route: '/events' }, // Now uses infinite scroll by default
        { text: 'My Events', route: '/events/my' }, // Now uses infinite scroll by default
        { text: 'Friends', route: '/friends' },
        { text: 'Interests', route: '/interests' },
        ...(user?.role === 'admin' ? [{ text: 'Admin Panel', route: '/admin' }] : []),
      ]
    : [
        { text: 'Events', route: '/events' }, // Public access to main events (infinite scroll)
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
        {/* Add Profile option for mobile if authenticated */}
        {isAuthenticated && (
          <ListItem key="Profile" disablePadding>
            <ListItemButton 
              onClick={() => navigate('/profile')}
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
                primary="Profile"
                sx={{
                  color: darkMode ? '#ffffff' : '#333333',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
        
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
          onClick={() => navigate(isAuthenticated ? '/home' : '/')}
        >
          Sahana
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
          <LocationNavbar />
          
          {/* Dynamic Navigation Buttons */}
          {navItems.map((item) => (
            <Button
              key={item.text}
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
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s ease-in-out',
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
              onClick={() => navigate(item.route)}
            >
              {item.text}
            </Button>
          ))}
          
          {/* Profile Picture for authenticated users */}
          {isAuthenticated && (
            <IconButton
              onClick={() => navigate('/profile')}
              sx={{
                border: 'none !important',
                outline: 'none !important',
                boxShadow: 'none !important',
                '&:hover': {
                  backgroundColor: 'transparent',
                  border: 'none !important',
                  outline: 'none !important',
                  boxShadow: 'none !important',
                  '& .MuiAvatar-root': {
                    transform: 'scale(1.1)',
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
              <Avatar
                src={user?.profile_picture}
                alt={user?.name || 'User'}
                sx={{
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  border: '1px solid',
                  borderColor: darkMode ? '#ffffff' : 'primary.main',
                }}
              >
                {!user?.profile_picture && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
              </Avatar>
            </IconButton>
          )}
          
          <DarkModeToggle />
          {isAuthenticated && <LogoutButton />}
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
            {/* Add logout button in mobile drawer for authenticated users */}
            {isAuthenticated && (
              <Box sx={{ p: 2 }}>
                <LogoutButton />
              </Box>
            )}
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
