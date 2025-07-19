import { useCallback } from 'react';
import { AsyncThunk } from '@reduxjs/toolkit';
import { useAppDispatch } from '../redux/hooks';
import { AsyncOperationResult, handleAsyncOperation } from '../utils/reduxHelpers';

/**
 * Generic hook for handling async Redux operations with consistent error handling
 */
export const useAsyncDispatch = () => {
  const dispatch = useAppDispatch();

  const executeAsync = useCallback(async <T>(
    asyncThunk: AsyncThunk<any, T, any>,
    payload: T
  ): Promise<AsyncOperationResult> => {
    return handleAsyncOperation(async () => {
      return await dispatch(asyncThunk(payload)).unwrap();
    });
  }, [dispatch]);

  const executeAsyncWithoutPayload = useCallback(async (
    asyncThunk: AsyncThunk<any, void, any>
  ): Promise<AsyncOperationResult> => {
    return handleAsyncOperation(async () => {
      return await dispatch(asyncThunk()).unwrap();
    });
  }, [dispatch]);

  return {
    executeAsync,
    executeAsyncWithoutPayload,
    dispatch
  };
};

/**
 * Hook for common tab management pattern
 */
export const useTabManagement = <T extends string>(
  setTabAction: (tab: T) => any,
  clearErrorsAction?: () => any
) => {
  const dispatch = useAppDispatch();

  const handleTabChange = useCallback((tab: T) => {
    dispatch(setTabAction(tab));
    if (clearErrorsAction) {
      dispatch(clearErrorsAction());
    }
  }, [dispatch, setTabAction, clearErrorsAction]);

  return { handleTabChange };
};

/**
 * Hook for common refresh pattern
 */
export const useRefresh = (refreshAction: () => any) => {
  const dispatch = useAppDispatch();

  const refresh = useCallback(() => {
    dispatch(refreshAction());
  }, [dispatch, refreshAction]);

  return { refresh };
};
