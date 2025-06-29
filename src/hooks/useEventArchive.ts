import { useState, useCallback } from 'react';
import { archiveEvent, unarchiveEvent, fetchArchivedEvents } from '../apis/eventsAPI';

export const useEventArchive = () => {
  const [loading, setLoading] = useState({
    archiving: false,
    unarchiving: false,
    fetchingArchived: false,
  });
  
  const [errors, setErrors] = useState({
    archiving: null as string | null,
    unarchiving: null as string | null,
    fetchingArchived: null as string | null,
  });

  const handleArchiveEvent = useCallback(async (eventId: string, reason: string) => {
    setLoading(prev => ({ ...prev, archiving: true }));
    setErrors(prev => ({ ...prev, archiving: null }));

    try {
      const result = await archiveEvent(eventId, reason);
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive event';
      setErrors(prev => ({ ...prev, archiving: errorMessage }));
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, archiving: false }));
    }
  }, []);

  const handleUnarchiveEvent = useCallback(async (eventId: string) => {
    setLoading(prev => ({ ...prev, unarchiving: true }));
    setErrors(prev => ({ ...prev, unarchiving: null }));

    try {
      const result = await unarchiveEvent(eventId);
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unarchive event';
      setErrors(prev => ({ ...prev, unarchiving: errorMessage }));
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, unarchiving: false }));
    }
  }, []);

  const getArchivedEvents = useCallback(async () => {
    setLoading(prev => ({ ...prev, fetchingArchived: true }));
    setErrors(prev => ({ ...prev, fetchingArchived: null }));

    try {
      const result = await fetchArchivedEvents();
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch archived events';
      setErrors(prev => ({ ...prev, fetchingArchived: errorMessage }));
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, fetchingArchived: false }));
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({
      archiving: null,
      unarchiving: null,
      fetchingArchived: null,
    });
  }, []);

  return {
    handleArchiveEvent,
    handleUnarchiveEvent,
    getArchivedEvents,
    clearErrors,
    loading,
    errors,
  };
};
