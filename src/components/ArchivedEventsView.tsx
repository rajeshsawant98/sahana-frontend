import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  CircularProgress,
  Grid2,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { Event } from '../types/Event';
import { fetchArchivedEvents } from '../apis/eventsAPI';
import { ArchiveEventButton } from './ArchiveEventButton';

export const ArchivedEventsView: React.FC = () => {
  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArchivedEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchArchivedEvents();
      setArchivedEvents(response.archived_events);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch archived events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedEvents();
  }, []);

  const handleUnarchiveSuccess = () => {
    // Refresh the archived events list
    loadArchivedEvents();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (archivedEvents.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No archived events
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Events you archive will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Archived Events ({archivedEvents.length})
      </Typography>
      
      <Grid2 container spacing={2}>
        {archivedEvents.map((event) => (
          <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={event.eventId}>
            <Card variant="outlined" sx={{ opacity: 0.8 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="h6" component="h3">
                    {event.eventName}
                  </Typography>
                  <Chip label="Archived" size="small" color="warning" />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.description}
                </Typography>
                
                <Typography variant="caption" display="block" mt={2}>
                  Start Time: {new Date(event.startTime).toLocaleDateString()}
                </Typography>
                
                {event.archivedAt && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    Archived {formatDistanceToNow(new Date(event.archivedAt))} ago
                  </Typography>
                )}
                
                {event.archiveReason && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    Reason: {event.archiveReason}
                  </Typography>
                )}
                
                {event.archivedBy && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    By: {event.archivedBy}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions>
                <ArchiveEventButton 
                  event={event} 
                  isArchived={true} 
                  size="small" 
                  onUnarchiveSuccess={handleUnarchiveSuccess}
                />
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};
