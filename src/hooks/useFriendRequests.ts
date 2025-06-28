import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { 
  fetchFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  setActiveTab,
  clearErrors,
  clearRequestError
} from '../redux/slices/friendRequestsSlice';

export const useFriendRequests = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friendRequestsState = useSelector((state: RootState) => state.friendRequests);

  // Load friend requests on mount
  useEffect(() => {
    dispatch(fetchFriendRequests());
  }, [dispatch]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await dispatch(acceptFriendRequest(requestId)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await dispatch(rejectFriendRequest(requestId)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await dispatch(cancelFriendRequest(requestId)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const handleTabChange = (tab: 'received' | 'sent') => {
    dispatch(setActiveTab(tab));
  };

  const handleClearError = (requestId: string) => {
    dispatch(clearRequestError(requestId));
  };

  const refreshRequests = () => {
    dispatch(fetchFriendRequests());
  };

  return {
    ...friendRequestsState,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleTabChange,
    handleClearError,
    refreshRequests,
  };
};
