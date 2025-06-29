import React, { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { fetchNearbyEventsByLocation, setPage, setPageSize } from "../redux/slices/nearbyEventsSlice";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { NavBar } from "../components/navigation";
import { EventCard } from "../components/events";
import { PaginationControls } from "../components/ui";

interface LocationState {
  city?: string;
  state?: string;
}

const NearbyEventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { 
    events, 
    loading, 
    error, 
    currentPage, 
    pageSize, 
    totalCount, 
    totalPages
  } = useAppSelector((state) => state.nearbyEvents);
  
  const location = useLocation();
  const locationState = location.state as LocationState;
  const city = locationState?.city;
  const state = locationState?.state || "AZ"; // Fallback state

  // Initial load when component mounts or location changes
  useEffect(() => {
    if (city && state) {
      dispatch(fetchNearbyEventsByLocation({
        city,
        state,
        page: currentPage,
        page_size: pageSize,
      }));
    }
  }, [dispatch, city, state]); // Only trigger on location changes

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    
    // Immediately trigger API call with new page
    if (city && state) {
      dispatch(fetchNearbyEventsByLocation({
        city,
        state,
        page: page, // Use the new page directly
        page_size: pageSize,
      }));
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize));
    
    // Immediately trigger API call with new page size (page resets to 1)
    if (city && state) {
      dispatch(fetchNearbyEventsByLocation({
        city,
        state,
        page: 1, // Reset to page 1 when changing page size
        page_size: newPageSize,
      }));
    }
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <NavBar />
      <Container>
        <Typography variant="h4" gutterBottom>
          {city && state ? `Nearby Events in ${city}, ${state}` : "Nearby Events"}
        </Typography>
        
        {!loading && events.length > 0 && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Found {totalCount} events (Page {currentPage} of {totalPages})
          </Typography>
        )}

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">
            Error: {error}
          </Typography>
        ) : !city || !state ? (
          <Typography>
            Unable to determine location. Please access this page by clicking on your location in the navigation bar.
          </Typography>
        ) : events.length === 0 ? (
          <Typography>
            No events found nearby.
          </Typography>
        ) : (
          <>
            <Grid
              container
              spacing={3}
              display="flex"
              flexWrap="wrap"
              alignItems="stretch"
            >
              {events.map((event) => (
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
      </Container>
    </Box>
  );
};

export default NearbyEventsPage;
