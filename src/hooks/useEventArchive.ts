import { useState, useCallback } from 'react';
import { archiveEvent, unarchiveEvent, fetchArchivedEvents } from '../apis/eventsAPI';
import { handleAsyncOperation, AsyncOperationResult } from '../utils/reduxHelpers';

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

  const createAsyncHandler = useCallback((
    operation: () => Promise<any>,
    loadingKey: keyof typeof loading,
    errorKey: keyof typeof errors
  ) => {
    return async (): Promise<AsyncOperationResult> => {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      setErrors(prev => ({ ...prev, [errorKey]: null }));

      const result = await handleAsyncOperation(operation);
      
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
      
      if (!result.success) {
        setErrors(prev => ({ ...prev, [errorKey]: result.error || `Failed to ${loadingKey}` }));
      }
      
      return result;
    };
  }, []);

  const handleArchiveEvent = useCallback((eventId: string, reason: string) => 
    createAsyncHandler(
      () => archiveEvent(eventId, reason),
      'archiving',
      'archiving'
    )(), [createAsyncHandler]);

  const handleUnarchiveEvent = useCallback((eventId: string) => 
    createAsyncHandler(
      () => unarchiveEvent(eventId),
      'unarchiving',
      'unarchiving'
    )(), [createAsyncHandler]);

  const getArchivedEvents = useCallback(() => 
    createAsyncHandler(
      fetchArchivedEvents,
      'fetchingArchived',
      'fetchingArchived'
    )(), [createAsyncHandler]);

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
