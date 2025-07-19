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
} from '@mui/material';
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
    const tabs = ['friends', 'search', 'requests'] as const;
    friendsState.handleTabChange(tabs[newValue]);
  };

  const handleViewProfile = (friendId: string) => {
    // TODO: Navigate to friend's profile page
  };  const handleMessage = (friendId: string) => {
    // TODO: Open messaging interface
  };

  const tabIndex = friendsState.ui.selectedTab === 'friends' ? 0 
    : friendsState.ui.selectedTab === 'search' ? 1 : 2;

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Friends
        </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab 
            label={
              <Badge badgeContent={friendsState.friends.length} color="primary">
                My Friends
              </Badge>
            } 
          />
          <Tab label="Search Users" />
          <Tab 
            label={
              <Badge 
                badgeContent={friendRequestsState.received.length} 
                color="error"
              >
                Requests
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* Friends List Tab */}
      {friendsState.ui.selectedTab === 'friends' && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Your Friends ({friendsState.friends.length})
            </Typography>
            <Button
              startIcon={<Refresh />}
              onClick={friendsState.refreshFriends}
              disabled={friendsState.loading.friends}
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
                  friend={friend}
                  onViewProfile={handleViewProfile}
                  onMessage={handleMessage}
                />
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Search Tab */}
      {friendsState.ui.selectedTab === 'search' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Find New Friends
          </Typography>
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
