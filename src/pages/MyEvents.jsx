import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  Grid2,
} from "@mui/material";
import NavBar from "../components/NavBar";
import EventCard from "../components/cards/EventCard";

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
      console.log(localStorage.getItem("access_token"));
      const { data } = await axiosInstance.get("/auth/me/events/created", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
        <Typography variant="h4" sx={{ mb: 2 }}>
          My Events
        </Typography>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
        >
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
            <Grid2
              container
              spacing={3}
              sx={{ width: "100%", maxWidth: "850px" }}
            >
              {activeTab === 0 && createdEvents.length > 0 ? (
                createdEvents.map((event) => (
                  <Grid2 xs={12} sm={6} md={4} key={event.eventId}>
                    <EventCard event={event} />{" "}
                    {/* Render each event in the EventCard component */}
                  </Grid2>
                ))
              ) : (
                <Typography>No created events found.</Typography>
              )}
            </Grid2>
          </>
        )}
      </Box>
    </>
  );
};

export default MyEvents;
