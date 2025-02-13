import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Grid2, Button, Typography  } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import NavBar from '../components/NavBar';
import EventCard from '../components/cards/EventCard'; // Import the EventCard component
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch events from backend on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/events'); // Adjust based on your API endpoint
        setEvents(response.data.events); // Assuming response.data contains the events array
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

        {/* Loading Indicator */}
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Grid2 container spacing={3} sx={{ width: '100%', maxWidth: '850px' }}>
            {events.map((event) => (
              <Grid2 xs={12} sm={6} md={4} key={event.eventId}>
                <EventCard event={event} /> {/* Render each event in the EventCard component */}
              </Grid2>
            ))}
          </Grid2>
        )}

        {/* Create New Event Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          onClick={() => {
            // Navigate to event creation page (Add routing logic later)
            navigate('/events/new');
          }}
        >
          Create New Event
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          onClick={() => {
            // Navigate to event creation page (Add routing logic later)
            navigate('/events/my');
          }}
        >
          My Events
        </Button>
      </Box>
    </>
  );
};

export default Events;