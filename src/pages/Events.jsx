import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography, Button, Grid2 } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../redux/slices/eventsSlice';
import NavBar from '../components/NavBar';
import EventCard from '../components/cards/EventCard';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events = [], loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          marginTop: 4,
          paddingX: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Upcoming Events
        </Typography>

        {loading ? (
          <CircularProgress color="primary" />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid2 container spacing={3} sx={{ width: '100%', maxWidth: '850px' }}>
            {events.map((event) => (
              <Grid2 xs={12} sm={6} md={4} key={event.eventId}>
                <EventCard event={event} />
              </Grid2>
            ))}
          </Grid2>
        )}

        {/* Buttons */}
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          onClick={() => navigate('/events/new')}
        >
          Create New Event
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          onClick={() => navigate('/events/my')}
        >
          My Events
        </Button>
      </Box>
    </>
  );
};

export default Events;