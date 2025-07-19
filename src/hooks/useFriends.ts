import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  fetchFriends, 
  searchUsers, 
  sendFriendRequest,
  setSearchTerm,
  clearSearchResults,
  setSelectedTab,
  clearErrors 
} from '../redux/slices/friendsSlice';
import { useDebounce } from './useDebounce';
import { useAsyncDispatch, useTabManagement, useRefresh } from './useCommonOperations';

export const useFriends = () => {
  const friendsState = useSelector((state: RootState) => state.friends);
  const { executeAsync, dispatch } = useAsyncDispatch();
  const { handleTabChange } = useTabManagement(setSelectedTab, clearErrors);
  const { refresh } = useRefresh(fetchFriends);
  
  const debouncedSearchTerm = useDebounce(friendsState.ui.searchTerm, 500);

  // Auto-search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      dispatch(searchUsers({ query: debouncedSearchTerm }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedSearchTerm, dispatch]);

  // Load friends on mount
  useEffect(() => {
    if (friendsState.ui.selectedTab === 'friends' && friendsState.friends.length === 0) {
      dispatch(fetchFriends());
    }
  }, [friendsState.ui.selectedTab, friendsState.friends.length, dispatch]);

  const handleSearchTermChange = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  const handleSendFriendRequest = (receiverId: string) =>
    executeAsync(sendFriendRequest, receiverId);

  return {
    ...friendsState,
    handleSearchTermChange,
    handleSendFriendRequest,
    handleTabChange,
    refreshFriends: refresh,
  };
};
