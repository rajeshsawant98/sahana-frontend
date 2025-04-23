import React from 'react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button } from '@mui/material';
import { logout } from '../../redux/slices/authSlice';
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const dispatch = useDispatch();

  
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("refreshToken");
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