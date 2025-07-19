import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchNearbyEventsByLocationWithCursor } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { 
  CursorPaginatedResponse, 
  CursorLocationEventsApiParams 
} from "../../types/Pagination";
import type { RootState } from "../store";

interface NearbyEventsState {
  events: Event[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  nextCursor?: string;
  prevCursor?: string;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount?: number;
  hasFetched: boolean;
  // Location state
  lastCity: string | null;
  lastState: string | null;
}

const initialState: NearbyEventsState = {
  events: [],
  loading: false,
  loadingMore: false,
  error: null,
  nextCursor: undefined,
  prevCursor: undefined,
  hasNext: false,
  hasPrevious: false,
  pageSize: 12,
  totalCount: undefined,
  hasFetched: false,
  lastCity: null,
  lastState: null,
};

// Initial fetch for nearby events
export const fetchInitialNearbyEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  CursorLocationEventsApiParams,
  { state: RootState; rejectValue: string }
>("nearbyEvents/fetchInitial", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchNearbyEventsByLocationWithCursor({
      city: params.city,
      state: params.state,
      page_size: params.page_size || 12,
      cursor: undefined, // No cursor for initial load
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to fetch nearby events");
  }
});

// Load more nearby events
export const loadMoreNearbyEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  { cursor: string; city: string; state: string; pageSize?: number },
  { state: RootState; rejectValue: string }
>("nearbyEvents/loadMore", async ({ cursor, city, state, pageSize = 12 }, { rejectWithValue }) => {
  try {
    const response = await fetchNearbyEventsByLocationWithCursor({
      city,
      state,
      cursor,
      page_size: pageSize,
      direction: 'next',
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to load more nearby events");
  }
});

// Refresh nearby events for a location
export const refreshNearbyEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  { city: string; state: string; pageSize?: number },
  { state: RootState; rejectValue: string }
>("nearbyEvents/refresh", async ({ city, state, pageSize = 12 }, { rejectWithValue }) => {
  try {
    const response = await fetchNearbyEventsByLocationWithCursor({
      city,
      state,
      page_size: pageSize,
      cursor: undefined, // No cursor for refresh
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to refresh nearby events");
  }
});

const nearbyEventsSlice = createSlice({
  name: "nearbyEvents",
  initialState,
  reducers: {
    // Reset state
    resetNearbyEvents: (state) => {
      Object.assign(state, initialState);
    },
    
    // Update page size
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    
    // Update location
    setLocation: (state, action: PayloadAction<{ city: string; state: string }>) => {
      state.lastCity = action.payload.city;
      state.lastState = action.payload.state;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial fetch
      .addCase(fetchInitialNearbyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialNearbyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.events = action.payload.items;
        state.nextCursor = action.payload.pagination.next_cursor;
        state.prevCursor = action.payload.pagination.prev_cursor;
        state.hasNext = action.payload.pagination.has_next;
        state.hasPrevious = action.payload.pagination.has_previous;
        state.pageSize = action.payload.pagination.page_size;
        state.totalCount = action.payload.pagination.total_count;
      })
      .addCase(fetchInitialNearbyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch nearby events";
      })
      
      // Load more
      .addCase(loadMoreNearbyEvents.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreNearbyEvents.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.events = [...state.events, ...action.payload.items];
        state.nextCursor = action.payload.pagination.next_cursor;
        state.prevCursor = action.payload.pagination.prev_cursor;
        state.hasNext = action.payload.pagination.has_next;
        state.hasPrevious = action.payload.pagination.has_previous;
        state.totalCount = action.payload.pagination.total_count;
      })
      .addCase(loadMoreNearbyEvents.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload || "Failed to load more nearby events";
      })
      
      // Refresh
      .addCase(refreshNearbyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshNearbyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.events = action.payload.items;
        state.nextCursor = action.payload.pagination.next_cursor;
        state.prevCursor = action.payload.pagination.prev_cursor;
        state.hasNext = action.payload.pagination.has_next;
        state.hasPrevious = action.payload.pagination.has_previous;
        state.pageSize = action.payload.pagination.page_size;
        state.totalCount = action.payload.pagination.total_count;
      })
      .addCase(refreshNearbyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to refresh nearby events";
      });
  },
});

export const {
  resetNearbyEvents,
  setPageSize,
  setLocation,
  clearError,
} = nearbyEventsSlice.actions;

export default nearbyEventsSlice.reducer;
