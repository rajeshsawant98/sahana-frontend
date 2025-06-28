import React from 'react';
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, PersonAdd, Check, Schedule } from '@mui/icons-material';
import { useFriends } from '../../hooks/useFriends';
import { UserSearchResult } from '../../types/friends';

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
      // Error handling is managed by Redux state
      console.error('Failed to send friend request:', result.error);
    }
  };

  const getStatusButton = (user: UserSearchResult) => {
    switch (user.friendship_status) {
      case 'friends':
        return (
          <Button
            variant="outlined"
            startIcon={<Check />}
            disabled
            color="success"
          >
            Friends
          </Button>
        );
      case 'pending_sent':
        return (
          <Button
            variant="outlined"
            startIcon={<Schedule />}
            disabled
            color="warning"
          >
            Request Sent
          </Button>
        );
      case 'pending_received':
        return (
          <Button
            variant="outlined"
            startIcon={<Schedule />}
            disabled
            color="info"
          >
            Request Received
          </Button>
        );
      case 'none':
      default:
        return (
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => handleSendRequest(user.id)}
            disabled={loading.sendRequest}
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
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: loading.search && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {errors.search && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.search}
        </Alert>
      )}

      {errors.sendRequest && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.sendRequest}
        </Alert>
      )}

      <Stack spacing={2}>
        {searchResults.map((user) => (
          <Card key={user.id} variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={user.profile_picture}
                  alt={user.name}
                  sx={{ width: 56, height: 56 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <Box flex={1}>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  
                  {user.bio && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {user.bio}
                    </Typography>
                  )}
                  
                  {user.location && (
                    <Typography variant="caption" color="text.secondary">
                      📍 {user.location.address}
                    </Typography>
                  )}
                  
                  {user.interests && user.interests.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {user.interests.slice(0, 3).map((interest) => (
                        <Chip
                          key={interest}
                          label={interest}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {user.interests.length > 3 && (
                        <Chip
                          label={`+${user.interests.length - 3} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                </Box>
                
                <Box>{getStatusButton(user)}</Box>
              </Box>
            </CardContent>
          </Card>
        ))}
        
        {ui.searchTerm.trim() && !loading.search && searchResults.length === 0 && (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
            No users found for "{ui.searchTerm}"
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
