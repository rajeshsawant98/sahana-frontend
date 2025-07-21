import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Check, Close, Cancel } from '@mui/icons-material';
import { FriendRequest } from '../../types/friends';

interface FriendRequestCardProps {
  request: FriendRequest;
  type: 'received' | 'sent';
  onAccept?: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  onReject?: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  onCancel?: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
  error?: string;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
  loading = false,
  error,
}) => {
  const profile = type === 'received' ? request.sender : request.receiver;
  const isReceived = type === 'received';

  const handleAccept = () => {
    if (onAccept) {
      onAccept(request.id);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(request.id);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(request.id);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={profile.profile_picture}
            alt={profile.name}
            sx={{ width: 56, height: 56 }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box flex={1}>
            <Typography variant="h6">{profile.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.email}
            </Typography>
            
            {profile.bio && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {profile.bio}
              </Typography>
            )}
            

            
            {profile.interests && profile.interests.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {profile.interests.slice(0, 3).map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
                {profile.interests.length > 3 && (
                  <Chip
                    label={`+${profile.interests.length - 3} more`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
            
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              {isReceived ? 'Sent' : 'Sent to'} {new Date(request.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Stack direction="row" spacing={1}>
                {isReceived ? (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Check />}
                      onClick={handleAccept}
                      size="small"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Close />}
                      onClick={handleReject}
                      size="small"
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    size="small"
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
