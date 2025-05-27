import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import EventForm from "../components/EventForm";
import NavBar from "../components/NavBar";
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

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/events/${id}`)
      .then((res) => setEventData(res.data))
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (formData) => {
    axiosInstance
      .put(`/events/${id}`, formData)
      .then(() => navigate(`/events/${id}`))
      .catch(() => setError("Failed to update event"));
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await axiosInstance.delete(`/events/${id}`);
        navigate("/");
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert("Something went wrong while deleting the event.");
      }
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
                onClick={() => document.querySelector("form")?.requestSubmit()}
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
