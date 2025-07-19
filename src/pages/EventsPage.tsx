import React, { useEffect, useCallback, useState } from "react";
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Grid2,
  CircularProgress,
  Container,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { NavBar } from "../components/navigation";
import { EventCard, EventFilters as EventFiltersComponent } from "../components/events";
import { InfiniteScroll } from "../components/ui";
import { Event } from "../types/Event";
import { EventFilters } from "../types/Pagination";
import {
  fetchInitialEvents,
  loadMoreEvents,
  refreshEvents,
  setFilters,
  resetEvents,
  clearError,
} from "../redux/slices/eventsSlice";

const EventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  const eventsState = useAppSelector((state) => state.events);
  
  const {
    events,
    loading,
    loadingMore,
    error,
    hasNext,
    nextCursor,
    pageSize,
    totalCount,
    filters,
    isInitialLoad,
  } = eventsState;

  const [localFilters, setLocalFilters] = useState<EventFilters>(filters);
  const [showFilters, setShowFilters] = useState(false);

  // Initial load
  useEffect(() => {
    if (isInitialLoad) {
      dispatch(fetchInitialEvents({
        page_size: pageSize,
        ...filters,
      }));
    }
  }, [dispatch, pageSize, filters, isInitialLoad]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (nextCursor && hasNext && !loadingMore) {
      dispatch(loadMoreEvents({
        cursor: nextCursor,
        pageSize,
        filters,
      }));
    }
  }, [dispatch, nextCursor, hasNext, loadingMore, pageSize, filters]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    dispatch(refreshEvents({
      page_size: pageSize,
      ...filters,
    }));
  }, [dispatch, pageSize, filters]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: EventFilters) => {
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
    // Reset and fetch with new filters
    dispatch(resetEvents());
    dispatch(fetchInitialEvents({
      page_size: pageSize,
      ...newFilters,
    }));
  }, [dispatch, pageSize]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    dispatch(setFilters(emptyFilters));
    dispatch(resetEvents());
    dispatch(fetchInitialEvents({
      page_size: pageSize,
    }));
  }, [dispatch, pageSize]);

  // Clear error when component unmounts or on manual clear
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== '').length;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <NavBar />
      <Container>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Upcoming Events
            </Typography>
            {totalCount !== undefined && (
              <Typography variant="subtitle1" color="text.secondary">
                {totalCount} events found
                {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied)`}
              </Typography>
            )}
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "contained" : "outlined"}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
            
            {/* Refresh Button */}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              size="small"
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    size="small"
                    onDelete={() => {
                      const newFilters = { ...filters };
                      delete newFilters[key as keyof EventFilters];
                      handleFiltersChange(newFilters);
                    }}
                  />
                );
              })}
              <Chip
                label="Clear all"
                size="small"
                color="secondary"
                onClick={handleClearFilters}
              />
            </Stack>
          </Box>
        )}

        {/* Filters */}
        {showFilters && (
          <Box sx={{ mb: 3 }}>
            <EventFiltersComponent
              filters={localFilters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error.contrastText">
              {error}
            </Typography>
            <Button 
              size="small" 
              onClick={handleClearError}
              sx={{ mt: 1, color: 'error.contrastText' }}
            >
              Dismiss
            </Button>
          </Box>
        )}

        {/* Loading State (Initial Load) */}
        {loading && events.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* No Events State */}
        {!loading && events.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {activeFilterCount > 0 ? 'No events match your filters' : 'No events found'}
            </Typography>
            {activeFilterCount > 0 && (
              <Button 
                onClick={handleClearFilters}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        )}

        {/* Events List with Infinite Scroll */}
        {events.length > 0 && (
          <InfiniteScroll
            loading={loadingMore}
            hasMore={hasNext}
            onLoadMore={handleLoadMore}
            loadingMessage="Loading more events..."
            endMessage="🎉 You've seen all the events! Events are sorted chronologically - earliest events appear first."
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
              Showing {events.length}{totalCount !== undefined && ` of ${totalCount}`} events
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EventsPage;
