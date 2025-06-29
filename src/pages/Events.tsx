import React, { useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography, Button, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { fetchEvents, setPage, setPageSize, setFilters, clearFilters } from '../redux/slices/eventsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { NavBar } from '../components/navigation';
import { EventCard, EventFilters as EventFiltersComponent } from '../components/events';
import { PaginationControls } from '../components/ui';
import { Event } from '../types/Event';
import { EventFilters } from '../types/Pagination';

const Events: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { 
    events, 
    loading, 
    error, 
    currentPage, 
    pageSize, 
    totalCount, 
    totalPages, 
    hasNext, 
    hasPrevious,
    filters
  } = useAppSelector((state) => state.events);
  
  const typedEvents = events as Event[];

  // Fetch events with current pagination and filter settings
  const fetchEventsWithParams = useCallback(() => {
    dispatch(fetchEvents({
      page: currentPage,
      page_size: pageSize,
      ...filters,
    }));
  }, [dispatch, currentPage, pageSize, filters]);

  useEffect(() => {
    fetchEventsWithParams();
  }, [fetchEventsWithParams]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    
    // Immediately trigger API call with new page
    dispatch(fetchEvents({
      page: page,
      page_size: pageSize,
      ...filters,
    }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize));
    
    // Immediately trigger API call with new page size (page resets to 1)
    dispatch(fetchEvents({
      page: 1,
      page_size: newPageSize,
      ...filters,
    }));
  };

  const handleFiltersChange = (newFilters: EventFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <NavBar />
      <Container>
        <Typography variant="h4" gutterBottom sx={{ paddingTop: 3 }}>
          Upcoming Events
        </Typography>

        {/* Filters */}
        <EventFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {loading ? (
          <CircularProgress color="primary" />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : typedEvents.length === 0 ? (
          <Typography>No events found.</Typography>
        ) : (
          <>
            <Grid
              container
              spacing={3}
              display="flex"
              flexWrap="wrap"
              alignItems="stretch"
            >
              {typedEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.eventId}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination Controls */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2, marginTop: 4, marginBottom: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/events/new')}
          >
            Create New Event
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/events/my')}
          >
            My Events
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Events;
