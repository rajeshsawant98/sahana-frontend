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
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { Event } from "../types/Event";
import { LocationData } from "../types/User";

interface EventFormData {
  eventName: string;
  description: string;
  imageUrl?: string;
  startTime: string;
  duration: number;
  categories: string[];
  location?: LocationData;
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
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await deleteEvent(id!);
        navigate("/events");
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert("Something went wrong while deleting the event.");
      }
    }
  };

  const handleFormSubmit = (): void => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ marginY: 4  }}>
        <Typography variant="h4" gutterBottom>
          Edit Event
        </Typography>

        {eventData && (
          <>
            <EventForm initialValues={eventData} onSubmit={handleSubmit} />

            <Divider sx={{ my: 4 }} />

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setCancelDialogOpen(true)}
              >
                Cancel
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
              <Button
                variant="contained"
                onClick={handleFormSubmit}
              >
                Save Changes
              </Button>
            </Box>
          </>
        )}
      </Container>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel? All changes will be lost.
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
    </>
  );
};

export default EditEvent;
