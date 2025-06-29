import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Archive } from '@mui/icons-material';
import { bulkArchivePastEvents } from '../apis/eventsAPI';

interface BulkArchiveButtonProps {
  onBulkArchiveSuccess?: (archivedCount: number) => void;
}

export const BulkArchiveButton: React.FC<BulkArchiveButtonProps> = ({
  onBulkArchiveSuccess,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBulkArchive = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await bulkArchivePastEvents();
      setDialogOpen(false);
      onBulkArchiveSuccess?.(result.archived_count);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to bulk archive events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Archive />}
        onClick={() => setDialogOpen(true)}
        color="warning"
      >
        Archive Past Events
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Archive Past Events</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="body1" gutterBottom>
            This will archive all events that have already ended. 
            Archived events will be hidden from regular views but can be restored later.
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            This action affects all past events in the system, not just your events.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkArchive} 
            variant="contained" 
            color="warning"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Archive Past Events'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
