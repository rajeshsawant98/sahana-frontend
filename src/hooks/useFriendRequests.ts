import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  fetchFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  setActiveTab,
  clearErrors,
  clearRequestError
} from '../redux/slices/friendRequestsSlice';
import { useAsyncDispatch, useTabManagement, useRefresh } from './useCommonOperations';

export const useFriendRequests = () => {
  const friendRequestsState = useSelector((state: RootState) => state.friendRequests);
  const { executeAsync, dispatch } = useAsyncDispatch();
  const { handleTabChange } = useTabManagement(setActiveTab, clearErrors);
  const { refresh } = useRefresh(fetchFriendRequests);

  // Load friend requests on mount
  useEffect(() => {
    dispatch(fetchFriendRequests());
  }, [dispatch]);

  const handleAcceptRequest = (requestId: string) => 
    executeAsync(acceptFriendRequest, requestId);

  const handleRejectRequest = (requestId: string) => 
    executeAsync(rejectFriendRequest, requestId);

  const handleCancelRequest = (requestId: string) => 
    executeAsync(cancelFriendRequest, requestId);

  const handleClearError = (requestId: string) => {
    dispatch(clearRequestError(requestId));
  };

  return {
    ...friendRequestsState,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleTabChange,
    handleClearError,
    refreshRequests: refresh,
  };
};
