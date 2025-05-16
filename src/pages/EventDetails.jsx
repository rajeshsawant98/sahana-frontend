import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
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
  Grid2,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckIcon from "@mui/icons-material/Check";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rsvpedEvents = useSelector((state) => state.userEvents.rsvpedEvents);

  const isRSVPed = useMemo(
    () => rsvpedEvents.some((e) => e.eventId === id || e.id === id),
    [rsvpedEvents, id]
  );

  useEffect(() => {
    axiosInstance
      .get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data);
      })
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
    imageURL,
  } = event;

  const { latitude, longitude, formattedAddress, name } = location || {};

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 300, md: 400 },
          width: "100%",
          borderRadius: 2,
          mb: 2,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          px: 4,
          py: 3,
          backgroundColor: imageURL ? "transparent" : "grey",
        }}
      >
        {imageURL && (
          <>
            {/* Blurred background image */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${imageURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(5px)",
                transform: "scale(1.1)",
                zIndex: 1,
              }}
            />
            {/* Dark overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 2,
              }}
            />
            
            
          </>
        )}
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1))",
            zIndex: 2,
          }}
        />

        {/* Foreground content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            color: "white",
            background: imageURL ? "transparent" : "primary.main",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {eventName}
          </Typography>

          <Typography
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
          >
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

          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon fontSize="small" />
            {name || "Online"}
          </Typography>

          {!isOnline && (
            <Box sx={{ mt: 2 }}>
              {isRSVPed ? (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<CheckIcon />}
                  disabled
                >
                  Joined
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRSVP}
                >
                  Join Event
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 4, py: 2 }}>
        {/* Categories */}
        {categories && categories.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {categories.map((category, index) => (
              <Chip
                key={index}
                label={category}
                color="primary"
                variant="filled"
                sx={{ borderRadius: "20px" }}
              />
            ))}
          </Box>
        )}

        <Grid2 container spacing={4}>
          {/* Left Column */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Date and time
            </Typography>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 4 }}>
              <CalendarTodayIcon fontSize="small" />
              <Typography>
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
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Location
            </Typography>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <LocationOnIcon fontSize="small" sx={{ mt: 0.5 }} />
              <Box>
                <Typography>{name}</Typography>
                <Typography color="text.secondary">
                  {formattedAddress}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
              About this event
            </Typography>
            <Box>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                {description}
              </Typography>
            </Box>
          </Grid2>

          {/* Right Column - Map */}
          {!isOnline && (
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "350px" }}
                center={{ lat: latitude, lng: longitude }}
                zoom={15}
              >
                <Marker position={{ lat: latitude, lng: longitude }} />
              </GoogleMap>
            </Grid2>
          )}
        </Grid2>

        {/* Online Event Link */}
        {isOnline && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Join Online
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href={joinLink}
              target="_blank"
            >
              Join Now
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default EventDetails;
