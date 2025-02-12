import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Card, CardContent, Typography, Button, Tabs, Tab, Box, CircularProgress, Alert } from "@mui/material";
import NavBar from "../components/NavBar";

const MyEvents = () => {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      console.log(localStorage.getItem('access_token'));
      const { data } = await axiosInstance.get('/auth/me/events/created', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log(data);
      setCreatedEvents(data.events);
      setLoading(false);
    } catch (err) {
      setError("Error fetching created events");
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>My Events</Typography>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Created Events" />
          <Tab label="RSVP'd Events" />
        </Tabs>

        {/* Error handling */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Loading state */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === 0 && createdEvents.length > 0 ? (
              createdEvents.map(event => (
                <Card key={event.eventId} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{event.eventName}</Typography>

                    <Typography variant="body2">{event.description}</Typography>
                    {event.location && (
                      <Typography variant="body2">
                        {event.location.name} - {event.location.city}
                      </Typography>
                    )}

                    <Button variant="contained" href={`/events/${event.eventId}`} sx={{ mt: 1 }}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No created events found.</Typography>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default MyEvents;