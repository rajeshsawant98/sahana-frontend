import React, { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Button,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { NavBar } from "../components/navigation";
import { EventCard, EventFilters as EventFiltersComponent } from "../components/events";
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

interface FilterChipProps {
  filterKey: string;
  value: string;
  onRemove: (key: string) => void;
}

const FilterChip = React.memo(({ filterKey, value, onRemove }: FilterChipProps) => (
  <Chip
    label={`${filterKey}: ${value}`}
    size="small"
    onDelete={() => onRemove(filterKey)}
  />
));

const EventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  const events = useAppSelector((state) => state.events.events);
  const loading = useAppSelector((state) => state.events.loading);
  const loadingMore = useAppSelector((state) => state.events.loadingMore);
  const error = useAppSelector((state) => state.events.error);
  const hasNext = useAppSelector((state) => state.events.hasNext);
  const nextCursor = useAppSelector((state) => state.events.nextCursor);
  const pageSize = useAppSelector((state) => state.events.pageSize);
  const totalCount = useAppSelector((state) => state.events.totalCount);
  const filters = useAppSelector((state) => state.events.filters);
  const isInitialLoad = useAppSelector((state) => state.events.isInitialLoad);

  const [localFilters, setLocalFilters] = useState<EventFilters>(filters);
  const [showFilters, setShowFilters] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loadingMore) {
          handleLoadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNext, loadingMore, handleLoadMore]);

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

  const handleRemoveFilter = useCallback((key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key as keyof EventFilters];
    handleFiltersChange(newFilters);
  }, [filters, handleFiltersChange]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(value => value !== undefined && value !== '').length,
    [filters]
  );

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <NavBar />
      <Container>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 4, mb: 3 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, letterSpacing: '-0.5px', mb: 0.5 }}
            >
              What's happening
            </Typography>
            {totalCount !== undefined && (
              <Typography variant="body2" color="text.secondary">
                {totalCount} events
                {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant={showFilters ? "contained" : "outlined"}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
              sx={{
                borderRadius: '100px',
                px: 2,
                height: 34,
                fontSize: '0.8rem',
              }}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>

            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              size="small"
              sx={{
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                width: 34,
                height: 34,
                '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <FilterChip
                    key={key}
                    filterKey={key}
                    value={value}
                    onRemove={handleRemoveFilter}
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
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {activeFilterCount > 0 ? 'No events match your filters' : 'No events yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {activeFilterCount > 0 ? 'Try adjusting or clearing your filters.' : 'Check back soon!'}
            </Typography>
            {activeFilterCount > 0 && (
              <Button
                onClick={handleClearFilters}
                variant="outlined"
                sx={{ borderRadius: '100px', px: 3 }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        )}

        {/* Events Grid */}
        {events.length > 0 && (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3,
                mb: 2,
              }}
            >
              {events.map((event) => (
                <EventCard key={(event as Event).eventId} event={event as Event} />
              ))}
            </Box>

            {/* Sentinel + footer */}
            <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              {loadingMore && <CircularProgress size={20} />}
              {!hasNext && !loadingMore && (
                <Typography variant="body2" color="text.secondary">
                  All caught up · {events.length} events
                </Typography>
              )}
            </Box>
          </>
        )}

      </Container>
    </Box>
  );
};

export default EventsPage;
