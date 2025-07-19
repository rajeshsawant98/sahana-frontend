import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid2,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import { LocationOn as LocationIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { NavBar } from "../components/navigation";
import { EventCard } from "../components/events";
import { InfiniteScroll } from "../components/ui";
import { Event } from "../types/Event";
import {
  fetchInitialNearbyEvents,
  loadMoreNearbyEvents,
  refreshNearbyEvents,
  setLocation,
} from "../redux/slices/nearbyEventsSlice";

const NearbyEventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  
  const {
    events,
    loading,
    loadingMore,
    error,
    nextCursor,
    hasNext,
    pageSize,
    totalCount,
    hasFetched,
    lastCity,
    lastState,
  } = useAppSelector((state) => state.nearbyEvents);

  // Get location from navigation state (from LocationNavbar) or use geolocation as fallback
  useEffect(() => {
    const routeState = location.state as { city?: string; state?: string } | null;
    
    if (routeState?.city && routeState?.state) {
      // Use location from LocationNavbar
      setCity(routeState.city);
      setState(routeState.state);
    } else if (navigator.geolocation) {
      // Fallback to geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates to get city/state
          // For now, let's use a default location
          setCity("Boston");
          setState("MA");
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // Default to a popular city
          setCity("San Francisco");
          setState("CA");
        }
      );
    } else {
      // Default location if geolocation is not supported
      setCity("New York");
      setState("NY");
    }
  }, [location.state]);

  // Fetch nearby events when location changes
  useEffect(() => {
    if (city && state && (!hasFetched || city !== lastCity || state !== lastState)) {
      dispatch(setLocation({ city, state }));
      dispatch(fetchInitialNearbyEvents({
        city,
        state,
        page_size: pageSize,
      }));
    }
  }, [city, state, pageSize, dispatch, hasFetched, lastCity, lastState]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (nextCursor && hasNext && !loadingMore && lastCity && lastState) {
      dispatch(loadMoreNearbyEvents({
        cursor: nextCursor,
        city: lastCity,
        state: lastState,
        pageSize,
      }));
    }
  }, [dispatch, nextCursor, hasNext, loadingMore, lastCity, lastState, pageSize]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (lastCity && lastState) {
      dispatch(refreshNearbyEvents({
        city: lastCity,
        state: lastState,
        pageSize,
      }));
    }
  }, [dispatch, lastCity, lastState, pageSize]);

  const getCurrentLocationString = () => {
    return lastCity && lastState ? `${lastCity}, ${lastState}` : "Unknown Location";
  };

  return (
    <>
      <NavBar />
      <Container>
        {/* Header */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Nearby Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover events happening in your area
          </Typography>
          {lastCity && lastState && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <LocationIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Showing events near: <strong>{getCurrentLocationString()}</strong>
              </Typography>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                disabled={loading || !lastCity || !lastState}
                startIcon={<RefreshIcon />}
                size="small"
              >
                Refresh
              </Button>
            </Box>
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State (Initial Load) */}
        {loading && events.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && !error && hasFetched && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found in {getCurrentLocationString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching for a different city or check back later for new events.
            </Typography>
          </Box>
        )}

        {/* Events List with Infinite Scroll */}
        {events.length > 0 && (
          <InfiniteScroll
            loading={loadingMore}
            hasMore={hasNext}
            onLoadMore={handleLoadMore}
            loadingMessage="Loading more nearby events..."
            endMessage={`🎉 You've seen all events in ${getCurrentLocationString()}!`}
            error={!!error}
            errorMessage={error || "Failed to load more events"}
          >
            <Grid2 container spacing={3}>
              {events.map((event: Event, index: number) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={`${event.eventId}-${index}`}>
                  <EventCard event={event} />
                </Grid2>
              ))}
            </Grid2>
          </InfiniteScroll>
        )}

        {/* Event Count Footer */}
        {events.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 2, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {events.length}
              {totalCount !== undefined && ` of ${totalCount}`} 
              {` events in ${getCurrentLocationString()}`}
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default NearbyEventsPage;
