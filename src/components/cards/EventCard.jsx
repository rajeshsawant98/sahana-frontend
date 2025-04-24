import * as React from "react";
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
import axiosInstance from "../../utils/axiosInstance";

export default function EventCard({ event }) {
  const navigate = useNavigate(); // Initialize navigate hook
  const handleCardClick = () => {
    // Handle card click (e.g., navigate to event details)
    navigate(`/events/${event.eventId}`);
    console.log("Card clicked:", event.eventName);
  };

  const RSVP = async () => {
    try {
      console.log(localStorage.getItem("access_token"));
      const { data } = await axiosInstance.post(`/events/${event.eventId}/rsvp`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(data);
   
    } catch (err) {
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
        height: "auto", // Let the card height adjust based on the content
        overflow: "hidden",
        cursor: "pointer", // Makes the whole card clickable
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
          src="assets/categories/Music.svg"
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {event.description}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <LocationOnRoundedIcon sx={{ fontSize: 18 }} />
          {/* Render city and country if available */}
          {city && country ? `${city}, ${country}` : event.location}
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
          justifyContent: "flex-end", // Align buttons to the right
          gap: 2,
          padding: "16px", // Ensure proper padding around buttons
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
        <Button variant="contained" color="primary" size="small" 
          onClick={RSVP}
        >
          Join
        </Button>
      </CardActions>
    </Card>
  );
}
