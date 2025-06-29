import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Snackbar,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
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
      
      // Invalidate cache to ensure fresh data everywhere
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

  const handleCreateSubmit = (): void => {
    const form = document.querySelector("form") as HTMLFormElement;
    form?.requestSubmit();
  };

  const handleSnackbarClose = (): void => {
    setSuccessOpen(false);
  };

  const handleDialogClose = (): void => {
    setCancelDialogOpen(false);
  };

  if (!initialized) return <Typography>Loading profile...</Typography>;
  if (!profile?.email || !profile?.name)
    return <Typography>Profile incomplete.</Typography>;

  return (
    <>
      <NavBar />
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Create Event
          </Typography>

          <EventForm onSubmit={handleCreate} />

          <Divider sx={{ my: 4 }} />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateSubmit}
            >
              Create Event
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={cancelDialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel? All entered details will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Keep Editing
          </Button>
          <Button onClick={handleCancelConfirm} color="error">
            Discard
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Event created successfully"
      />
    </>
  );
};

export default CreateEvent;
