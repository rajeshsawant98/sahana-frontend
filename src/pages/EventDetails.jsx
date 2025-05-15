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
      <Box sx={{ px: 4, py: 4 }}>
        {imageURL && (
          <img
            src={imageURL}
            alt={eventName}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
              marginBottom: "20px",
            }}
          />
        )}

        <Grid2
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Grid2>
            <Typography variant="h4">{eventName}</Typography>
          </Grid2>

          {!isOnline && (
            <Grid2>
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
            </Grid2>
          )}
        </Grid2>

        {/* Display Categories as Chips */}
        <Box sx={{ mb: 3 }}>
          {categories && categories.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
        </Box>

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

            <Typography variant="h6" sx={{ mb: 2 , mt: 4 }}>
              About this event
            </Typography>
            <Box>
              <Typography color="text.secondary" sx={{ mb: 4 }}>{description}</Typography>
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
