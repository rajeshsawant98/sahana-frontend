import React from 'react';
import {
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

const interestChipSx = {
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '0.7rem',
  height: 22,
  backgroundColor: 'rgba(255, 191, 73, 0.12)',
  color: '#FFBF49',
  border: '1px solid rgba(255, 191, 73, 0.2)',
} as const;

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

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: '14px',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'border-color 0.15s ease',
        '&:hover': { borderColor: isReceived ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 152, 0, 0.4)' },
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      <Box display="flex" alignItems="flex-start" gap={2.5}>
        <Avatar
          src={profile.profile_picture}
          alt={profile.name}
          sx={{
            width: 48,
            height: 48,
            fontSize: '1.1rem',
            fontWeight: 700,
            backgroundColor: isReceived ? '#4CAF50' : '#FF9800',
            color: '#fff',
          }}
        >
          {profile.name.charAt(0).toUpperCase()}
        </Avatar>

        <Box flex={1} sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {profile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {profile.email}
          </Typography>

          {profile.bio && (
            <Typography variant="body2" sx={{ mt: 0.75, lineHeight: 1.5, color: 'text.secondary' }}>
              {profile.bio}
            </Typography>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {profile.interests.slice(0, 3).map((interest) => (
                <Chip key={interest} label={interest} size="small" sx={interestChipSx} />
              ))}
              {profile.interests.length > 3 && (
                <Chip
                  label={`+${profile.interests.length - 3}`}
                  size="small"
                  sx={{ ...interestChipSx, backgroundColor: 'transparent', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }}
                />
              )}
            </Box>
          )}

          <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.75 }}>
            {isReceived ? 'Received' : 'Sent'} {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#FFBF49' }} />
          ) : (
            <Stack direction="row" spacing={1}>
              {isReceived ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Check sx={{ fontSize: 16 }} />}
                    onClick={() => onAccept?.(request.id)}
                    size="small"
                    sx={{ borderRadius: '100px', px: 2, height: 32, fontSize: '0.75rem', textTransform: 'none' }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Close sx={{ fontSize: 16 }} />}
                    onClick={() => onReject?.(request.id)}
                    size="small"
                    sx={{ borderRadius: '100px', px: 2, height: 32, fontSize: '0.75rem', textTransform: 'none' }}
                  >
                    Decline
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<Cancel sx={{ fontSize: 16 }} />}
                  onClick={() => onCancel?.(request.id)}
                  size="small"
                  sx={{ borderRadius: '100px', px: 2, height: 32, fontSize: '0.75rem', textTransform: 'none' }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
};
