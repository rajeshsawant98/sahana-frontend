import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleDarkMode } from '../redux/slices/themeSlice';

const DarkModeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton
        onClick={handleToggle}
        sx={{
          color: darkMode ? '#ffffff' : '#333333',
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
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
