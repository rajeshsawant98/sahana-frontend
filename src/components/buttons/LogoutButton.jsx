import React from 'react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button } from '@mui/material';

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  return (
    <Button
      onClick={handleLogout}
      startIcon={<LogoutOutlinedIcon/>}
      sx={{
        textTransform: 'none', // Avoid all-uppercase text
        fontWeight: 500,
        '&:hover': {
          color: 'red', // Subtle hover effect for red
          backgroundColor: "transparent",
        },
      }}
    >
    </Button>
  );
};

export default LogoutButton;