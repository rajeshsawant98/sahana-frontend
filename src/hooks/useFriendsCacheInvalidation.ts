import { useCallback } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { invalidateCache } from '../utils/cacheUtils';
import { fetchFriends } from '../redux/slices/friendsSlice';
import { fetchFriendRequests } from '../redux/slices/friendRequestsSlice';

export const useFriendsCacheInvalidation = () => {
  const dispatch = useAppDispatch();

  // Helper to create invalidation + refetch functions
  const createInvalidateAndRefetch = useCallback((
    invalidateFunc: () => void,
    refetchFunc?: () => any
  ) => () => {
    invalidateFunc();
    if (refetchFunc) {
      dispatch(refetchFunc());
    }
  }, [dispatch]);

  const invalidateFriends = useCallback(
    createInvalidateAndRefetch(invalidateCache.friends, fetchFriends),
    [createInvalidateAndRefetch]
  );

  const invalidateFriendRequests = useCallback(
    createInvalidateAndRefetch(invalidateCache.friendRequests, fetchFriendRequests),
    [createInvalidateAndRefetch]
  );

  const invalidateUserSearch = useCallback(
    () => invalidateCache.userSearch(),
    []
  );

  const invalidateUserProfiles = useCallback(
    () => invalidateCache.userProfiles(),
    []
  );

  const invalidateAllFriendsData = useCallback(() => {
    invalidateCache.friends();
    invalidateCache.friendRequests();
    invalidateCache.userSearch();
    invalidateCache.userProfiles();
    dispatch(fetchFriends());
    dispatch(fetchFriendRequests());
  }, [dispatch]);

  return {
    invalidateFriends,
    invalidateFriendRequests,
    invalidateUserSearch,
    invalidateUserProfiles,
    invalidateAllFriendsData,
  };
};
