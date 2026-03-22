import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { FriendProfile } from '../../types/friends';

interface FriendCardProps {
  friend: FriendProfile;
  onMessage?: (friendId: string) => void;
  onViewProfile?: (friendId: string) => void;
}

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
        borderRadius: '20px',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
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
          width: 80,
          height: 80,
          fontSize: '1.8rem',
          fontWeight: 700,
          backgroundColor: '#A29BFE',
          color: '#fff',
          mb: 1.5,
          boxShadow: '0 2px 12px rgba(162,155,254,0.25)',
        }}
      >
        {friend.name.charAt(0).toUpperCase()}
      </Avatar>

      {/* Name */}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
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
      {locationText ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, mt: 0.5 }}>
          <LocationOn sx={{ fontSize: 13, color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {locationText}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 0.5, height: 18 }} />
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2, width: '100%' }}>
        {onViewProfile && (
          <Button
            variant="outlined"
            onClick={() => onViewProfile(friend.id)}
            size="small"
            fullWidth
            sx={{ borderRadius: '100px', height: 34, fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 }}
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
            sx={{ borderRadius: '100px', height: 34, fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 }}
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
