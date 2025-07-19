import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCreatedEventsWithCursor,
  fetchRSVPedEventsWithCursor,
  fetchOrganizedEventsWithCursor,
  fetchModeratedEventsWithCursor,
} from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { 
  CursorPaginatedResponse, 
  CursorPaginationParams,
  PaginatedResponse 
} from "../../types/Pagination";
import type { RootState } from "../store";

// State interface for each event type
interface UserEventState {
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
}

interface UserEventsState {
  created: UserEventState;
  rsvped: UserEventState;
  organized: UserEventState;
  moderated: UserEventState;
}

const defaultEventState: UserEventState = {
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
};

const initialState: UserEventsState = {
  created: { ...defaultEventState },
  rsvped: { ...defaultEventState },
  organized: { ...defaultEventState },
  moderated: { ...defaultEventState },
};

// Created Events Actions
export const fetchInitialCreatedEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  CursorPaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchInitialCreated", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchCreatedEventsWithCursor({
      page_size: params.page_size || 12,
      cursor: undefined, // No cursor for initial load
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to fetch created events");
  }
});

export const loadMoreCreatedEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  { cursor: string; pageSize?: number },
  { state: RootState; rejectValue: string }
>("userEvents/loadMoreCreated", async ({ cursor, pageSize = 12 }, { rejectWithValue }) => {
  try {
    const response = await fetchCreatedEventsWithCursor({
      cursor,
      page_size: pageSize,
      direction: 'next',
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to load more created events");
  }
});

// RSVP Events Actions
export const fetchInitialRsvpEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  CursorPaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchInitialRsvp", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchRSVPedEventsWithCursor({
      page_size: params.page_size || 12,
      cursor: undefined, // No cursor for initial load
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to fetch RSVP events");
  }
});

export const loadMoreRsvpEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  { cursor: string; pageSize?: number },
  { state: RootState; rejectValue: string }
>("userEvents/loadMoreRsvp", async ({ cursor, pageSize = 12 }, { rejectWithValue }) => {
  try {
    const response = await fetchRSVPedEventsWithCursor({
      cursor,
      page_size: pageSize,
      direction: 'next',
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to load more RSVP events");
  }
});

// Organized Events Actions
export const fetchInitialOrganizedEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  CursorPaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchInitialOrganized", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchOrganizedEventsWithCursor({
      page_size: params.page_size || 12,
      cursor: undefined, // No cursor for initial load
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to fetch organized events");
  }
});

export const loadMoreOrganizedEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  { cursor: string; pageSize?: number },
  { state: RootState; rejectValue: string }
>("userEvents/loadMoreOrganized", async ({ cursor, pageSize = 12 }, { rejectWithValue }) => {
  try {
    const response = await fetchOrganizedEventsWithCursor({
      cursor,
      page_size: pageSize,
      direction: 'next',
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to load more organized events");
  }
});

// Moderated Events Actions
export const fetchInitialModeratedEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  CursorPaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchInitialModerated", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchModeratedEventsWithCursor({
      page_size: params.page_size || 12,
      cursor: undefined,
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to fetch moderated events");
  }
});

export const loadMoreModeratedEvents = createAsyncThunk<
  CursorPaginatedResponse<Event>,
  { cursor: string; pageSize?: number },
  { state: RootState; rejectValue: string }
>("userEvents/loadMoreModerated", async ({ cursor, pageSize = 12 }, { rejectWithValue }) => {
  try {
    const response = await fetchModeratedEventsWithCursor({
      cursor,
      page_size: pageSize,
      direction: 'next',
    });
    return response;
  } catch (error) {
    return rejectWithValue("Failed to load more moderated events");
  }
});

