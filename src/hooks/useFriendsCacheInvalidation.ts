import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { invalidateCache } from '../utils/cacheUtils';
import { fetchFriends } from '../redux/slices/friendsSlice';
import { fetchFriendRequests } from '../redux/slices/friendRequestsSlice';

export const useFriendsCacheInvalidation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const invalidateFriends = () => {
    invalidateCache.friends();
    dispatch(fetchFriends());
  };

  const invalidateFriendRequests = () => {
    invalidateCache.friendRequests();
    dispatch(fetchFriendRequests());
  };

  const invalidateUserSearch = () => {
    invalidateCache.userSearch();
  };

  const invalidateUserProfiles = () => {
    invalidateCache.userProfiles();
  };

  const invalidateAllFriendsData = () => {
    invalidateCache.friends();
    invalidateCache.friendRequests();
    invalidateCache.userSearch();
    invalidateCache.userProfiles();
    dispatch(fetchFriends());
    dispatch(fetchFriendRequests());
  };

  return {
    invalidateFriends,
    invalidateFriendRequests,
    invalidateUserSearch,
    invalidateUserProfiles,
    invalidateAllFriendsData,
  };
};
