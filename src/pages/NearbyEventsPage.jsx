import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNearbyEventsByLocation } from "../redux/slices/nearbyEventsSlice";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import NavBar from "../components/NavBar";
import EventCard from "../components/cards/EventCard";
import { useLocation } from "react-router-dom";

const NearbyEventsPage = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector(
    (state) => state.nearbyEvents
  );
  const location = useLocation();
  const city = location.state?.city;
  const state = "AZ"; // Fallback or inferred state (can be refined later)

  useEffect(() => {
    console.log("📍 From Google API city:", city);
    if (city && state) {
      dispatch(
        fetchNearbyEventsByLocation({
          city,
          state,
        })
      );
    }
  }, [city, state, dispatch]);

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <NavBar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Nearby Events in {city}, {state}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : events.length === 0 ? (
          <Typography>No events found nearby.</Typography>
        ) : (
          <Grid
            container
            spacing={3}
            display="flex"
            flexWrap="wrap"
           // gap={2}
          //  justifyContent="center"
            alignItems="stretch"
          >
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.eventId}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default NearbyEventsPage;
