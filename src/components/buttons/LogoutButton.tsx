import React from 'react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button } from '@mui/material';
import { logout } from '../../redux/slices/authSlice';
import { resetUserEvents } from '../../redux/slices/userEventsSlice';
import { useDispatch } from "react-redux";
import { AppDispatch } from '../../redux/store';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = (): void => {
    dispatch(logout());
    dispatch(resetUserEvents());
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
