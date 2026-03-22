import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid2,
  CircularProgress,
  Container,
  Button,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  EventNote,
  ConfirmationNumber,
  FavoriteBorder,
  Groups,
  Shield,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { NavBar } from "../components/navigation";
import { EventCard } from "../components/events";
import { InfiniteScroll } from "../components/ui";
import { Event } from "../types/Event";
import {
  fetchInitialCreatedEvents,
  fetchInitialRsvpEvents,
  fetchInitialOrganizedEvents,
  fetchInitialModeratedEvents,
  fetchInitialInterestedEvents,
  loadMoreCreatedEvents,
  loadMoreRsvpEvents,
  loadMoreOrganizedEvents,
  loadMoreModeratedEvents,
  loadMoreInterestedEvents,
  resetCreatedEvents,
  resetRSVPedEvents,
  resetOrganizedEvents,
  resetModeratedEvents,
  resetInterestedEvents,
} from "../redux/slices/userEventsSlice";

const MyEventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);

  const {
    created,
    rsvped,
    organized,
    moderated,
    interested,
  } = useAppSelector((state) => state.userEvents);

  const { user } = useAppSelector((state) => state.auth);

  // Tab configuration
  const tabs = useMemo(() => [
    {
      label: "Created",
      icon: <EventNote sx={{ fontSize: 16 }} />,
      state: created,
      fetchInitial: fetchInitialCreatedEvents,
      loadMore: loadMoreCreatedEvents,
      reset: resetCreatedEvents,
      emptyTitle: "No events created yet",
      emptyMessage: "Ready to bring people together? Create your first event and start building your community!",
      showCreate: true,
    },
    {
      label: "RSVP'd",
      icon: <ConfirmationNumber sx={{ fontSize: 16 }} />,
      state: rsvped,
      fetchInitial: fetchInitialRsvpEvents,
      loadMore: loadMoreRsvpEvents,
      reset: resetRSVPedEvents,
      emptyTitle: "No RSVPs yet",
      emptyMessage: "Browse events and RSVP to the ones that excite you!",
      showCreate: false,
    },
    {
      label: "Interested",
      icon: <FavoriteBorder sx={{ fontSize: 16 }} />,
      state: interested,
      fetchInitial: fetchInitialInterestedEvents,
      loadMore: loadMoreInterestedEvents,
      reset: resetInterestedEvents,
      emptyTitle: "Nothing saved yet",
      emptyMessage: "Tap the heart on events you're curious about to save them here.",
      showCreate: false,
    },
    {
      label: "Organized",
      icon: <Groups sx={{ fontSize: 16 }} />,
      state: organized,
      fetchInitial: fetchInitialOrganizedEvents,
      loadMore: loadMoreOrganizedEvents,
      reset: resetOrganizedEvents,
      emptyTitle: "Not organizing any events",
      emptyMessage: "When you're added as an organizer for an event, it'll show up here.",
      showCreate: false,
    },
    {
      label: "Moderated",
      icon: <Shield sx={{ fontSize: 16 }} />,
      state: moderated,
      fetchInitial: fetchInitialModeratedEvents,
      loadMore: loadMoreModeratedEvents,
      reset: resetModeratedEvents,
      emptyTitle: "Not moderating any events",
      emptyMessage: "When you're added as a moderator for an event, it'll show up here.",
      showCreate: false,
    },
  ], [created, rsvped, interested, organized, moderated]);

  const currentTab = tabs[activeTab];
  const currentState = currentTab.state;

  // Initial load for active tab
  useEffect(() => {
    if (!currentState.hasFetched && !currentState.loading) {
      dispatch(currentTab.fetchInitial({ page_size: 12 }));
    }
  }, [activeTab, currentState.hasFetched, currentState.loading, dispatch, currentTab]);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLoadMore = useCallback(() => {
    if (currentState.nextCursor && currentState.hasNext && !currentState.loadingMore) {
      dispatch(currentTab.loadMore({
        cursor: currentState.nextCursor,
        pageSize: currentState.pageSize,
      }));
    }
  }, [dispatch, currentState.nextCursor, currentState.hasNext, currentState.loadingMore, currentState.pageSize, currentTab.loadMore]);

  const handleRefresh = useCallback(() => {
    dispatch(currentTab.reset());
    dispatch(currentTab.fetchInitial({ page_size: currentState.pageSize }));
  }, [dispatch, currentTab.reset, currentTab.fetchInitial, currentState.pageSize]);

  const handleCreateEvent = () => {
    navigate("/events/new");
  };

  const greeting = useMemo((): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2, mb: 0.5 }}
                >
                  My Events
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {greeting}, {user?.name?.split(' ')[0] || "there"}! Here are your events.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={currentState.loading}
                  size="small"
                  sx={{ borderRadius: '100px', px: 2, height: 36, fontSize: '0.8rem' }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateEvent}
                  sx={{ borderRadius: '100px', px: 2.5, height: 36, fontSize: '0.8rem' }}
                >
                  Create Event
                </Button>
              </Box>
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
            {tabs.map((tab, index) => {
              const count = tab.state.totalCount;
              return (
                <Box
                  key={index}
                  onClick={() => handleTabChange(index)}
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
                    fontWeight: activeTab === index ? 600 : 500,
                    color: activeTab === index ? '#000' : 'text.secondary',
                    backgroundColor: activeTab === index ? '#FFBF49' : 'transparent',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                    '&:hover': {
                      color: activeTab === index ? '#000' : 'text.primary',
                    },
                  }}
                >
                  {tab.icon}
                  {tab.label}
                  {count !== undefined && count > 0 && (
                    <Box
                      sx={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: '100px',
                        backgroundColor: activeTab === index ? 'rgba(0,0,0,0.15)' : 'rgba(255,191,73,0.2)',
                        color: activeTab === index ? '#000' : '#FFBF49',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 0.5,
                      }}
                    >
                      {count}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Error Display */}
          {currentState.error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {currentState.error}
            </Alert>
          )}

          {/* Loading State (Initial Load) */}
          {currentState.loading && currentState.events.length === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: '#FFBF49' }} />
            </Box>
          )}

          {/* Empty State */}
          {!currentState.loading && currentState.events.length === 0 && !currentState.error && (
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                borderRadius: '16px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 191, 73, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFBF49',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {React.cloneElement(currentTab.icon, { sx: { fontSize: 28 } })}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {currentTab.emptyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
                {currentTab.emptyMessage}
              </Typography>
              {currentTab.showCreate && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateEvent}
                  sx={{ borderRadius: '100px', px: 3 }}
                >
                  Create Your First Event
                </Button>
              )}
            </Box>
          )}

          {/* Events List with Infinite Scroll */}
          {currentState.events.length > 0 && (
            <InfiniteScroll
              loading={currentState.loadingMore}
              hasMore={currentState.hasNext}
              onLoadMore={handleLoadMore}
              loadingMessage={`Loading more ${tabs[activeTab].label.toLowerCase()} events...`}
              endMessage={`🎉 You've seen all your ${tabs[activeTab].label.toLowerCase()} events!`}
              error={!!currentState.error}
              errorMessage={currentState.error || "Failed to load more events"}
            >
              <Grid2 container spacing={3}>
                {currentState.events.map((event: Event, index: number) => (
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={`${event.eventId}-${index}`}>
                    <EventCard event={event} />
                  </Grid2>
                ))}
              </Grid2>
            </InfiniteScroll>
          )}

          {/* Event Count Footer */}
          {currentState.events.length > 0 && (
            <Box sx={{ textAlign: 'center', py: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {currentState.events.length}
                {currentState.totalCount !== undefined && ` of ${currentState.totalCount}`}
                {` ${tabs[activeTab].label.toLowerCase()} events`}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default MyEventsPage;
