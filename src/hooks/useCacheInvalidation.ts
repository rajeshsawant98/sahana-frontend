// Cache invalidation hook for React components
import { useCallback } from 'react';
import { invalidateCache } from '../utils/cacheUtils';

export const useCacheInvalidation = () => {
  const invalidateEvents = useCallback(() => {
    invalidateCache.events();
  }, []);

  const invalidateUserEvents = useCallback(() => {
    invalidateCache.userEvents();
  }, []);

  const invalidateNearbyEvents = useCallback((city?: string, state?: string) => {
    invalidateCache.nearbyEvents(city, state);
  }, []);

  const invalidateAdminData = useCallback(() => {
    invalidateCache.adminUsers();
    invalidateCache.adminEvents();
  }, []);

  const invalidateAll = useCallback(() => {
    invalidateCache.all();
  }, []);

  return {
    invalidateEvents,
    invalidateUserEvents,
    invalidateNearbyEvents,
    invalidateAdminData,
    invalidateAll,
  };
};
