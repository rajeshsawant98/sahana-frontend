import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
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

export const useFriends = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friendsState = useSelector((state: RootState) => state.friends);
  
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

  const handleSendFriendRequest = async (receiverId: string) => {
    try {
      await dispatch(sendFriendRequest(receiverId)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const handleTabChange = (tab: 'friends' | 'requests' | 'search') => {
    dispatch(setSelectedTab(tab));
    dispatch(clearErrors());
  };

  const refreshFriends = () => {
    dispatch(fetchFriends());
  };

  return {
    ...friendsState,
    handleSearchTermChange,
    handleSendFriendRequest,
    handleTabChange,
    refreshFriends,
  };
};
