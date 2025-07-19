import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllPublicEventsWithCursor } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { 
  CursorPaginatedResponse, 
  CursorEventsApiParams,
  EventFilters
} from "../../types/Pagination";
import type { RootState } from "../store";

// State interface for cursor-based pagination
interface EventsState {
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
  filters: EventFilters;
  isInitialLoad: boolean;
}

const initialState: EventsState = {
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
  filters: {},
  isInitialLoad: true,
};

// Fetch initial events (first page)
export const fetchInitialEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  CursorEventsApiParams,
  { state: RootState; rejectValue: string }
>("events/fetchInitial", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchAllPublicEventsWithCursor({
      page_size: params.page_size || 12,
      ...params,
      cursor: undefined, // No cursor for initial load
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to fetch events");
  }
});

// Load more events (append to existing list)
export const loadMoreEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  { cursor: string; pageSize?: number; filters?: EventFilters },
  { state: RootState; rejectValue: string }
>("events/loadMore", async ({ cursor, pageSize = 12, filters = {} }, { rejectWithValue }) => {
  try {
    const response = await fetchAllPublicEventsWithCursor({
      cursor,
      page_size: pageSize,
      direction: 'next',
      ...filters,
    });
    
    return response;
  } catch (error) {
    return rejectWithValue("Failed to load more events");
  }
});

// Refresh events (replace current list)
export const refreshEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  CursorEventsApiParams,
  { state: RootState; rejectValue: string }
>("events/refresh", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchAllPublicEventsWithCursor({
      page_size: params.page_size || 12,
      ...params,
      cursor: undefined, // No cursor for refresh
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to refresh events");
  }
});

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // Reset state
    resetEvents: (state) => {
      Object.assign(state, initialState);
    },
    
    // Update filters
    setFilters: (state, action: PayloadAction<EventFilters>) => {
      state.filters = action.payload;
    },
    
    // Update page size
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Add new event to the list (for real-time updates)
    addEvent: (state, action: PayloadAction<Event>) => {
      // Insert at the beginning for chronological order (earliest first)
      state.events.unshift(action.payload);
      if (state.totalCount) {
        state.totalCount += 1;
      }
    },
    
    // Remove event from the list
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.eventId !== action.payload);
      if (state.totalCount) {
        state.totalCount = Math.max(0, state.totalCount - 1);
      }
    },
    
    // Update event in the list
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.eventId === action.payload.eventId);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch initial events
      .addCase(fetchInitialEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isInitialLoad = true;
      })
      .addCase(fetchInitialEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialLoad = false;
        state.events = action.payload.items;
        state.nextCursor = action.payload.pagination.next_cursor;
        state.prevCursor = action.payload.pagination.prev_cursor;
        state.hasNext = action.payload.pagination.has_next;
        state.hasPrevious = action.payload.pagination.has_previous;
        state.pageSize = action.payload.pagination.page_size;
        state.totalCount = action.payload.pagination.total_count;
      })
      .addCase(fetchInitialEvents.rejected, (state, action) => {
        state.loading = false;
        state.isInitialLoad = false;
        state.error = action.payload || "Failed to fetch events";
      })
      
      // Load more events
      .addCase(loadMoreEvents.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreEvents.fulfilled, (state, action) => {
        state.loadingMore = false;
        
        const newEvents = action.payload.items;
        const pagination = action.payload.pagination;
        
        // Add new events, avoiding duplicates
        const existingIds = new Set(state.events.map(event => event.eventId));
        const uniqueNewEvents = newEvents.filter(event => !existingIds.has(event.eventId));
        
        // Append new events to existing list
        state.events = [...state.events, ...uniqueNewEvents];
        state.nextCursor = pagination.next_cursor;
        state.prevCursor = pagination.prev_cursor;
        state.hasNext = pagination.has_next;
        state.hasPrevious = pagination.has_previous;
        state.totalCount = pagination.total_count;
      })
      .addCase(loadMoreEvents.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload || "Failed to load more events";
      })
      
      // Refresh events
      .addCase(refreshEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshEvents.fulfilled, (state, action) => {
        state.loading = false;
        // Replace current events with refreshed list
        state.events = action.payload.items;
        state.nextCursor = action.payload.pagination.next_cursor;
        state.prevCursor = action.payload.pagination.prev_cursor;
        state.hasNext = action.payload.pagination.has_next;
        state.hasPrevious = action.payload.pagination.has_previous;
        state.pageSize = action.payload.pagination.page_size;
        state.totalCount = action.payload.pagination.total_count;
      })
      .addCase(refreshEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to refresh events";
      });
  },
});

export const {
  resetEvents,
  setFilters,
  setPageSize,
  clearError,
  addEvent,
  removeEvent,
  updateEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;
