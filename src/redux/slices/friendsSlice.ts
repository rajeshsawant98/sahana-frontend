import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import friendsAPI from '../../apis/friendsAPI';
import { FriendProfile, UserSearchResult, FriendsUIState, RecommendedUser, SemanticUserResult } from '../../types/friends';
import { invalidateCache } from '../../utils/cacheUtils';

interface FriendsState {
  friends: FriendProfile[];
  searchResults: UserSearchResult[];
  semanticResults: SemanticUserResult[];
  recommendations: RecommendedUser[];
  ui: FriendsUIState;
  loading: {
    friends: boolean;
    search: boolean;
    semanticSearch: boolean;
    sendRequest: boolean;
    recommendations: boolean;
  };
  errors: {
    friends: string | null;
    search: string | null;
    semanticSearch: string | null;
    sendRequest: string | null;
    recommendations: string | null;
  };
}

const initialState: FriendsState = {
  friends: [],
  searchResults: [],
  semanticResults: [],
  recommendations: [],
  ui: {
    searchTerm: '',
    searchResults: [],
    isSearching: false,
    selectedTab: 'friends',
    searchMode: 'regular',
  },
  loading: {
    friends: false,
    search: false,
    semanticSearch: false,
    sendRequest: false,
    recommendations: false,
  },
  errors: {
    friends: null,
    search: null,
    semanticSearch: null,
    sendRequest: null,
    recommendations: null,
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

export const semanticSearchUsers = createAsyncThunk(
  'friends/semanticSearchUsers',
  async ({ query, limit = 20 }: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      if (!query.trim()) return [];
      const results = await friendsAPI.searchUsersSemantic(query, limit);
      return results;
    } catch (error) {
      return rejectWithValue('Search unavailable, try again');
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'friends/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const recommendations = await friendsAPI.getRecommendations();
      return recommendations;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch recommendations');
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
    clearSemanticResults: (state) => {
      state.semanticResults = [];
    },
    setSelectedTab: (state, action: PayloadAction<'friends' | 'requests' | 'search' | 'recommended'>) => {
      state.ui.selectedTab = action.payload;
    },
    setSearchMode: (state, action: PayloadAction<'regular' | 'semantic'>) => {
      state.ui.searchMode = action.payload;
      state.ui.searchTerm = '';
      state.searchResults = [];
      state.semanticResults = [];
    },
    updateSearchResultStatus: (state, action: PayloadAction<{ userId: string; status: UserSearchResult['friendship_status'] }>) => {
      const { userId, status } = action.payload;
      const result = state.searchResults.find(r => r.id === userId);
      if (result) {
        result.friendship_status = status;
      }
      // Also remove from semantic results since backend pre-filters connected users
      state.semanticResults = state.semanticResults.filter(r => r.id !== userId);
    },
    clearErrors: (state) => {
      state.errors = {
        friends: null,
        search: null,
        semanticSearch: null,
        sendRequest: null,
        recommendations: null,
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

    // Semantic Search Users
    builder
      .addCase(semanticSearchUsers.pending, (state) => {
        state.loading.semanticSearch = true;
        state.errors.semanticSearch = null;
      })
      .addCase(semanticSearchUsers.fulfilled, (state, action) => {
        state.loading.semanticSearch = false;
        state.semanticResults = action.payload;
      })
      .addCase(semanticSearchUsers.rejected, (state, action) => {
        state.loading.semanticSearch = false;
        state.errors.semanticSearch = action.payload as string;
      });

    // Fetch Recommendations
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading.recommendations = true;
        state.errors.recommendations = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading.recommendations = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading.recommendations = false;
        state.errors.recommendations = action.payload as string;
      });
  },
});

export const {
  setSearchTerm,
  clearSearchResults,
  clearSemanticResults,
  setSelectedTab,
  setSearchMode,
  updateSearchResultStatus,
  clearErrors,
} = friendsSlice.actions;

export default friendsSlice.reducer;
