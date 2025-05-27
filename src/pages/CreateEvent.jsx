import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addCreatedEventLocal } from "../redux/slices/userEventsSlice";
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
import EventForm from "../components/EventForm";
import axiosInstance from "../utils/axiosInstance";
import NavBar from "../components/NavBar";

const CreateEvent = () => {
  const profile = useSelector((state) => state.auth.user);
  const initialized = useSelector((state) => state.auth.initialized);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [successOpen, setSuccessOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

  const handleCreate = async (formData) => {
    try {
      if (!profile?.email || !profile?.name) {
        console.warn("Missing profile info");
        return;
      }

      formData.createdBy = profile.name;
      formData.createdByEmail = profile.email;

      const eventRes = await axiosInstance.post("/events/new", formData);
      const eventId = eventRes.data.eventId;

      await axiosInstance.patch(`/events/${eventId}/organizers`, {
        organizerEmails: formData.organizers,
      });

      await axiosInstance.patch(`/events/${eventId}/moderators`, {
        moderatorEmails: formData.moderators,
      });

      dispatch(addCreatedEventLocal({ ...formData, eventId }));
      setSuccessOpen(true);

      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 2000);
    } catch (error) {
      console.error("Event creation failed:", error);
    }
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
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => document.querySelector("form")?.requestSubmit()}
            >
              Create Event
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel? All entered details will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} color="primary">
            Keep Editing
          </Button>
          <Button onClick={() => navigate(-1)} color="error">
            Discard
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        message="Event created successfully"
      />
    </>
  );
};

export default CreateEvent;