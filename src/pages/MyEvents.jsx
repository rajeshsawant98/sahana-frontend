import React, { useEffect, useState } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  Grid2,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import EventCard from "../components/cards/EventCard";
import { fetchCreatedEvents } from "../redux/slices/userEventsSlice";

const MyEvents = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  const {
    createdEvents,
    loadingCreated,
    errorCreated,
    lastFetchedCreated,
  } = useSelector((state) => state.userEvents);

  useEffect(() => {
    dispatch(fetchCreatedEvents());
  }, [dispatch]);

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return null;
    const minutesAgo = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (minutesAgo < 1) return "Just now";
    if (minutesAgo === 1) return "1 minute ago";
    return `${minutesAgo} minutes ago`;
  };

  return (
    <>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          My Events
        </Typography>

        {lastFetchedCreated && (
          <Typography variant="caption" color="text.secondary">
            Last updated: {formatLastUpdated(lastFetchedCreated)}
          </Typography>
        )}

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Created Events" />
          <Tab label="RSVP'd Events" />
        </Tabs>

        {errorCreated && <Alert severity="error">{errorCreated}</Alert>}

        {loadingCreated ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === 0 && createdEvents.length > 0 ? (
              <Grid2 container spacing={3}>
                {createdEvents.map((event) => (
                  <Grid2 item xs={12} sm={6} md={4} key={event.eventId}>
                    <EventCard event={event} />
                  </Grid2>
                ))}
              </Grid2>
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