const userEventsSlice = createSlice({
  name: "cursorUserEvents",
  initialState,
  reducers: {
    // Reset all states
    resetUserEvents: (state) => {
      Object.assign(state, initialState);
    },
    
    // Reset specific event type
    resetCreatedEvents: (state) => {
      state.created = { ...defaultEventState };
    },
    resetRSVPedEvents: (state) => {
      state.rsvped = { ...defaultEventState };
    },
    resetOrganizedEvents: (state) => {
      state.organized = { ...defaultEventState };
    },
    resetModeratedEvents: (state) => {
      state.moderated = { ...defaultEventState };
    },
    
    // Update page size
    setCreatedPageSize: (state, action: PayloadAction<number>) => {
      state.created.pageSize = action.payload;
    },
    setRSVPedPageSize: (state, action: PayloadAction<number>) => {
      state.rsvped.pageSize = action.payload;
    },
    setOrganizedPageSize: (state, action: PayloadAction<number>) => {
      state.organized.pageSize = action.payload;
    },
    setModeratedPageSize: (state, action: PayloadAction<number>) => {
      state.moderated.pageSize = action.payload;
    },
    
    // Remove RSVP'd event (when user cancels RSVP)
    removeRSVPedEvent: (state, action: PayloadAction<string>) => {
      state.rsvped.events = state.rsvped.events.filter(event => event.eventId !== action.payload);
      if (state.rsvped.totalCount) {
        state.rsvped.totalCount = Math.max(0, state.rsvped.totalCount - 1);
      }
    },
    
    // Add newly created event to created events list
    addCreatedEventLocal: (state, action: PayloadAction<Event>) => {
      state.created.events.unshift(action.payload);
      if (state.created.totalCount) {
        state.created.totalCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Created Events
      .addCase(fetchInitialCreatedEvents.pending, (state) => {
        state.created.loading = true;
        state.created.error = null;
      })
      .addCase(fetchInitialCreatedEvents.fulfilled, (state, action) => {
        state.created.loading = false;
        state.created.hasFetched = true;
        state.created.events = action.payload.items;
        state.created.nextCursor = action.payload.pagination.next_cursor;
        state.created.prevCursor = action.payload.pagination.prev_cursor;
        state.created.hasNext = action.payload.pagination.has_next;
        state.created.hasPrevious = action.payload.pagination.has_previous;
        state.created.pageSize = action.payload.pagination.page_size;
        state.created.totalCount = action.payload.pagination.total_count;
      })
      .addCase(fetchInitialCreatedEvents.rejected, (state, action) => {
        state.created.loading = false;
        state.created.error = action.payload || "Failed to fetch created events";
      })
      .addCase(loadMoreCreatedEvents.pending, (state) => {
        state.created.loadingMore = true;
        state.created.error = null;
      })
      .addCase(loadMoreCreatedEvents.fulfilled, (state, action) => {
        state.created.loadingMore = false;
        state.created.events = [...state.created.events, ...action.payload.items];
        state.created.nextCursor = action.payload.pagination.next_cursor;
        state.created.prevCursor = action.payload.pagination.prev_cursor;
        state.created.hasNext = action.payload.pagination.has_next;
        state.created.hasPrevious = action.payload.pagination.has_previous;
        state.created.totalCount = action.payload.pagination.total_count;
      })
      .addCase(loadMoreCreatedEvents.rejected, (state, action) => {
        state.created.loadingMore = false;
        state.created.error = action.payload || "Failed to load more created events";
      })
      
      // RSVP'd Events
      .addCase(fetchInitialRsvpEvents.pending, (state) => {
        state.rsvped.loading = true;
        state.rsvped.error = null;
      })
      .addCase(fetchInitialRsvpEvents.fulfilled, (state, action) => {
        state.rsvped.loading = false;
        state.rsvped.hasFetched = true;
        state.rsvped.events = action.payload.items;
        state.rsvped.nextCursor = action.payload.pagination.next_cursor;
        state.rsvped.prevCursor = action.payload.pagination.prev_cursor;
        state.rsvped.hasNext = action.payload.pagination.has_next;
        state.rsvped.hasPrevious = action.payload.pagination.has_previous;
        state.rsvped.pageSize = action.payload.pagination.page_size;
        state.rsvped.totalCount = action.payload.pagination.total_count;
      })
      .addCase(fetchInitialRsvpEvents.rejected, (state, action) => {
        state.rsvped.loading = false;
        state.rsvped.error = action.payload || "Failed to fetch RSVP'd events";
      })
      .addCase(loadMoreRsvpEvents.pending, (state) => {
        state.rsvped.loadingMore = true;
        state.rsvped.error = null;
      })
      .addCase(loadMoreRsvpEvents.fulfilled, (state, action) => {
        state.rsvped.loadingMore = false;
        state.rsvped.events = [...state.rsvped.events, ...action.payload.items];
        state.rsvped.nextCursor = action.payload.pagination.next_cursor;
        state.rsvped.prevCursor = action.payload.pagination.prev_cursor;
        state.rsvped.hasNext = action.payload.pagination.has_next;
        state.rsvped.hasPrevious = action.payload.pagination.has_previous;
        state.rsvped.totalCount = action.payload.pagination.total_count;
      })
      .addCase(loadMoreRsvpEvents.rejected, (state, action) => {
        state.rsvped.loadingMore = false;
        state.rsvped.error = action.payload || "Failed to load more RSVP'd events";
      })
      
      // Organized Events
      .addCase(fetchInitialOrganizedEvents.pending, (state) => {
        state.organized.loading = true;
        state.organized.error = null;
      })
      .addCase(fetchInitialOrganizedEvents.fulfilled, (state, action) => {
        state.organized.loading = false;
        state.organized.hasFetched = true;
        state.organized.events = action.payload.items;
        state.organized.nextCursor = action.payload.pagination.next_cursor;
        state.organized.prevCursor = action.payload.pagination.prev_cursor;
        state.organized.hasNext = action.payload.pagination.has_next;
        state.organized.hasPrevious = action.payload.pagination.has_previous;
        state.organized.pageSize = action.payload.pagination.page_size;
        state.organized.totalCount = action.payload.pagination.total_count;
      })
      .addCase(fetchInitialOrganizedEvents.rejected, (state, action) => {
        state.organized.loading = false;
        state.organized.error = action.payload || "Failed to fetch organized events";
      })
      .addCase(loadMoreOrganizedEvents.pending, (state) => {
        state.organized.loadingMore = true;
        state.organized.error = null;
      })
      .addCase(loadMoreOrganizedEvents.fulfilled, (state, action) => {
        state.organized.loadingMore = false;
        state.organized.events = [...state.organized.events, ...action.payload.items];
        state.organized.nextCursor = action.payload.pagination.next_cursor;
        state.organized.prevCursor = action.payload.pagination.prev_cursor;
        state.organized.hasNext = action.payload.pagination.has_next;
        state.organized.hasPrevious = action.payload.pagination.has_previous;
        state.organized.totalCount = action.payload.pagination.total_count;
      })
      .addCase(loadMoreOrganizedEvents.rejected, (state, action) => {
        state.organized.loadingMore = false;
        state.organized.error = action.payload || "Failed to load more organized events";
      })
      
      // Moderated Events
      .addCase(fetchInitialModeratedEvents.pending, (state) => {
        state.moderated.loading = true;
        state.moderated.error = null;
      })
      .addCase(fetchInitialModeratedEvents.fulfilled, (state, action) => {
        state.moderated.loading = false;
        state.moderated.hasFetched = true;
        state.moderated.events = action.payload.items;
        state.moderated.nextCursor = action.payload.pagination.next_cursor;
        state.moderated.prevCursor = action.payload.pagination.prev_cursor;
        state.moderated.hasNext = action.payload.pagination.has_next;
        state.moderated.hasPrevious = action.payload.pagination.has_previous;
        state.moderated.pageSize = action.payload.pagination.page_size;
        state.moderated.totalCount = action.payload.pagination.total_count;
      })
      .addCase(fetchInitialModeratedEvents.rejected, (state, action) => {
        state.moderated.loading = false;
        state.moderated.error = action.payload || "Failed to fetch moderated events";
      })
      .addCase(loadMoreModeratedEvents.pending, (state) => {
        state.moderated.loadingMore = true;
        state.moderated.error = null;
      })
      .addCase(loadMoreModeratedEvents.fulfilled, (state, action) => {
        state.moderated.loadingMore = false;
        state.moderated.events = [...state.moderated.events, ...action.payload.items];
        state.moderated.nextCursor = action.payload.pagination.next_cursor;
        state.moderated.prevCursor = action.payload.pagination.prev_cursor;
        state.moderated.hasNext = action.payload.pagination.has_next;
        state.moderated.hasPrevious = action.payload.pagination.has_previous;
        state.moderated.totalCount = action.payload.pagination.total_count;
      })
      .addCase(loadMoreModeratedEvents.rejected, (state, action) => {
        state.moderated.loadingMore = false;
        state.moderated.error = action.payload || "Failed to load more moderated events";
      });
  },
});

export const {
  resetUserEvents,
  resetCreatedEvents,
  resetRSVPedEvents,
  resetOrganizedEvents,
  resetModeratedEvents,
  setCreatedPageSize,
  setRSVPedPageSize,
  setOrganizedPageSize,
  setModeratedPageSize,
  removeRSVPedEvent,
  addCreatedEventLocal,
} = userEventsSlice.actions;

export default userEventsSlice.reducer;
