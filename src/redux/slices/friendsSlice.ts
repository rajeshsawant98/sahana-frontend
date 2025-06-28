import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import friendsAPI from '../../apis/friendsAPI';
import { FriendProfile, UserSearchResult, FriendsUIState } from '../../types/friends';
import { invalidateCache } from '../../utils/cacheUtils';

interface FriendsState {
  friends: FriendProfile[];
  searchResults: UserSearchResult[];
  ui: FriendsUIState;
  loading: {
    friends: boolean;
    search: boolean;
    sendRequest: boolean;
  };
  errors: {
    friends: string | null;
    search: string | null;
    sendRequest: string | null;
  };
}

const initialState: FriendsState = {
  friends: [],
  searchResults: [],
  ui: {
    searchTerm: '',
    searchResults: [],
    isSearching: false,
    selectedTab: 'friends',
  },
  loading: {
    friends: false,
    search: false,
    sendRequest: false,
  },
  errors: {
    friends: null,
    search: null,
    sendRequest: null,
  },
};

// Async Thunks
export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const friends = await friendsAPI.getFriendsList();
      return friends;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch friends');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'friends/searchUsers',
  async ({ query, limit = 20 }: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      if (!query.trim()) return [];
      const results = await friendsAPI.searchUsers(query, limit);
      return results;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search users');
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  'friends/sendFriendRequest',
  async (receiverId: string, { rejectWithValue, dispatch }) => {
    try {
      const result = await friendsAPI.sendFriendRequest({ receiver_id: receiverId });
      
      // Invalidate relevant caches
      invalidateCache.friendRequests();
      invalidateCache.userSearch();
      
      // Update search results to reflect the new pending status
      dispatch(updateSearchResultStatus({ userId: receiverId, status: 'pending_sent' }));
      
      return { receiverId, ...result };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send friend request');
    }
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.ui.searchTerm = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.ui.searchTerm = '';
    },
    setSelectedTab: (state, action: PayloadAction<'friends' | 'requests' | 'search'>) => {
      state.ui.selectedTab = action.payload;
    },
    updateSearchResultStatus: (state, action: PayloadAction<{ userId: string; status: UserSearchResult['friendship_status'] }>) => {
      const { userId, status } = action.payload;
      const result = state.searchResults.find(r => r.id === userId);
      if (result) {
        result.friendship_status = status;
      }
    },
    clearErrors: (state) => {
      state.errors = {
        friends: null,
        search: null,
        sendRequest: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Friends
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading.friends = true;
        state.errors.friends = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading.friends = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading.friends = false;
        state.errors.friends = action.payload as string;
      });

    // Search Users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading.search = true;
        state.errors.search = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading.search = false;
        state.errors.search = action.payload as string;
      });

    // Send Friend Request
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading.sendRequest = true;
        state.errors.sendRequest = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.loading.sendRequest = false;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading.sendRequest = false;
        state.errors.sendRequest = action.payload as string;
      });
  },
});

export const {
  setSearchTerm,
  clearSearchResults,
  setSelectedTab,
  updateSearchResultStatus,
  clearErrors,
} = friendsSlice.actions;

export default friendsSlice.reducer;
