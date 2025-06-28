import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import friendsAPI from '../../apis/friendsAPI';
import { FriendRequest, FriendRequestsResponse } from '../../types/friends';
import { invalidateCache } from '../../utils/cacheUtils';

interface FriendRequestsState {
  received: FriendRequest[];
  sent: FriendRequest[];
  loading: {
    fetch: boolean;
    respond: Record<string, boolean>; // requestId -> loading state
  };
  errors: {
    fetch: string | null;
    respond: Record<string, string>; // requestId -> error message
  };
  ui: {
    activeTab: 'received' | 'sent';
  };
}

const initialState: FriendRequestsState = {
  received: [],
  sent: [],
  loading: {
    fetch: false,
    respond: {},
  },
  errors: {
    fetch: null,
    respond: {},
  },
  ui: {
    activeTab: 'received',
  },
};

// Async Thunks
export const fetchFriendRequests = createAsyncThunk(
  'friendRequests/fetchFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const requests = await friendsAPI.getFriendRequests();
      return requests;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch friend requests');
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friendRequests/acceptFriendRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const result = await friendsAPI.acceptFriendRequest(requestId);
      
      // Invalidate all friend-related caches since accepting creates a friendship
      invalidateCache.friends();
      invalidateCache.friendRequests();
      invalidateCache.userSearch();
      invalidateCache.userProfiles();
      
      return { requestId, ...result };
    } catch (error) {
      return rejectWithValue({ 
        requestId, 
        error: error instanceof Error ? error.message : 'Failed to accept friend request' 
      });
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'friendRequests/rejectFriendRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const result = await friendsAPI.rejectFriendRequest(requestId);
      
      // Invalidate relevant caches
      invalidateCache.friendRequests();
      invalidateCache.userSearch();
      
      return { requestId, ...result };
    } catch (error) {
      return rejectWithValue({ 
        requestId, 
        error: error instanceof Error ? error.message : 'Failed to reject friend request' 
      });
    }
  }
);

export const cancelFriendRequest = createAsyncThunk(
  'friendRequests/cancelFriendRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const result = await friendsAPI.cancelFriendRequest(requestId);
      
      // Invalidate relevant caches
      invalidateCache.friendRequests();
      invalidateCache.userSearch();
      
      return { requestId, ...result };
    } catch (error) {
      return rejectWithValue({ 
        requestId, 
        error: error instanceof Error ? error.message : 'Failed to cancel friend request' 
      });
    }
  }
);

const friendRequestsSlice = createSlice({
  name: 'friendRequests',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'received' | 'sent'>) => {
      state.ui.activeTab = action.payload;
    },
    clearErrors: (state) => {
      state.errors.fetch = null;
      state.errors.respond = {};
    },
    clearRequestError: (state, action: PayloadAction<string>) => {
      delete state.errors.respond[action.payload];
    },
  },
  extraReducers: (builder) => {
    // Fetch Friend Requests
    builder
      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.received = action.payload.received;
        state.sent = action.payload.sent;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload as string;
      });

    // Accept Friend Request
    builder
      .addCase(acceptFriendRequest.pending, (state, action) => {
        state.loading.respond[action.meta.arg] = true;
        delete state.errors.respond[action.meta.arg];
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        state.loading.respond[requestId] = false;
        // Remove from received requests
        state.received = state.received.filter(req => req.id !== requestId);
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        const { requestId, error } = action.payload as { requestId: string; error: string };
        state.loading.respond[requestId] = false;
        state.errors.respond[requestId] = error;
      });

    // Reject Friend Request
    builder
      .addCase(rejectFriendRequest.pending, (state, action) => {
        state.loading.respond[action.meta.arg] = true;
        delete state.errors.respond[action.meta.arg];
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        state.loading.respond[requestId] = false;
        // Remove from received requests
        state.received = state.received.filter(req => req.id !== requestId);
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        const { requestId, error } = action.payload as { requestId: string; error: string };
        state.loading.respond[requestId] = false;
        state.errors.respond[requestId] = error;
      });

    // Cancel Friend Request
    builder
      .addCase(cancelFriendRequest.pending, (state, action) => {
        state.loading.respond[action.meta.arg] = true;
        delete state.errors.respond[action.meta.arg];
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        state.loading.respond[requestId] = false;
        // Remove from sent requests
        state.sent = state.sent.filter(req => req.id !== requestId);
      })
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        const { requestId, error } = action.payload as { requestId: string; error: string };
        state.loading.respond[requestId] = false;
        state.errors.respond[requestId] = error;
      });
  },
});

export const {
  setActiveTab,
  clearErrors,
  clearRequestError,
} = friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;
