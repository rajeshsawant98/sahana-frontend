import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography, Button, Grid, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../redux/slices/eventsSlice';
import { RootState, AppDispatch } from '../redux/store';
import NavBar from '../components/NavBar';
import EventCard from '../components/cards/EventCard';
import { Event } from '../types/Event';

const Events: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { events, loading, error } = useSelector((state: RootState) => state.events);
  const typedEvents = events as Event[];

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <NavBar />
      <Container>
        <Typography variant="h4" gutterBottom sx={{ paddingTop: 3 }}>
          Upcoming Events
        </Typography>

        {loading ? (
          <CircularProgress color="primary" />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : typedEvents.length === 0 ? (
          <Typography>No events found.</Typography>
        ) : (
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
