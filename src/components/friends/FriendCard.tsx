import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { FriendProfile } from '../../types/friends';

interface FriendCardProps {
  friend: FriendProfile;
  onMessage?: (friendId: string) => void;
  onViewProfile?: (friendId: string) => void;
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

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onMessage,
  onViewProfile,
}) => {
  const locationText = friend.location && (typeof friend.location === 'object') && friend.location.city
    ? `${friend.location.city}${friend.location.state ? `, ${friend.location.state}` : ''}`
    : null;

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: '16px',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          borderColor: 'rgba(162, 155, 254, 0.4)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        src={friend.profile_picture}
        alt={friend.name}
        sx={{
          width: 72,
          height: 72,
          fontSize: '1.6rem',
          fontWeight: 700,
          backgroundColor: '#A29BFE',
          color: '#fff',
          mb: 1.5,
        }}
      >
        {friend.name.charAt(0).toUpperCase()}
      </Avatar>

      {/* Name */}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        {friend.name}
      </Typography>

      {/* Location */}
      {locationText && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, mt: 0.5 }}>
          <LocationOn sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {locationText}
          </Typography>
        </Box>
      )}

      {/* Interest Chips */}
      {friend.interests && friend.interests.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5, justifyContent: 'center' }}>
          {friend.interests.slice(0, 3).map((interest) => (
            <Chip key={interest} label={interest} size="small" sx={interestChipSx} />
          ))}
          {friend.interests.length > 3 && (
            <Chip
              label={`+${friend.interests.length - 3}`}
              size="small"
              sx={{ ...interestChipSx, backgroundColor: 'transparent', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }}
            />
          )}
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2, width: '100%' }}>
        {onViewProfile && (
          <Button
            variant="outlined"
            onClick={() => onViewProfile(friend.id)}
            size="small"
            fullWidth
            sx={{ borderRadius: '100px', height: 32, fontSize: '0.75rem', textTransform: 'none' }}
          >
            Profile
          </Button>
        )}
        {onMessage && (
          <Button
            variant="contained"
            onClick={() => onMessage(friend.id)}
            size="small"
            fullWidth
            sx={{ borderRadius: '100px', height: 32, fontSize: '0.75rem', textTransform: 'none' }}
          >
            Message
          </Button>
        )}
      </Box>
    </Box>
  );
};

const MemoFriendCard = React.memo(FriendCard);
export { MemoFriendCard as FriendCard };
export default MemoFriendCard;
