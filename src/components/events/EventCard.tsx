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

// Module-level sx constants — created once, never recreated on re-render
const cardBaseSx = {
  width: "100%",
  maxWidth: 400,
  borderRadius: 4,
  overflow: "hidden",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  mx: "auto",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },
} as const;

const cardContentSx = { pb: 2, flex: 1, display: "flex", flexDirection: "column" } as const;

const avatarSx = { width: 80, height: 80, borderRadius: 3 } as const;

const avatarSlotProps = { img: { loading: 'lazy' as const } };

const locationTypographySx = {
  color: "text.secondary",
  fontWeight: 600,
  fontSize: "0.75rem",
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  lineHeight: 1.5,
  letterSpacing: 0,
  mb: 0.5,
} as const;

const locationIconSx = { fontSize: 14, verticalAlign: "middle", position: "relative", top: 1 } as const;

const titleSx = {
  fontWeight: 700,
  lineHeight: 1.2,
  color: "text.primary",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  maxHeight: "2.4em",
  minHeight: "1.2em",
} as const;

const archivedChipSx = { ml: 1, flexShrink: 0 } as const;

const statValueSx = { fontWeight: 700, color: "text.primary", lineHeight: 1 } as const;

const statLabelSx = { color: "text.secondary", fontWeight: 500, mt: 0.5 } as const;

const cardActionsSx = {
  display: "flex",
  justifyContent: "center",
  padding: 1,
  minHeight: 40,
  alignItems: "center",
} as const;

const viewButtonSx = {
  color: "primary.main",
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "underline",
  },
} as const;

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
    <Card sx={{ ...cardBaseSx, opacity: event.isArchived ? 0.6 : 1 }}>
      {/* Header Section */}
      <CardContent sx={cardContentSx}>
        <Box display="flex" alignItems="top" gap={3} mb={3}>
          <Avatar
            src={event.imageUrl || musicImage}
            sx={avatarSx}
            variant="rounded"
            slotProps={avatarSlotProps}
          />
          <Box flex={1}>
            <Typography variant="overline" sx={locationTypographySx}>
              <LocationOnRoundedIcon sx={locationIconSx} />
              {locationText}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography
                variant="h5"
                component="div"
                sx={titleSx}
              >
                {event.eventName}
              </Typography>
              {event.isArchived && (
                <Chip label="Archived" size="small" color="warning" sx={archivedChipSx} />
              )}
            </Box>
          </Box>
        </Box>

        {/* Event Details Grid */}
        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2}>
          {/* Date */}
          <Box textAlign="center">
            <Typography variant="h6" sx={statValueSx}>{formattedDate}</Typography>
            <Typography variant="body2" sx={statLabelSx}>Date</Typography>
          </Box>

          {/* Time */}
          <Box textAlign="center">
            <Typography variant="h5" sx={statValueSx}>{formattedTime}</Typography>
            <Typography variant="body2" sx={statLabelSx}>Time</Typography>
          </Box>

          {/* Attendees */}
          <Box textAlign="center">
            <Typography variant="h5" sx={statValueSx}>{attendeeCount}</Typography>
            <Typography variant="body2" sx={statLabelSx}>Attending</Typography>
          </Box>
        </Box>
      </CardContent>
      <Divider />

      {/* Actions Section */}
      <CardActions sx={cardActionsSx}>
        <Button
          variant="text"
          onClick={handleCardClick}
          sx={viewButtonSx}
        >
          View Event
        </Button>
      </CardActions>
    </Card>
  );
};

export default React.memo(EventCard);
