import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Snackbar,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from "@mui/material";
import { Add as AddIcon, ArrowBack } from "@mui/icons-material";
import { RootState, AppDispatch } from "../redux/store";
import { addCreatedEventLocal } from "../redux/slices/userEventsSlice";
import { EventForm } from "../components/events";
import { createEvent, updateEventOrganizers, updateEventModerators } from "../apis/eventsAPI";
import { NavBar } from "../components/navigation";
import { useCacheInvalidation } from "../hooks/useCacheInvalidation";

interface EventFormData {
  eventName: string;
  description?: string;
  location?: any;
  startTime: string;
  duration: number;
  categories: string[];
  isOnline: boolean;
  joinLink?: string;
  organizers: string[];
  moderators: string[];
  imageUrl?: string;
  createdBy?: string;
  createdByEmail?: string;
}

const CreateEvent: React.FC = () => {
  const profile = useSelector((state: RootState) => state.auth.user);
  const initialized = useSelector((state: RootState) => state.auth.initialized);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { invalidateUserEvents, invalidateEvents, invalidateNearbyEvents } = useCacheInvalidation();

  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const handleCreate = async (formData: EventFormData): Promise<void> => {
    try {
      if (!profile?.email || !profile?.name) {
        console.warn("Missing profile info");
        return;
      }

      const eventData = {
        ...formData,
        createdBy: profile.name,
        createdByEmail: profile.email,
      };

      const eventRes = await createEvent(eventData);
      const eventId = eventRes.eventId;

      if (formData.organizers?.length > 0) {
        await updateEventOrganizers(eventId, {
          organizerEmails: formData.organizers,
        });
      }

      if (formData.moderators?.length > 0) {
        await updateEventModerators(eventId, {
          moderatorEmails: formData.moderators,
        });
      }

      dispatch(addCreatedEventLocal({
        ...eventData,
        eventId,
        categories: formData.categories || [],
        organizers: formData.organizers || [],
        moderators: formData.moderators || [],
      }));

      invalidateUserEvents();
      invalidateEvents();
      if (formData.location?.city && formData.location?.state) {
        invalidateNearbyEvents(formData.location.city, formData.location.state);
      }

      setSuccessOpen(true);

      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 2000);
    } catch (error) {
      console.error("Event creation failed:", error);
    }
  };

  const handleCancel = (): void => {
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = (): void => {
    navigate(-1);
  };

  const handleFormSubmit = (): void => {
    const form = document.querySelector("form") as HTMLFormElement;
    form?.requestSubmit();
  };

  if (!initialized) {
    return (
      <>
        <NavBar />
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography color="text.secondary">Loading profile...</Typography>
          </Container>
        </Box>
      </>
    );
  }

  if (!profile?.email || !profile?.name) {
    return (
      <>
        <NavBar />
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography color="text.secondary">Profile incomplete.</Typography>
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
                  backgroundColor: 'rgba(255, 191, 73, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFBF49',
                }}
              >
                <AddIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  Create Event
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill in the details to create a new event.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Form Card */}
          <Box
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: '16px',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <EventForm onSubmit={handleCreate} />

            <Divider sx={{ my: 4 }} />

            <Box display="flex" justifyContent="flex-end" gap={1.5}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ borderRadius: '100px', px: 2.5, height: 36 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleFormSubmit}
                sx={{ borderRadius: '100px', px: 3, height: 36 }}
              >
                Create Event
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to cancel? All entered details will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelDialogOpen(false)} sx={{ borderRadius: '100px' }}>
            Keep Editing
          </Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained" sx={{ borderRadius: '100px' }}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        message="Event created successfully! Redirecting..."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default CreateEvent;
