import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, updateEvent, deleteEvent } from "../apis/eventsAPI";
import { EventForm } from "../components/events";
import { NavBar } from "../components/navigation";
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
} from "@mui/material";
import { Edit as EditIcon, ArrowBack } from "@mui/icons-material";
import { Event } from "../types/Event";
import { Location } from "../types/User";

interface EventFormData {
  eventName: string;
  description: string;
  imageUrl?: string;
  startTime: string;
  duration: number;
  categories: string[];
  location?: Location;
  isOnline: boolean;
  joinLink?: string;
  organizers: string[];
  moderators: string[];
}

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError("Event ID not found");
      setLoading(false);
      return;
    }

    fetchEventById(id)
      .then((event) => setEventData(event))
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (formData: EventFormData): void => {
    if (!id) return;

    updateEvent(id, formData)
      .then(() => navigate(`/events/${id}`))
      .catch(() => setError("Failed to update event"));
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteEvent(id!);
      navigate("/events");
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError("Something went wrong while deleting the event.");
    }
    setDeleteDialogOpen(false);
  };

  const handleFormSubmit = (): void => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  // Loading
  if (loading) {
    return (
      <>
        <NavBar />
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress sx={{ color: '#FFBF49' }} />
          </Box>
        </Box>
      </>
    );
  }

  // Error (no data)
  if (error && !eventData) {
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

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box
              onClick={() => navigate(-1)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'text.secondary',
                mb: 1.5,
                '&:hover': { color: '#FFBF49' },
              }}
            >
              <ArrowBack sx={{ fontSize: 16 }} />
              Back
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(73, 163, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#49A3FF',
                }}
              >
                <EditIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  Edit Event
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update the event details below.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Error inline */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Form Card */}
          {eventData && (
            <Box
              sx={{
                p: { xs: 2.5, sm: 4 },
                borderRadius: '16px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <EventForm initialValues={eventData} onSubmit={handleSubmit} />

              <Divider sx={{ my: 4 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ borderRadius: '100px', px: 2.5, height: 36 }}
                >
                  Delete Event
                </Button>
                <Box display="flex" gap={1.5}>
                  <Button
                    variant="outlined"
                    onClick={() => setCancelDialogOpen(true)}
                    sx={{ borderRadius: '100px', px: 2.5, height: 36 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleFormSubmit}
                    sx={{ borderRadius: '100px', px: 3, height: 36 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to cancel? All changes will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelDialogOpen(false)} sx={{ borderRadius: '100px' }}>
            Keep Editing
          </Button>
          <Button onClick={() => navigate(-1)} color="error" variant="contained" sx={{ borderRadius: '100px' }}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog — replaces window.confirm */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Event?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This action cannot be undone. The event and all associated data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '100px' }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: '100px' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditEvent;
