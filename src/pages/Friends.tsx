import React from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Refresh,
  People,
  PersonSearch,
  Recommend,
  Inbox,
  Send,
  LocationOn,
} from '@mui/icons-material';
import { useFriends } from '../hooks/useFriends';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { FriendCard } from '../components/friends/FriendCard';
import { FriendSearch } from '../components/friends/FriendSearch';
import { FriendRequestCard } from '../components/friends/FriendRequestCard';
import { NavBar } from '../components/navigation';

// Styled empty state component
const EmptyState: React.FC<{ icon: React.ReactNode; title: string; message: string }> = ({ icon, title, message }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      borderRadius: '16px',
      backgroundColor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '14px',
        backgroundColor: 'rgba(162, 155, 254, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#A29BFE',
        mx: 'auto',
        mb: 2,
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mx: 'auto' }}>
      {message}
    </Typography>
  </Box>
);

export const Friends: React.FC = () => {
  const friendsState = useFriends();
  const friendRequestsState = useFriendRequests();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const tabs = ['friends', 'recommended', 'search', 'requests'] as const;
    friendsState.handleTabChange(tabs[newValue]);
  };

  const handleViewProfile = (friendId: string) => {
    // TODO: Navigate to friend's profile page
  };
  const handleMessage = (friendId: string) => {
    // TODO: Open messaging interface
  };

  const tabIndex = friendsState.ui.selectedTab === 'friends' ? 0
    : friendsState.ui.selectedTab === 'recommended' ? 1
    : friendsState.ui.selectedTab === 'search' ? 2 : 3;

  // Request sub-tab state
  const requestSubTab = friendRequestsState.ui.activeTab;

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'rgba(162, 155, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A29BFE',
              }}
            >
              <People sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                Friends
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with people and grow your community.
              </Typography>
            </Box>
          </Box>

          {/* Pill Tab Switcher */}
          <Box
            sx={{
              display: 'inline-flex',
              gap: 0.5,
              p: 0.5,
              borderRadius: '12px',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'My Friends', icon: <People sx={{ fontSize: 15 }} />, count: friendsState.friends.length, countColor: 'primary' as const },
              { label: 'Recommended', icon: <Recommend sx={{ fontSize: 15 }} />, count: friendsState.recommendations.length, countColor: 'primary' as const },
              { label: 'Search', icon: <PersonSearch sx={{ fontSize: 15 }} />, count: undefined, countColor: undefined },
              { label: 'Requests', icon: <Inbox sx={{ fontSize: 15 }} />, count: friendRequestsState.received.length, countColor: 'error' as const },
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
                  gap: 0.5,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: tabIndex === index ? 600 : 500,
                  color: tabIndex === index ? '#000' : 'text.secondary',
                  backgroundColor: tabIndex === index ? '#FFBF49' : 'transparent',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                  '&:hover': {
                    color: tabIndex === index ? '#000' : 'text.primary',
                  },
                }}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <Box
                    sx={{
                      minWidth: 18,
                      height: 18,
                      borderRadius: '100px',
                      backgroundColor: tabIndex === index
                        ? 'rgba(0,0,0,0.15)'
                        : tab.countColor === 'error' ? '#ef4444' : 'rgba(255,191,73,0.2)',
                      color: tabIndex === index ? '#000' : tab.countColor === 'error' ? '#fff' : '#FFBF49',
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {friendsState.friends.length} friend{friendsState.friends.length !== 1 ? 's' : ''}
                </Typography>
                <Button
                  startIcon={<Refresh sx={{ fontSize: 16 }} />}
                  onClick={friendsState.refreshFriends}
                  disabled={friendsState.loading.friends}
                  size="small"
                  sx={{ borderRadius: '100px', px: 2, height: 30, fontSize: '0.75rem' }}
                >
                  Refresh
                </Button>
              </Box>

              {friendsState.loading.friends ? (
                <Box display="flex" justifyContent="center" py={6}>
                  <CircularProgress sx={{ color: '#FFBF49' }} />
                </Box>
              ) : friendsState.errors.friends ? (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>{friendsState.errors.friends}</Alert>
              ) : friendsState.friends.length === 0 ? (
                <EmptyState
                  icon={<People sx={{ fontSize: 24 }} />}
                  title="No friends yet"
                  message="Search for users and send friend requests to start building your network!"
                />
              ) : (
                <Stack spacing={1.5}>
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {friendsState.recommendations.length} recommendation{friendsState.recommendations.length !== 1 ? 's' : ''}
                </Typography>
                <Button
                  startIcon={<Refresh sx={{ fontSize: 16 }} />}
                  onClick={friendsState.refreshRecommendations}
                  disabled={friendsState.loading.recommendations}
                  size="small"
                  sx={{ borderRadius: '100px', px: 2, height: 30, fontSize: '0.75rem' }}
                >
                  Refresh
                </Button>
              </Box>

              {friendsState.loading.recommendations ? (
                <Box display="flex" justifyContent="center" py={6}>
                  <CircularProgress sx={{ color: '#FFBF49' }} />
                </Box>
              ) : friendsState.errors.recommendations ? (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>{friendsState.errors.recommendations}</Alert>
              ) : friendsState.recommendations.length === 0 ? (
                <EmptyState
                  icon={<Recommend sx={{ fontSize: 24 }} />}
                  title="No recommendations yet"
                  message="Update your profile and interests to get personalized friend suggestions!"
                />
              ) : (
                <Stack spacing={1.5}>
                  {friendsState.recommendations.map((rec) => (
                    <Box
                      key={rec.id}
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
                        '&:hover': { borderColor: 'rgba(255, 191, 73, 0.4)' },
                      }}
                    >
                      <Avatar
                        src={rec.profile_picture}
                        alt={rec.name}
                        sx={{
                          width: 56,
                          height: 56,
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          backgroundColor: '#A29BFE',
                          color: '#fff',
                        }}
                      >
                        {rec.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box flex={1} sx={{ minWidth: 0 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={0.25}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                            {rec.name}
                          </Typography>
                          <Chip
                            label={`${Math.round(rec.score * 100)}% match`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 191, 73, 0.15)',
                              color: '#FFBF49',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              height: 22,
                              borderRadius: '100px',
                            }}
                          />
                        </Box>
                        {rec.profession && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {rec.profession}
                          </Typography>
                        )}
                        {rec.bio && (
                          <Typography variant="body2" sx={{ mt: 0.75, lineHeight: 1.5, color: 'text.secondary' }}>
                            {rec.bio}
                          </Typography>
                        )}
                        {rec.vibe_description && (
                          <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: 'text.disabled', fontSize: '0.85rem' }}>
                            "{rec.vibe_description}"
                          </Typography>
                        )}
                        {rec.location && (typeof rec.location === 'object') && rec.location.city && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <LocationOn sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                              {rec.location.city}{rec.location.state ? `, ${rec.location.state}` : ''}
                            </Typography>
                          </Box>
                        )}
                        {rec.interests && rec.interests.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.25 }}>
                            {rec.interests.slice(0, 4).map((interest) => (
                              <Chip
                                key={interest}
                                label={interest}
                                size="small"
                                sx={{
                                  borderRadius: '8px',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                  height: 24,
                                  backgroundColor: 'rgba(255, 191, 73, 0.12)',
                                  color: '#FFBF49',
                                  border: '1px solid rgba(255, 191, 73, 0.2)',
                                }}
                              />
                            ))}
                            {rec.interests.length > 4 && (
                              <Chip
                                label={`+${rec.interests.length - 4}`}
                                size="small"
                                sx={{
                                  borderRadius: '8px',
                                  fontSize: '0.75rem',
                                  height: 24,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  color: 'text.secondary',
                                  backgroundColor: 'transparent',
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
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
              {/* Request Sub-tabs */}
              <Box
                sx={{
                  display: 'inline-flex',
                  gap: 0.5,
                  p: 0.5,
                  borderRadius: '10px',
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  mb: 2.5,
                }}
              >
                {[
                  { label: 'Received', icon: <Inbox sx={{ fontSize: 14 }} />, key: 'received' as const, count: friendRequestsState.received.length },
                  { label: 'Sent', icon: <Send sx={{ fontSize: 14 }} />, key: 'sent' as const, count: friendRequestsState.sent.length },
                ].map((sub) => (
                  <Box
                    key={sub.key}
                    onClick={() => friendRequestsState.handleTabChange(sub.key)}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.825rem',
                      fontWeight: requestSubTab === sub.key ? 600 : 500,
                      color: requestSubTab === sub.key ? '#000' : 'text.secondary',
                      backgroundColor: requestSubTab === sub.key ? '#A29BFE' : 'transparent',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    {sub.icon}
                    {sub.label}
                    {sub.count > 0 && (
                      <Box
                        sx={{
                          minWidth: 16,
                          height: 16,
                          borderRadius: '100px',
                          backgroundColor: requestSubTab === sub.key ? 'rgba(0,0,0,0.15)' : sub.key === 'received' ? '#ef4444' : 'rgba(255,152,0,0.2)',
                          color: requestSubTab === sub.key ? '#000' : sub.key === 'received' ? '#fff' : '#FF9800',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: 0.4,
                        }}
                      >
                        {sub.count}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>

              {friendRequestsState.loading.fetch ? (
                <Box display="flex" justifyContent="center" py={6}>
                  <CircularProgress sx={{ color: '#A29BFE' }} />
                </Box>
              ) : friendRequestsState.errors.fetch ? (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>{friendRequestsState.errors.fetch}</Alert>
              ) : (
                <Stack spacing={1.5}>
                  {requestSubTab === 'received' && (
                    <>
                      {friendRequestsState.received.length === 0 ? (
                        <EmptyState
                          icon={<Inbox sx={{ fontSize: 24 }} />}
                          title="No pending requests"
                          message="You're all caught up! New friend requests will appear here."
                        />
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

                  {requestSubTab === 'sent' && (
                    <>
                      {friendRequestsState.sent.length === 0 ? (
                        <EmptyState
                          icon={<Send sx={{ fontSize: 24 }} />}
                          title="No pending sent requests"
                          message="Search for people and send friend requests to see them here."
                        />
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
      </Box>
    </>
  );
};

export default Friends;
