import React from 'react';
import { Box, Avatar, Typography, Button, Chip } from '@mui/material';
import { Edit as EditIcon, LocationOn, Work } from '@mui/icons-material';
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
}) => {
  const locationText = profile.location?.city && profile.location?.country
    ? `${profile.location.city}, ${profile.location.country}`
    : null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Avatar
          src={profile.profile_picture || undefined}
          sx={{
            width: 80,
            height: 80,
            fontSize: '2rem',
            fontWeight: 700,
            backgroundColor: profile.profile_picture ? 'transparent' : '#FFBF49',
            color: '#000',
            border: '3px solid',
            borderColor: 'rgba(255, 191, 73, 0.3)',
          }}
        >
          {!profile.profile_picture && (profile.name?.[0]?.toUpperCase() || '?')}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.2px', lineHeight: 1.2 }}>
            {profile.name || "Not provided"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, mb: 0.75 }}>
            {profile.email || "Not provided"}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {profile.profession && (
              <Chip
                icon={<Work sx={{ fontSize: 14 }} />}
                label={profile.profession}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 191, 73, 0.12)',
                  color: '#FFBF49',
                  '& .MuiChip-icon': { color: '#FFBF49' },
                }}
              />
            )}
            {locationText && (
              <Chip
                icon={<LocationOn sx={{ fontSize: 14 }} />}
                label={locationText}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(73, 163, 255, 0.12)',
                  color: '#49A3FF',
                  '& .MuiChip-icon': { color: '#49A3FF' },
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
      {!isEditing && (
        <Button
          variant="outlined"
          onClick={onEditToggle}
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: '100px',
            textTransform: 'none',
            px: 2.5,
            height: 36,
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );
};
