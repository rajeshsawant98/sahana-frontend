import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Container,
  Stack,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckIcon from "@mui/icons-material/Check";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import { RootState } from "../redux/store";
import { Event } from "../types/Event";
import { fetchEventById, rsvpToEvent, cancelRSVP } from "../apis/eventsAPI";
import { NavBar } from "../components/navigation";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const userRSVP = useMemo(() => {
    if (!isAuthenticated || !currentUser || !event || !event.rsvpList) return undefined;
    return event.rsvpList.find(rsvp => rsvp.email === currentUser.email);
  }, [isAuthenticated, currentUser, event]);

  const rsvpStatus = userRSVP?.status;

  const canEditEvent = useMemo(() => {
    if (!event || !currentUser) return false;
    return (
      event.createdByEmail === currentUser.email ||
      event.organizers?.includes(currentUser.email)
    );
  }, [event, currentUser]);

  useEffect(() => {
    if (!id) {
      setError("No event ID provided");
      setLoading(false);
      return;
    }

    fetchEventById(id)
      .then((event) => setEvent(event))
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRSVP = async (status: "joined" | "interested"): Promise<void> => {
    if (!id || !isAuthenticated) return;
    setError(null);
    try {
      await rsvpToEvent(id, { status });
      const updatedEvent = await fetchEventById(id);
      setEvent(updatedEvent);
    } catch (err: any) {
      const apiError = err?.response?.data?.detail || `Failed to RSVP as ${status}. Please try again.`;
      setError(apiError);
    }
  };

  const handleInterestedToggle = async (): Promise<void> => {
    if (!id || !isAuthenticated) return;
    setError(null);
    try {
      if (rsvpStatus === "interested") {
        await cancelRSVP(id, "interested");
      } else {
        await rsvpToEvent(id, { status: "interested" });
      }
      const updatedEvent = await fetchEventById(id);
      setEvent(updatedEvent);
    } catch (err: any) {
      const apiError = err?.response?.data?.detail || "Failed to update interest. Please try again.";
      setError(apiError);
    }
  };

  const handleEditClick = useCallback((): void => {
    if (id) navigate(`/events/${id}/edit`);
  }, [id, navigate]);

  const handleNavigateToLogin = useCallback(() => navigate('/login'), [navigate]);

  const formatDateTime = (dateString: string, includeTimezone = false): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      ...(includeTimezone && { timeZoneName: "short" }),
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <NavBar />
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 20 }}>
            <CircularProgress sx={{ color: '#FFBF49' }} />
          </Box>
        </Box>
      </>
    );
  }

  // Error state
  if (error && !event) {
    return (
      <>
        <NavBar />
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {error}
            </Alert>
          </Container>
        </Box>
      </>
    );
  }

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
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            height: { xs: 280, md: 380 },
            width: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {imageUrl ? (
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
                  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)",
                  zIndex: 2,
                }}
              />
            </>
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                zIndex: 1,
              }}
            />
          )}

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3, pb: 4 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "flex-end" }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: '-0.5px',
                    lineHeight: 1.1,
                    mb: 1.5,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {eventName}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ color: "rgba(255,255,255,0.9)" }}>
                  <Typography display="flex" alignItems="center" gap={0.75} variant="body2" sx={{ fontWeight: 500 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                    {formatDateTime(startTime)}
                  </Typography>
                  <Typography display="flex" alignItems="center" gap={0.75} variant="body2" sx={{ fontWeight: 500 }}>
                    <LocationOnIcon sx={{ fontSize: 16 }} />
                    {name || "Online"}
                  </Typography>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1.5}>
                {isAuthenticated && canEditEvent && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                    onClick={handleEditClick}
                    sx={{
                      borderRadius: '100px',
                      height: 36,
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.4)',
                      '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                    }}
                  >
                    Edit
                  </Button>
                )}
                {!isOnline && (
                  isAuthenticated ? (
                    <>
                      <Button
                        variant={rsvpStatus === "joined" ? "outlined" : "contained"}
                        startIcon={rsvpStatus === "joined" ? <CheckIcon /> : undefined}
                        disabled={rsvpStatus === "joined"}
                        onClick={() => handleRSVP("joined")}
                        sx={{
                          borderRadius: '100px',
                          height: 36,
                          px: 2.5,
                          ...(rsvpStatus === "joined" && {
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.4)',
                          }),
                        }}
                      >
                        {rsvpStatus === "joined" ? "Joined" : "Join Event"}
                      </Button>
                      {rsvpStatus !== "joined" && (
                        <Button
                          variant={rsvpStatus === "interested" ? "contained" : "outlined"}
                          color="secondary"
                          startIcon={rsvpStatus === "interested" ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          onClick={handleInterestedToggle}
                          sx={{
                            borderRadius: '100px',
                            height: 36,
                            px: 2,
                            ...(rsvpStatus !== "interested" && {
                              color: 'white',
                              borderColor: 'rgba(255,255,255,0.4)',
                              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                            }),
                          }}
                        >
                          Interested
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNavigateToLogin}
                      sx={{ borderRadius: '100px', height: 36, px: 2.5 }}
                    >
                      Login to Join
                    </Button>
                  )
                )}
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Error inline */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Category Chips */}
          {categories?.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
              {categories.map((cat: string, index: number) => (
                <Chip
                  key={index}
                  label={cat}
                  sx={{
                    borderRadius: "100px",
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    backgroundColor: 'rgba(255, 191, 73, 0.12)',
                    color: '#FFBF49',
                    border: '1px solid rgba(255, 191, 73, 0.25)',
                  }}
                />
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4,
            }}
          >
            {/* Left Column — Details */}
            <Box>
              {/* Date & Time Card */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 3,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
                  Date and Time
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatDateTime(startTime, true)}
                </Typography>
              </Box>

              {/* Location Card */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 3,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
                  Location
                </Typography>
                <Typography sx={{ fontWeight: 500, mb: 0.25 }}>{name}</Typography>
                <Typography variant="body2" color="text.secondary">{formattedAddress}</Typography>
              </Box>

              {/* About Card */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
                  About this Event
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {description}
                </Typography>
              </Box>
            </Box>

            {/* Right Column — Map or Online Link */}
            <Box>
              {!isOnline && latitude && longitude && (
                <Box
                  sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "380px" }}
                    center={{ lat: latitude, lng: longitude }}
                    zoom={15}
                  >
                    <Marker position={{ lat: latitude, lng: longitude }} />
                  </GoogleMap>
                </Box>
              )}

              {isOnline && joinLink && (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', color: 'text.secondary', mb: 2 }}>
                    Join Online
                  </Typography>
                  <Button
                    variant="contained"
                    href={joinLink}
                    target="_blank"
                    startIcon={<LinkIcon />}
                    sx={{ borderRadius: '100px', px: 3 }}
                  >
                    Join Now
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default EventDetails;
