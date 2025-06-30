import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { useNavigate } from "react-router-dom";
import { Event } from "../../types/Event";
import musicImage from "../../assets/categories/Music.svg";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = (): void => {
    navigate(`/events/${event.eventId}`);
  };

  // Format the start time
  const startTime = new Date(event.startTime);
  const formattedDate = startTime.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = startTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Get location info
  const { city, state } = event.location || {};
  const locationText = city && state ? `${city}, ${state}` : event.location?.formattedAddress || 'Location not specified';

  // Get attendee count from RSVP list
  const attendeeCount = event.rsvpList?.length || 0;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 400,
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        opacity: event.isArchived ? 0.6 : 1,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        mx: "auto", // Center the card if it's smaller than container
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header Section */}
      <CardContent sx={{ pb: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <Box display="flex" alignItems="top" gap={3} mb={3}>
          <Avatar
            src={event.imageUrl || musicImage}
            sx={{ 
              width: 80, 
              height: 80,
              borderRadius: 3,
            }}
            variant="rounded"
          />
          <Box flex={1}>
            <Typography
              variant="overline"
              sx={{ 
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                lineHeight: 1.5,
                letterSpacing: 0,
                mb: 0.5
              }}
            >
              <LocationOnRoundedIcon sx={{ fontSize: 14, verticalAlign: "middle", position: "relative", top: 1 }} />
              {locationText}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography 
                variant="h5" 
                component="div"
                sx={{ 
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "text.primary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  maxHeight: "2.4em",
                  minHeight: "1.2em"
                }}
              >
                {event.eventName}
              </Typography>
              {event.isArchived && (
                <Chip label="Archived" size="small" color="warning" sx={{ ml: 1, flexShrink: 0 }} />
              )}
            </Box>
          </Box>
        </Box>

        {/* Event Details Grid */}
        <Box 
          display="grid" 
          gridTemplateColumns="1fr 1fr 1fr" 
          gap={2}
        >
          {/* Date */}
          <Box textAlign="center">
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1
              }}
            >
              {formattedDate}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "text.secondary",
                fontWeight: 500,
                mt: 0.5
              }}
            >
              Date
            </Typography>
          </Box>

          {/* Time */}
          <Box textAlign="center">
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1
              }}
            >
              {formattedTime}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "text.secondary",
                fontWeight: 500,
                mt: 0.5
              }}
            >
              Time
            </Typography>
          </Box>

          {/* Attendees */}
          <Box textAlign="center">
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1
              }}
            >
              {attendeeCount}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "text.secondary",
                fontWeight: 500,
                mt: 0.5
              }}
            >
              Attending
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Divider  />

      {/* Description Section */}

      {/* Actions Section */}
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 1,
          minHeight: 40,
          alignItems: "center"
        }}
      >
        <Button
          variant="text"
          onClick={handleCardClick}
          sx={{
            color: "primary.main",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline"
            }
          }}
        >
          View Event
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
