import React, { useEffect, useCallback, useState, useRef } from "react";
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Container,
  IconButton,
  TextField,
  InputAdornment,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { NavBar } from "../components/navigation";
import { EventCard } from "../components/events";
import { Event } from "../types/Event";
import { useDebounce } from "../hooks/useDebounce";
import {
  fetchInitialEvents,
  loadMoreEvents,
  refreshEvents,
  resetEvents,
  setSearchQuery as setSearchQueryAction,
  clearError,
} from "../redux/slices/eventsSlice";

// Skeleton card for loading state
const EventCardSkeleton: React.FC = () => (
  <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
    <Skeleton variant="rectangular" height={180} sx={{ borderRadius: '8px 8px 0 0' }} />
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="80%" height={28} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mt: 0.5 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
    </Box>
  </Box>
);

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
  const searchQuery = useAppSelector((state) => state.events.searchQuery);
  const isInitialLoad = useAppSelector((state) => state.events.isInitialLoad);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 400);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Show toast when an error occurs
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastOpen(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Initial load
  useEffect(() => {
    if (isInitialLoad) {
      dispatch(fetchInitialEvents({
        page_size: pageSize,
        searchQuery: debouncedQuery || undefined,
      }));
    }
  }, [dispatch, pageSize, isInitialLoad]); // eslint-disable-line react-hooks/exhaustive-deps

  // React to debounced query changes
  useEffect(() => {
    // Skip the very first render — initial load handles that
    if (isInitialLoad) return;

    dispatch(resetEvents());
    dispatch(setSearchQueryAction(debouncedQuery));
    dispatch(fetchInitialEvents({
      page_size: pageSize,
      searchQuery: debouncedQuery || undefined,
    }));
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (nextCursor && hasNext && !loadingMore) {
      dispatch(loadMoreEvents({
        cursor: nextCursor,
        pageSize,
        searchQuery: searchQuery || undefined,
      }));
    }
  }, [dispatch, nextCursor, hasNext, loadingMore, pageSize, searchQuery]);

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
      searchQuery: searchQuery || undefined,
    }));
  }, [dispatch, pageSize, searchQuery]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setLocalQuery("");
  }, []);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <NavBar />
      <Container>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 4, mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}
          >
            What's happening
          </Typography>

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
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            id="event-search-input"
            fullWidth
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Try 'rock concerts in tempe' or 'food events this weekend'"
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: localQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch} edge="end" aria-label="clear search">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.03)',
              },
            }}
          />
        </Box>

        {/* Loading Skeleton (Initial Load) */}
        {loading && events.length === 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 2,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </Box>
        )}

        {/* No Events State */}
        {!loading && events.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {debouncedQuery ? 'No events match your search' : 'No events yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {debouncedQuery ? 'Try different keywords or clear the search.' : 'Check back soon!'}
            </Typography>
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
              {loadingMore && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: 3,
                    width: '100%',
                  }}
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                  ))}
                </Box>
              )}
              {!hasNext && !loadingMore && (
                <Typography variant="body2" color="text.secondary">
                  All caught up · {events.length} events
                </Typography>
              )}
            </Box>
          </>
        )}

        {/* Error Toast */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={4000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setToastOpen(false)}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default EventsPage;
