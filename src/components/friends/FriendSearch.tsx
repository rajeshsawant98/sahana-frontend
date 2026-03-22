import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, PersonAdd, Check, Schedule, LocationOn } from '@mui/icons-material';
import { useFriends } from '../../hooks/useFriends';
import { UserSearchResult } from '../../types/friends';

const interestChipSx = {
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '0.7rem',
  height: 22,
  backgroundColor: 'rgba(255, 191, 73, 0.12)',
  color: '#FFBF49',
  border: '1px solid rgba(255, 191, 73, 0.2)',
} as const;

export const FriendSearch: React.FC = () => {
  const {
    ui,
    searchResults,
    loading,
    errors,
    handleSearchTermChange,
    handleSendFriendRequest
  } = useFriends();

  const handleSendRequest = async (userId: string) => {
    const result = await handleSendFriendRequest(userId);
    if (!result.success) {
      console.error('Failed to send friend request:', result.error);
    }
  };

  const getStatusButton = (user: UserSearchResult) => {
    const baseSx = { borderRadius: '100px', px: 2, height: 32, fontSize: '0.75rem', textTransform: 'none' as const };
    switch (user.friendship_status) {
      case 'friends':
        return (
          <Button variant="outlined" startIcon={<Check sx={{ fontSize: 16 }} />} disabled color="success" sx={baseSx}>
            Friends
          </Button>
        );
      case 'pending_sent':
        return (
          <Button variant="outlined" startIcon={<Schedule sx={{ fontSize: 16 }} />} disabled color="warning" sx={baseSx}>
            Sent
          </Button>
        );
      case 'pending_received':
        return (
          <Button variant="outlined" startIcon={<Schedule sx={{ fontSize: 16 }} />} disabled color="info" sx={baseSx}>
            Received
          </Button>
        );
      case 'none':
      default:
        return (
          <Button
            variant="contained"
            startIcon={<PersonAdd sx={{ fontSize: 16 }} />}
            onClick={() => handleSendRequest(user.id)}
            disabled={loading.sendRequest}
            sx={baseSx}
          >
            Add Friend
          </Button>
        );
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search users by name or email..."
        value={ui.searchTerm}
        onChange={(e) => handleSearchTermChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: loading.search && (
            <InputAdornment position="end">
              <CircularProgress size={18} sx={{ color: '#FFBF49' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          },
        }}
      />

      {errors.search && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
          {errors.search}
        </Alert>
      )}

      {errors.sendRequest && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
          {errors.sendRequest}
        </Alert>
      )}

      <Stack spacing={1.5}>
        {searchResults.map((user) => (
          <Box
            key={user.id}
            sx={{
              p: 2.5,
              borderRadius: '14px',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2.5,
              transition: 'border-color 0.15s ease',
              '&:hover': { borderColor: 'rgba(162, 155, 254, 0.4)' },
            }}
          >
            <Avatar
              src={user.profile_picture}
              alt={user.name}
              sx={{
                width: 48,
                height: 48,
                fontSize: '1.1rem',
                fontWeight: 700,
                backgroundColor: '#A29BFE',
                color: '#fff',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            <Box flex={1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {user.email}
              </Typography>

              {user.bio && (
                <Typography variant="body2" sx={{ mt: 0.75, lineHeight: 1.5, color: 'text.secondary' }}>
                  {user.bio}
                </Typography>
              )}

              {user.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary">
                    {user.location.address}
                  </Typography>
                </Box>
              )}

              {user.interests && user.interests.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {user.interests.slice(0, 3).map((interest) => (
                    <Chip key={interest} label={interest} size="small" sx={interestChipSx} />
                  ))}
                  {user.interests.length > 3 && (
                    <Chip
                      label={`+${user.interests.length - 3}`}
                      size="small"
                      sx={{ ...interestChipSx, backgroundColor: 'transparent', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }}
                    />
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{ flexShrink: 0 }}>{getStatusButton(user)}</Box>
          </Box>
        ))}

        {ui.searchTerm.trim() && !loading.search && searchResults.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: '14px',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No results for "{ui.searchTerm}". Try a different name or email.
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
