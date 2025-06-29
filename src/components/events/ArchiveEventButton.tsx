import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Archive, Unarchive } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { Event } from '../../types/Event';
import { archiveEvent, unarchiveEvent } from '../../apis/eventsAPI';

interface ArchiveEventButtonProps {
  event: Event;
  isArchived?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
  onArchiveSuccess?: () => void;
  onUnarchiveSuccess?: () => void;
}

export const ArchiveEventButton: React.FC<ArchiveEventButtonProps> = ({
  event,
  isArchived = false,
  size = 'medium',
  variant = 'outlined',
  onArchiveSuccess,
  onUnarchiveSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArchive = async () => {
    if (!reason.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await archiveEvent(event.eventId, reason);
      setDialogOpen(false);
      setReason('');
      onArchiveSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to archive event');
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async () => {
    setLoading(true);
    setError(null);

    try {
      await unarchiveEvent(event.eventId);
      onUnarchiveSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to unarchive event');
    } finally {
      setLoading(false);
    }
  };

  if (isArchived) {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          startIcon={loading ? <CircularProgress size={16} /> : <Unarchive />}
          onClick={handleUnarchive}
          disabled={loading}
          color="success"
        >
          {loading ? 'Restoring...' : 'Restore'}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={<Archive />}
        onClick={() => setDialogOpen(true)}
        disabled={loading}
        color="warning"
      >
        Archive
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Archive Event</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Reason for archiving"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Event completed successfully, Event cancelled, etc."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleArchive} 
            variant="contained" 
            disabled={!reason.trim() || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Archive Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
