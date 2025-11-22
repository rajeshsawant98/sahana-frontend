import React from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { User } from '../../types/User';

interface ProfileHeaderProps {
  profile: Partial<User>;
  isEditing: boolean;
  onEditToggle: () => void;
  darkMode: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  isEditing, 
  onEditToggle, 
  darkMode 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      mb: 4,
      pb: 3,
      borderBottom: darkMode ? '1px solid #333333' : '1px solid #e0e0e0'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={profile.profile_picture || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"}
          sx={{ 
            width: 72, 
            height: 72, 
            mr: 3
          }}
        />
        <Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 600, 
            color: darkMode ? '#ffffff' : '#333333',
            mb: 0.5 
          }}>
            {profile.name || "Not provided"}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: darkMode ? '#b0b0b0' : '#666666',
            fontSize: '14px'
          }}>
            {profile.email || "Not provided"}
          </Typography>
        </Box>
      </Box>
      {!isEditing && (
        <Button
          variant="contained"
          onClick={onEditToggle}
          startIcon={<EditIcon />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            px: 3,
            py: 1,
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Edit
        </Button>
      )}
    </Box>
  );
};
