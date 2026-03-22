import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid2,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { NearMe, LocationOn } from '@mui/icons-material';
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

  const getDefaultLocation = (): { city: string; state: string } => {
    if (navigator.geolocation) {
      return { city: 'Boston', state: 'MA' };
    }
    return { city: 'New York', state: 'NY' };
  };

  const getLocationFromRoute = useCallback(() => {
    const routeState = location.state as {
      city?: string;
      state?: string;
    } | null;

    return routeState?.city && routeState?.state
      ? { city: routeState.city, state: routeState.state }
      : getDefaultLocation();
  }, [location.state]);

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

  const currentLocationString = lastCity && lastState
    ? `${lastCity}, ${lastState}`
    : 'Unknown Location';

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(73, 163, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#49A3FF',
                }}
              >
                <NearMe sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}
                >
                  Nearby Events
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                  <Typography variant="body2" color="text.secondary">
                    Discover events happening near
                  </Typography>
                  <Chip
                    icon={<LocationOn sx={{ fontSize: 14 }} />}
                    label={currentLocationString}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      backgroundColor: 'rgba(73, 163, 255, 0.12)',
                      color: '#49A3FF',
                      '& .MuiChip-icon': { color: '#49A3FF' },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && events.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#FFBF49' }} />
            </Box>
          )}

          {/* Empty State */}
          {!loading && events.length === 0 && !error && hasFetched && (
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
                  backgroundColor: 'rgba(73, 163, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#49A3FF',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <NearMe sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                No events found in {currentLocationString}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                Try searching for a different city or check back later for new events.
              </Typography>
            </Box>
          )}

          {/* Events List */}
          {events.length > 0 && (
            <InfiniteScroll
              loading={loadingMore}
              hasMore={hasNext}
              onLoadMore={handleLoadMore}
              loadingMessage="Loading more nearby events..."
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
              <Typography variant="body2" color="text.secondary">
                Showing {events.length}
                {totalCount !== undefined && ` of ${totalCount}`}
                {` events in ${currentLocationString}`}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default NearbyEventsPage;
