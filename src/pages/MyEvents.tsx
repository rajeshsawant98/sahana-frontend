import React, { useEffect, useState } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  Grid2,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/store";
import NavBar from "../components/NavBar";
import EventCard from "../components/cards/EventCard";
import { fetchCreatedEvents, fetchRSVPedEvents, fetchOrganizedEvents, fetchModeratedEvents } from "../redux/slices/userEventsSlice";

const MyEvents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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
    organizedEvents,
    loadingOrganized,
    errorOrganized,
    lastFetchedOrganized,
    hasFetchedOrganized,
    moderatedEvents,
    loadingModerated,
    errorModerated,
    lastFetchedModerated,
    hasFetchedModerated,
  } = useSelector((state: RootState) => state.userEvents);

  useEffect(() => {
    dispatch(fetchCreatedEvents());
  }, [dispatch]);
  
  useEffect(() => {
    if (activeTab === 1 && !hasFetchedRSVPed) {
      dispatch(fetchRSVPedEvents());
    } else if (activeTab === 2 && !hasFetchedOrganized) {
      dispatch(fetchOrganizedEvents());
    } else if (activeTab === 3 && !hasFetchedModerated) {
      dispatch(fetchModeratedEvents());
    }
  }, [activeTab, hasFetchedRSVPed, hasFetchedOrganized, hasFetchedModerated, dispatch]);

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

  const handleCreateEvent = (): void => {
    navigate("/events/new");
  };

  const getLastUpdatedTimestamp = () => {
    switch (activeTab) {
      case 0: return lastFetchedCreated;
      case 1: return lastFetchedRSVPed;
      case 2: return lastFetchedOrganized;
      case 3: return lastFetchedModerated;
      default: return null;
    }
  };

  const getCurrentError = () => {
    switch (activeTab) {
      case 0: return errorCreated;
      case 1: return errorRSVPed;
      case 2: return errorOrganized;
      case 3: return errorModerated;
      default: return null;
    }
  };

  const isCurrentTabLoading = () => {
    switch (activeTab) {
      case 0: return loadingCreated;
      case 1: return loadingRSVPed;
      case 2: return loadingOrganized;
      case 3: return loadingModerated;
      default: return false;
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ p: 3 }}>
        {/* Header with title and create button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h4">
            My Events
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateEvent}
            sx={{ 
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Create New Event
          </Button>
        </Box>

        {getLastUpdatedTimestamp() && (
          <Typography variant="caption" color="text.secondary">
            Last updated: {formatLastUpdated(getLastUpdatedTimestamp())}
          </Typography>
        )}

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 2 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Created Events" />
          <Tab label="RSVP'd Events" />
          <Tab label="Organized Events" />
          <Tab label="Moderated Events" />
        </Tabs>

        {isCurrentTabLoading() ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              <>
                {createdEvents.length > 0 ? (
                  <Grid2 container spacing={3}>
                    {createdEvents.map((event) => (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                    You haven't created any events yet.
                  </Typography>
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {rsvpedEvents.length > 0 ? (
                  <Grid2 container spacing={3}>
                    {rsvpedEvents.map((event) => (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                    You haven't RSVP'd to any events yet.
                  </Typography>
                )}
              </>
            )}

            {activeTab === 2 && (
              <>
                {organizedEvents.length > 0 ? (
                  <Grid2 container spacing={3}>
                    {organizedEvents.map((event) => (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                    You haven't been added as an organizer to any events yet.
                  </Typography>
                )}
              </>
            )}

            {activeTab === 3 && (
              <>
                {moderatedEvents.length > 0 ? (
                  <Grid2 container spacing={3}>
                    {moderatedEvents.map((event) => (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                    You haven't been added as a moderator to any events yet.
                  </Typography>
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
