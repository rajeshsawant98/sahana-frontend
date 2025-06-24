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
import { RootState, AppDispatch } from "../redux/store";
import NavBar from "../components/NavBar";
import EventCard from "../components/cards/EventCard";
import { fetchCreatedEvents, fetchRSVPedEvents } from "../redux/slices/userEventsSlice";

const MyEvents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<number>(0);

  const {
    createdEvents,
    loadingCreated,
    errorCreated,
    lastFetchedCreated,
    rsvpedEvents,
    loadingRSVPed,
    errorRSVPed,
    lastFetchedRSVPed,
    hasFetchedRSVPed,
  } = useSelector((state: RootState) => state.userEvents);

  useEffect(() => {
    dispatch(fetchCreatedEvents());
  }, [dispatch]);
  
  useEffect(() => {
    if (activeTab === 1 && !hasFetchedRSVPed) {
      dispatch(fetchRSVPedEvents());
    }
  }, [activeTab, hasFetchedRSVPed, dispatch]);

  const formatLastUpdated = (timestamp: number | null): string | null => {
    if (!timestamp) return null;
    const minutesAgo = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (minutesAgo < 1) return "Just now";
    if (minutesAgo === 1) return "1 minute ago";
    return `${minutesAgo} minutes ago`;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
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
            Last updated:{" "}
            {activeTab === 0
              ? formatLastUpdated(lastFetchedCreated)
              : formatLastUpdated(lastFetchedRSVPed)}
          </Typography>
        )}

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
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
            {activeTab === 0 && (
              <>
                {errorCreated && <Alert severity="error">{errorCreated}</Alert>}
                {loadingCreated ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : createdEvents.length > 0 ? (
                  <Grid2 container spacing={3}>
                    {createdEvents.map((event) => (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                ) : (
                  <Typography>No created events found.</Typography>
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {errorRSVPed && <Alert severity="error">{errorRSVPed}</Alert>}
                {loadingRSVPed ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : rsvpedEvents.length > 0 ? (
                  <Grid2 container spacing={3}>
                    {rsvpedEvents.map((event) => (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                ) : (
                  <Typography>No RSVP'd events found.</Typography>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default MyEvents;
