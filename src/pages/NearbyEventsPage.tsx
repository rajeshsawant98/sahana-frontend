import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid2,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { NavBar } from '../components/navigation';
import { EventCard } from '../components/events';
import { InfiniteScroll } from '../components/ui';
import { Event } from '../types/Event';
import {
  fetchInitialNearbyEvents,
  loadMoreNearbyEvents,
  refreshNearbyEvents,
  setLocation,
} from '../redux/slices/nearbyEventsSlice';

const NearbyEventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

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

  // Helper function to get default location
  const getDefaultLocation = (): { city: string; state: string } => {
    if (navigator.geolocation) {
      // In a real app, you'd reverse geocode coordinates to get city/state
      // For now, return a default location
      return { city: 'Boston', state: 'MA' };
    }
    return { city: 'New York', state: 'NY' };
  };

  // Get location from navigation state or use default
  const getLocationFromRoute = useCallback(() => {
    const routeState = location.state as {
      city?: string;
      state?: string;
    } | null;

    return routeState?.city && routeState?.state
      ? { city: routeState.city, state: routeState.state }
      : getDefaultLocation();
  }, [location.state]);

  // Initialize location and fetch events
  useEffect(() => {
    const { city, state } = getLocationFromRoute();
    
    if (!hasFetched || city !== lastCity || state !== lastState) {
      dispatch(setLocation({ city, state }));
      dispatch(
        fetchInitialNearbyEvents({
          city,
          state,
          page_size: pageSize,
        })
      );
    }
  }, [
    getLocationFromRoute,
    pageSize,
    dispatch,
    hasFetched,
    lastCity,
    lastState,
  ]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (nextCursor && hasNext && !loadingMore && lastCity && lastState) {
      dispatch(
        loadMoreNearbyEvents({
          cursor: nextCursor,
          city: lastCity,
          state: lastState,
          pageSize,
        })
      );
    }
  }, [dispatch, nextCursor, hasNext, loadingMore, lastCity, lastState, pageSize]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (lastCity && lastState) {
      dispatch(
        refreshNearbyEvents({
          city: lastCity,
          state: lastState,
          pageSize,
        })
      );
    }
  }, [dispatch, lastCity, lastState, pageSize]);

  // Get current location string for display
  const currentLocationString = lastCity && lastState 
    ? `${lastCity}, ${lastState}` 
    : 'Unknown Location';

  return (
    <>
      <NavBar />
      <Container>
        {/* Header */}
        <Box sx={{ my: 4 }}>
          <Typography variant='h4' gutterBottom>
            Nearby Events
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Discover events happening in your area
          </Typography>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State (Initial Load) */}
        {loading && events.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && !error && hasFetched && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant='h6' color='text.secondary' gutterBottom>
              No events found in {currentLocationString}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Try searching for a different city or check back later for new
              events.
            </Typography>
          </Box>
        )}

        {/* Events List with Infinite Scroll */}
        {events.length > 0 && (
          <InfiniteScroll
            loading={loadingMore}
            hasMore={hasNext}
            onLoadMore={handleLoadMore}
            loadingMessage='Loading more nearby events...'
            endMessage={`🎉 You've seen all events in ${currentLocationString}!`}
            error={!!error}
            errorMessage={error || 'Failed to load more events'}
          >
            <Grid2 container spacing={3}>
              {events.map((event: Event, index: number) => (
                <Grid2
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={`${event.eventId}-${index}`}
                >
                  <EventCard event={event} />
                </Grid2>
              ))}
            </Grid2>
          </InfiniteScroll>
        )}

        {/* Event Count Footer */}
        {events.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 2, mt: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Showing {events.length}
              {totalCount !== undefined && ` of ${totalCount}`}
              {` events in ${currentLocationString}`}
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default NearbyEventsPage;
