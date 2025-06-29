import React from 'react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button } from '@mui/material';
import { logout } from '../../redux/slices/authSlice';
import { resetUserEvents } from '../../redux/slices/userEventsSlice';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../../redux/store';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

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
        color: darkMode ? '#ffffff' : '#333333',
        border: 'none !important',
        outline: 'none !important',
        boxShadow: 'none !important',
        '&:hover': {
          color: 'red', // Subtle hover effect for red
          backgroundColor: "transparent",
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
    </Button>
  );
};

export default LogoutButton;
