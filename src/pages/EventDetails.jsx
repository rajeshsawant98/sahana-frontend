import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import NavBar from "../components/NavBar";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckIcon from "@mui/icons-material/Check";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rsvpedEvents = useSelector((state) => state.userEvents.rsvpedEvents);
  const currentUser = useSelector((state) => state.auth.user);

  const isRSVPed = useMemo(
    () => rsvpedEvents.some((e) => e.eventId === id || e.id === id),
    [rsvpedEvents, id]
  );

  const canEditEvent = useMemo(() => {
    if (!event || !currentUser) return false;
    return (
      event.createdByEmail === currentUser.email ||
      event.organizers?.includes(currentUser.email)
    );
  }, [event, currentUser]);

  useEffect(() => {
    axiosInstance
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRSVP = async () => {
    try {
      await axiosInstance.post(`/events/${id}/rsvp`, { status: "joined" });
      window.location.reload();
    } catch (err) {
      console.error("RSVP failed", err);
    }
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!event) return null;

  const {
    eventName,
    description,
    location,
    startTime,
    categories,
    isOnline,
    joinLink,
    imageUrl,
  } = event;

  const { latitude, longitude, formattedAddress, name } = location || {};

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          height: { xs: 300, md: 400 },
          width: "100%",
          borderRadius: 2,
          mb: 4,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          px: 4,
          py: 3,
          backgroundColor: imageUrl ? "transparent" : "grey",
        }}
      >
        {imageUrl && (
          <>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(6px)",
                transform: "scale(1.1)",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.4)",
                zIndex: 2,
              }}
            />
          </>
        )}

        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            color: "white",
            background: imageUrl ? "transparent" : "primary.main",
            borderRadius: 2,
            p: 3,
            width: "100%",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {eventName}
              </Typography>
              <Typography display="flex" alignItems="center" gap={1}>
                <CalendarTodayIcon fontSize="small" />
                {new Date(startTime).toLocaleString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </Typography>
              <Typography display="flex" alignItems="center" gap={1}>
                <LocationOnIcon fontSize="small" />
                {name || "Online"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              {canEditEvent && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => navigate(`/events/${id}/edit`)}
                >
                  Edit Event
                </Button>
              )}
              {!isOnline && (
                isRSVPed ? (
                  <Button variant="outlined" color="success" startIcon={<CheckIcon />} disabled>
                    Joined
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleRSVP}>
                    Join Event
                  </Button>
                )
              )}
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ px: 4, py: 2 }}>
        {categories?.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {categories.map((cat, index) => (
              <Chip
                key={index}
                label={cat}
                color="primary"
                variant="filled"
                sx={{ borderRadius: "20px" }}
              />
            ))}
          </Box>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Date and Time
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {new Date(startTime).toLocaleString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZoneName: "short",
              })}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography>{name}</Typography>
            <Typography color="text.secondary">{formattedAddress}</Typography>

            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              About this Event
            </Typography>
            <Typography color="text.secondary">{description}</Typography>
          </Grid>

          {!isOnline && (
            <Grid item xs={12} md={6}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "350px" }}
                center={{ lat: latitude, lng: longitude }}
                zoom={15}
              >
                <Marker position={{ lat: latitude, lng: longitude }} />
              </GoogleMap>
            </Grid>
          )}
        </Grid>

        {isOnline && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Join Online
            </Typography>
            <Button variant="contained" color="primary" href={joinLink} target="_blank">
              Join Now
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default EventDetails;
