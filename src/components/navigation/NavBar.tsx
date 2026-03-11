import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
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

  const navItems: NavItem[] = isAuthenticated
    ? [
        { text: 'Events', route: '/events' },
        { text: 'My Events', route: '/events/my' },
        { text: 'Friends', route: '/friends' },
        { text: 'Interests', route: '/interests' },
        ...(user?.role === 'admin' ? [{ text: 'Admin', route: '/admin' }] : []),
      ]
    : [
        { text: 'Events', route: '/events' },
        { text: 'Login', route: '/login' },
      ];

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        backgroundColor: darkMode ? '#0c0c0c' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
    >
      {/* Drawer Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5 }}>
        <Box
          component="span"
          onClick={() => { navigate(isAuthenticated ? '/home' : '/'); setDrawerOpen(false); }}
          sx={{
            background: 'linear-gradient(135deg, #FFBF49 0%, #FF8C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
            fontSize: '1.35rem',
            letterSpacing: '-0.5px',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          sahana
        </Box>
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{ color: darkMode ? '#888' : '#666', '&:hover': { backgroundColor: 'transparent' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

      {/* Nav Items */}
      <List sx={{ flex: 1, py: 1.5 }}>
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => { navigate('/profile'); setDrawerOpen(false); }}
              sx={{ px: 2.5, py: 1.2, '&:hover': { backgroundColor: 'transparent', '& .MuiListItemText-primary': { color: '#FFBF49' } } }}
            >
              <ListItemText
                primary="Profile"
                sx={{ '& .MuiListItemText-primary': { fontWeight: 500, color: darkMode ? '#f2f2f2' : '#111111', fontSize: '0.95rem' } }}
              />
            </ListItemButton>
          </ListItem>
        )}
        {navItems.map(({ text, route }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => { navigate(route); setDrawerOpen(false); }}
              sx={{ px: 2.5, py: 1.2, '&:hover': { backgroundColor: 'transparent', '& .MuiListItemText-primary': { color: '#FFBF49' } } }}
            >
              <ListItemText
                primary={text}
                sx={{ '& .MuiListItemText-primary': { fontWeight: 500, color: darkMode ? '#f2f2f2' : '#111111', fontSize: '0.95rem' } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

      {/* Drawer Footer */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DarkModeToggle />
        {isAuthenticated && <LogoutButton />}
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: darkMode ? '#0c0c0c' : '#ffffff',
        boxShadow: 'none',
        borderBottom: darkMode
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid rgba(0,0,0,0.07)',
        top: 0,
      }}
    >
      <Toolbar sx={{ height: '56px', px: { xs: 2, md: 4 }, minHeight: '56px !important' }}>
        {/* Logo */}
        <Box
          component="span"
          onClick={() => navigate(isAuthenticated ? '/home' : '/')}
          sx={{
            background: 'linear-gradient(135deg, #FFBF49 0%, #FF8C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.5px',
            cursor: 'pointer',
            flexGrow: 1,
            fontFamily: "'Inter', sans-serif",
            userSelect: 'none',
          }}
        >
          sahana
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
          <LocationNavbar />

          {navItems.map((item) => (
            <Button
              key={item.text}
              sx={{
                color: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
                fontSize: '0.875rem',
                fontWeight: 500,
                px: 1.5,
                minHeight: 'unset',
                height: 36,
                borderRadius: '8px',
                transition: 'all 0.15s ease',
                '&:hover': {
                  color: darkMode ? '#ffffff' : '#000000',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                },
              }}
              onClick={() => navigate(item.route)}
            >
              {item.text}
            </Button>
          ))}

          {isAuthenticated && (
            <IconButton
              onClick={() => navigate('/profile')}
              sx={{
                ml: 0.5,
                p: 0.5,
                '&:hover': { backgroundColor: 'transparent' },
              }}
            >
              <Avatar
                src={user?.profile_picture}
                alt={user?.name || 'User'}
                sx={{
                  width: 30,
                  height: 30,
                  cursor: 'pointer',
                  border: '2px solid #FFBF49',
                  transition: 'transform 0.15s ease',
                  '&:hover': { transform: 'scale(1.08)' },
                }}
              >
                {!user?.profile_picture && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
              </Avatar>
            </IconButton>
          )}

          <DarkModeToggle />
          {isAuthenticated && <LogoutButton />}
        </Box>

        {/* Mobile Controls */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
          <DarkModeToggle />
          <IconButton
            size="medium"
            onClick={toggleDrawer(true)}
            sx={{
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              '&:hover': { backgroundColor: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                boxShadow: darkMode ? '-8px 0 32px rgba(0,0,0,0.5)' : '-8px 0 32px rgba(0,0,0,0.12)',
              }
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
