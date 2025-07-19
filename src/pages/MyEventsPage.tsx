import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid2,
  CircularProgress,
  Container,
  Button,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
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
  loadMoreCreatedEvents,
  loadMoreRsvpEvents,
  loadMoreOrganizedEvents,
  loadMoreModeratedEvents,
  resetCreatedEvents,
  resetRSVPedEvents,
  resetOrganizedEvents,
  resetModeratedEvents,
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
  } = useAppSelector((state) => state.userEvents);

  const { user } = useAppSelector((state) => state.auth);

  // Tab configuration
  const tabs = [
    { 
      label: "Created", 
      state: created, 
      fetchInitial: fetchInitialCreatedEvents,
      loadMore: loadMoreCreatedEvents,
      reset: resetCreatedEvents,
    },
    { 
      label: "RSVP'd", 
      state: rsvped, 
      fetchInitial: fetchInitialRsvpEvents,
      loadMore: loadMoreRsvpEvents,
      reset: resetRSVPedEvents,
    },
    { 
      label: "Organized", 
      state: organized, 
      fetchInitial: fetchInitialOrganizedEvents,
      loadMore: loadMoreOrganizedEvents,
      reset: resetOrganizedEvents,
    },
    { 
      label: "Moderated", 
      state: moderated, 
      fetchInitial: fetchInitialModeratedEvents,
      loadMore: loadMoreModeratedEvents,
      reset: resetModeratedEvents,
    },
  ];

  const currentTab = tabs[activeTab];
  const currentState = currentTab.state;

  // Initial load for active tab
  useEffect(() => {
    if (!currentState.hasFetched && !currentState.loading) {
      dispatch(currentTab.fetchInitial({ page_size: 12 }));
    }
  }, [activeTab, currentState.hasFetched, currentState.loading, dispatch, currentTab.fetchInitial]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle load more for current tab
  const handleLoadMore = useCallback(() => {
    if (currentState.nextCursor && currentState.hasNext && !currentState.loadingMore) {
      dispatch(currentTab.loadMore({
        cursor: currentState.nextCursor,
        pageSize: currentState.pageSize,
      }));
    }
  }, [dispatch, currentState.nextCursor, currentState.hasNext, currentState.loadingMore, currentState.pageSize, currentTab.loadMore]);

  // Handle refresh for current tab
  const handleRefresh = useCallback(() => {
    dispatch(currentTab.reset());
    dispatch(currentTab.fetchInitial({ page_size: currentState.pageSize }));
  }, [dispatch, currentTab.reset, currentTab.fetchInitial, currentState.pageSize]);

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  const getTabLabel = (index: number) => {
    const tab = tabs[index];
    const count = tab.state.totalCount;
    return count !== undefined ? `${tab.label} (${count})` : tab.label;
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 0:
        return "You haven't created any events yet. Click 'Create Event' to get started!";
      case 1:
        return "You haven't RSVP'd to any events yet. Browse events to join some!";
      case 2:
        return "You're not organizing any events yet.";
      case 3:
        return "You're not moderating any events yet.";
      default:
        return "No events found.";
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            My Events
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={currentState.loading}
              size="small"
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateEvent}
            >
              Create Event
            </Button>
          </Stack>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          {tabs.map((_, index) => (
            <Tab key={index} label={getTabLabel(index)} />
          ))}
        </Tabs>

        {/* Error Display */}
        {currentState.error && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error.contrastText">
              {currentState.error}
            </Typography>
          </Box>
        )}

        {/* Loading State (Initial Load) */}
        {currentState.loading && currentState.events.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!currentState.loading && currentState.events.length === 0 && !currentState.error && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {getEmptyStateMessage()}
            </Typography>
            {activeTab === 0 && (
              <Button 
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateEvent}
                sx={{ mt: 2 }}
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
    </>
  );
};

export default MyEventsPage;
