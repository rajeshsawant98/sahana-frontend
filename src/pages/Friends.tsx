import React from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
// Note: Tabs/Tab/Badge kept for the nested friend requests sub-tabs
import { Refresh } from '@mui/icons-material';
import { useFriends } from '../hooks/useFriends';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { FriendCard } from '../components/friends/FriendCard';
import { FriendSearch } from '../components/friends/FriendSearch';
import { FriendRequestCard } from '../components/friends/FriendRequestCard';
import { NavBar } from '../components/navigation';

export const Friends: React.FC = () => {
  const friendsState = useFriends();
  const friendRequestsState = useFriendRequests();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const tabs = ['friends', 'recommended', 'search', 'requests'] as const;
    friendsState.handleTabChange(tabs[newValue]);
  };

  const handleViewProfile = (friendId: string) => {
    // TODO: Navigate to friend's profile page
  };  const handleMessage = (friendId: string) => {
    // TODO: Open messaging interface
  };

  const tabIndex = friendsState.ui.selectedTab === 'friends' ? 0 
    : friendsState.ui.selectedTab === 'recommended' ? 1
    : friendsState.ui.selectedTab === 'search' ? 2 : 3;

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.3px', mb: 3 }}>
          Friends
        </Typography>

      {/* Pill Tab Switcher */}
      <Box
        sx={{
          display: 'inline-flex',
          gap: 0.5,
          p: 0.5,
          borderRadius: '12px',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          mb: 3,
        }}
      >
        {[
          { label: 'My Friends', count: friendsState.friends.length, countColor: 'primary' as const },
          { label: 'Recommended', count: friendsState.recommendations.length, countColor: 'primary' as const },
          { label: 'Search', count: undefined, countColor: undefined },
          { label: 'Requests', count: friendRequestsState.received.length, countColor: 'error' as const },
        ].map((tab, index) => (
          <Box
            key={index}
            onClick={(e) => handleTabChange(e, index)}
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              fontWeight: tabIndex === index ? 600 : 500,
              color: tabIndex === index
                ? (theme) => theme.palette.mode === 'dark' ? '#000' : '#000'
                : 'text.secondary',
              backgroundColor: tabIndex === index ? '#FFBF49' : 'transparent',
              transition: 'all 0.15s ease',
              userSelect: 'none',
              '&:hover': {
                color: tabIndex === index ? '#000' : 'text.primary',
              },
            }}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Box
                sx={{
                  minWidth: 18,
                  height: 18,
                  borderRadius: '100px',
                  backgroundColor: tabIndex === index
                    ? 'rgba(0,0,0,0.15)'
                    : tab.countColor === 'error' ? '#ef4444' : '#FFBF49',
                  color: tabIndex === index ? '#000' : '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 0.5,
                }}
              >
                {tab.count}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Friends List Tab */}
      {friendsState.ui.selectedTab === 'friends' && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {friendsState.friends.length} friend{friendsState.friends.length !== 1 ? 's' : ''}
            </Typography>
            <Button
              startIcon={<Refresh />}
              onClick={friendsState.refreshFriends}
              disabled={friendsState.loading.friends}
              size="small"
              sx={{ borderRadius: '100px', px: 2, height: 32, fontSize: '0.8rem' }}
            >
              Refresh
            </Button>
          </Box>

          {friendsState.loading.friends ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : friendsState.errors.friends ? (
            <Alert severity="error">{friendsState.errors.friends}</Alert>
          ) : friendsState.friends.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No friends yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search for users and send friend requests to start building your network!
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {friendsState.friends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={{
                    id: friend.id,
                    name: friend.name ?? 'Unknown',
                    email: friend.email ?? '',
                    bio: friend.bio,
                    profile_picture: friend.profile_picture,
                    location: friend.location,
                    interests: friend.interests,
                    created_at: friend.created_at,
                  }}
                  onViewProfile={handleViewProfile}
                  onMessage={handleMessage}
                />
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Recommended Tab */}
      {friendsState.ui.selectedTab === 'recommended' && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {friendsState.recommendations.length} recommendation{friendsState.recommendations.length !== 1 ? 's' : ''}
            </Typography>
            <Button
              startIcon={<Refresh />}
              onClick={friendsState.refreshRecommendations}
              disabled={friendsState.loading.recommendations}
              size="small"
              sx={{ borderRadius: '100px', px: 2, height: 32, fontSize: '0.8rem' }}
            >
              Refresh
            </Button>
          </Box>

          {friendsState.loading.recommendations ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : friendsState.errors.recommendations ? (
            <Alert severity="error">{friendsState.errors.recommendations}</Alert>
          ) : friendsState.recommendations.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No recommendations yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your profile and interests to get personalized friend suggestions!
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {friendsState.recommendations.map((rec) => (
                <Card key={rec.id} variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={rec.profile_picture}
                        alt={rec.name}
                        sx={{ width: 64, height: 64 }}
                      >
                        {rec.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={0.25}>
                          <Typography variant="h6">{rec.name}</Typography>
                          <Chip
                            label={`${Math.round(rec.score * 100)}% match`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 191, 73, 0.15)',
                              color: '#FFBF49',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 22,
                            }}
                          />
                        </Box>
                        {rec.profession && (
                          <Typography variant="body2" color="text.secondary">
                            {rec.profession}
                          </Typography>
                        )}
                        {rec.bio && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {rec.bio}
                          </Typography>
                        )}
                        {rec.vibe_description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                            "{rec.vibe_description}"
                          </Typography>
                        )}
                        {rec.location && (typeof rec.location === 'object') && rec.location.city && (
                          <Typography variant="caption" color="text.secondary">
                            📍 {rec.location.city}{rec.location.state ? `, ${rec.location.state}` : ''}
                          </Typography>
                        )}
                        {rec.interests && rec.interests.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {rec.interests.slice(0, 4).map((interest) => (
                              <Chip
                                key={interest}
                                label={interest}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                            {rec.interests.length > 4 && (
                              <Chip
                                label={`+${rec.interests.length - 4} more`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Search Tab */}
      {friendsState.ui.selectedTab === 'search' && (
        <Box>
          <FriendSearch />
        </Box>
      )}

      {/* Friend Requests Tab */}
      {friendsState.ui.selectedTab === 'requests' && (
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={friendRequestsState.ui.activeTab === 'received' ? 0 : 1}
              onChange={(_, newValue) => 
                friendRequestsState.handleTabChange(newValue === 0 ? 'received' : 'sent')
              }
            >
              <Tab 
                label={
                  <Badge badgeContent={friendRequestsState.received.length} color="error">
                    Received
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={friendRequestsState.sent.length} color="warning">
                    Sent
                  </Badge>
                } 
              />
            </Tabs>
          </Box>

          {friendRequestsState.loading.fetch ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : friendRequestsState.errors.fetch ? (
            <Alert severity="error">{friendRequestsState.errors.fetch}</Alert>
          ) : (
            <Stack spacing={2}>
              {friendRequestsState.ui.activeTab === 'received' && (
                <>
                  {friendRequestsState.received.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                      No pending friend requests
                    </Typography>
                  ) : (
                    friendRequestsState.received.map((request) => (
                      <FriendRequestCard
                        key={request.id}
                        request={request}
                        type="received"
                        onAccept={friendRequestsState.handleAcceptRequest}
                        onReject={friendRequestsState.handleRejectRequest}
                        loading={friendRequestsState.loading.respond[request.id]}
                        error={friendRequestsState.errors.respond[request.id]}
                      />
                    ))
                  )}
                </>
              )}

              {friendRequestsState.ui.activeTab === 'sent' && (
                <>
                  {friendRequestsState.sent.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                      No pending sent requests
                    </Typography>
                  ) : (
                    friendRequestsState.sent.map((request) => (
                      <FriendRequestCard
                        key={request.id}
                        request={request}
                        type="sent"
                        onCancel={friendRequestsState.handleCancelRequest}
                        loading={friendRequestsState.loading.respond[request.id]}
                        error={friendRequestsState.errors.respond[request.id]}
                      />
                    ))
                  )}
                </>
              )}
            </Stack>
          )}
        </Box>
      )}
    </Container>
    </>
  );
};

export default Friends;
