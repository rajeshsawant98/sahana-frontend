import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  fetchFriends,
  searchUsers,
  semanticSearchUsers,
  sendFriendRequest,
  fetchRecommendations,
  setSearchTerm,
  clearSearchResults,
  clearSemanticResults,
  setSelectedTab,
  setSearchMode,
  clearErrors,
} from '../redux/slices/friendsSlice';
import { useDebounce } from './useDebounce';
import { useAsyncDispatch, useTabManagement, useRefresh } from './useCommonOperations';

export const useFriends = () => {
  const friendsState = useSelector((state: RootState) => state.friends);
  const { executeAsync, dispatch } = useAsyncDispatch();
  const { handleTabChange } = useTabManagement(setSelectedTab, clearErrors);
  const { refresh } = useRefresh(fetchFriends);
  
  const debouncedSearchTerm = useDebounce(friendsState.ui.searchTerm, 500);
  const searchMode = friendsState.ui.searchMode;
  // Tracks the live searchTerm so effects can detect when the debounce hasn't
  // caught up yet (e.g. after a mode switch clears the input).
  const liveSearchTermRef = useRef(friendsState.ui.searchTerm);
  liveSearchTermRef.current = friendsState.ui.searchTerm;

  // Auto-search when debounced term changes (regular mode)
  useEffect(() => {
    if (searchMode !== 'regular') return;
    // Skip if the debounced value is stale (live term has already changed).
    if (debouncedSearchTerm !== liveSearchTermRef.current) return;
    if (debouncedSearchTerm.trim()) {
      dispatch(searchUsers({ query: debouncedSearchTerm }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedSearchTerm, searchMode, dispatch]);

  // Auto-search when debounced term changes (semantic/AI mode)
  useEffect(() => {
    if (searchMode !== 'semantic') return;
    // Skip if the debounced value is stale (live term has already changed).
    if (debouncedSearchTerm !== liveSearchTermRef.current) return;
    if (debouncedSearchTerm.trim()) {
      dispatch(semanticSearchUsers({ query: debouncedSearchTerm }));
    } else {
      dispatch(clearSemanticResults());
    }
  }, [debouncedSearchTerm, searchMode, dispatch]);

  // Load friends when tab switches to 'friends' and list is empty
  useEffect(() => {
    if (friendsState.ui.selectedTab === 'friends' && friendsState.friends.length === 0) {
      dispatch(fetchFriends());
    }
  }, [friendsState.ui.selectedTab, dispatch]); // friends.length is a guard, not a trigger

  // Load recommendations when tab switches to 'recommended' and list is empty
  useEffect(() => {
    if (friendsState.ui.selectedTab === 'recommended' && friendsState.recommendations.length === 0) {
      dispatch(fetchRecommendations());
    }
  }, [friendsState.ui.selectedTab, dispatch]);

  const handleSearchTermChange = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  const handleSendFriendRequest = (receiverId: string) =>
    executeAsync(sendFriendRequest, receiverId);

  const handleSearchModeChange = (mode: 'regular' | 'semantic') => {
    dispatch(setSearchMode(mode));
  };

  const refreshRecommendations = () => {
    dispatch(fetchRecommendations());
  };

  return {
    ...friendsState,
    handleSearchTermChange,
    handleSearchModeChange,
    handleSendFriendRequest,
    handleTabChange,
    refreshFriends: refresh,
    refreshRecommendations,
  };
};
