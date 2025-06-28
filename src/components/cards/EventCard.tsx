import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
  AvatarGroup,
  Link,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { rsvpToEvent } from "../../apis/eventsAPI";
import { addRSVPedEvent } from "../../redux/slices/userEventsSlice";
import { Event } from "../../types/Event";
import musicImage from "../../assets/categories/Music.svg";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const handleCardClick = (): void => {
    navigate(`/events/${event.eventId}`);
  };
  
  const rsvpedEvents = useSelector((state: RootState) => state.userEvents.rsvpedEvents);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isRSVPed = rsvpedEvents.some(
    (r) => r.eventId === event.eventId
  );

  const RSVP = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      await rsvpToEvent(event.eventId, { status: "joined" });
      // Add this event to the RSVP'd events list
      dispatch(addRSVPedEvent(event));
    } catch (err) {
      console.error("RSVP failed:", err);
    }
  };

  // Format the start time (using the JavaScript Date object)
  const startTime = new Date(event.startTime);
  const formattedTime = startTime.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Destructure location to use its properties
  const { city, country } = event.location || {}; // Check if location exists

  return (
    <Card
      variant="outlined"
      sx={{
        width: 380,
        height: "100%", // Ensures it stretches to match others
        display: "flex",
        flexDirection: "column", // So CardContent + Actions stack vertically
        justifyContent: "space-between", // Pushes actions to bottom
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Avatar and Avatar Group */}
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Avatar
          src={event.imageUrl || musicImage} // Use the imported image
          sx={{ width: 56, height: 56 }}
        />
        <AvatarGroup
          max={4}
          sx={{ "& .MuiAvatar-root": { width: 28, height: 28 } }}
        >
          <Avatar src="/static/images/avatar/2.jpg" />
          <Avatar src="/static/images/avatar/3.jpg" />
          <Avatar src="/static/images/avatar/4.jpg" />
          <Avatar>+4K</Avatar>
        </AvatarGroup>
      </CardContent>

      {/* Card content */}
      <CardContent>
        <Typography variant="h6" component="div">
          {event.eventName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
        >
          <LocationOnRoundedIcon sx={{ fontSize: 18 }} />
          {/* Render city and country if available */}
          {city && country ? `${city}, ${country}` : event.location?.formattedAddress || 'Location not specified'}
        </Typography>
        {/* Display event start time with calendar icon */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <CalendarTodayIcon sx={{ fontSize: 18 }} />
          {formattedTime}
        </Typography>
      </CardContent>

      {/* Card actions */}
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          padding: "16px",
        }}
      >
        <Link
          href="#"
          underline="hover"
          sx={{ textAlign: "right" }}
          onClick={handleCardClick}
        >
          View Details
        </Link>

        {isAuthenticated && (
          isRSVPed ? (
            <Button variant="outlined" color="success" size="small" disabled>
              Joined
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={RSVP}
            >
              Join
            </Button>
          )
        )}
      </CardActions>
    </Card>
  );
};

export default EventCard;
