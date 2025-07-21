import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import { Message, Person } from '@mui/icons-material';
import { FriendProfile } from '../../types/friends';

interface FriendCardProps {
  friend: FriendProfile;
  onMessage?: (friendId: string) => void;
  onViewProfile?: (friendId: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onMessage,
  onViewProfile,
}) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={friend.profile_picture}
            alt={friend.name}
            sx={{ width: 64, height: 64 }}
          >
            {friend.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box flex={1}>
            <Typography variant="h6">{friend.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {friend.email}
            </Typography>
            
            {friend.bio && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {friend.bio}
              </Typography>
            )}
            
            {friend.location && (typeof friend.location === 'object') && (
              <Typography variant="caption" color="text.secondary">
               📍 {friend.location.city || ''}, {friend.location.state || ''}

              </Typography>
            )}
            
            {friend.interests && friend.interests.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {friend.interests.slice(0, 4).map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
                {friend.interests.length > 4 && (
                  <Chip
                    label={`+${friend.interests.length - 4} more`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
            
            {friend.created_at && (
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Friends since {new Date(friend.created_at).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          
          <Box>
            <Box display="flex" flexDirection="column" gap={1}>
              {onViewProfile && (
                <Button
                  variant="outlined"
                  startIcon={<Person />}
                  onClick={() => onViewProfile(friend.id)}
                  size="small"
                >
                  Profile
                </Button>
              )}
              {onMessage && (
                <Button
                  variant="contained"
                  startIcon={<Message />}
                  onClick={() => onMessage(friend.id)}
                  size="small"
                >
                  Message
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
