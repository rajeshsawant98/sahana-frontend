import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import { fetchAllAdminEvents } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { useNavigate } from "react-router-dom";

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllAdminEvents()
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <NavBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Events
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Paper sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.eventId}>
                    <TableCell>{event.eventName}</TableCell>
                    <TableCell>{event.createdByEmail}</TableCell>
                    <TableCell>
                      {new Date(event.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{event.location?.city || "Online"}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/events/${event.eventId}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default ManageEvents;