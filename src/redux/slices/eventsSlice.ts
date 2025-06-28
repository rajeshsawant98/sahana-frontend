import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllPublicEvents as fetchPublicEventsAPI } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { 
  PaginatedResponse, 
  LegacyEventsResponse, 
  EventsApiParams, 
  EventFilters 
} from "../../types/Pagination";
import type { RootState } from "../store";

// Helper function to determine if response is paginated
const isPaginatedResponse = (
  response: PaginatedResponse<Event> | LegacyEventsResponse
): response is PaginatedResponse<Event> => {
  return 'items' in response;
};

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  // Pagination state
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  // Filters state
  filters: EventFilters;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 12,
  totalCount: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  filters: {},
};

export const fetchEvents = createAsyncThunk<
  { events: Event[]; pagination?: Omit<PaginatedResponse<Event>, 'items'> },
  EventsApiParams,
  { state: RootState; rejectValue: string }
>("events/fetchEvents", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchPublicEventsAPI(params);
    
    if (isPaginatedResponse(response)) {
      return {
        events: response.items,
        pagination: {
          total_count: response.total_count,
          page: response.page,
          page_size: response.page_size,
          total_pages: response.total_pages,
          has_next: response.has_next,
          has_previous: response.has_previous,
        },
      };
    } else {
      return { events: response.events || response };
    }
  } catch (error) {
    return rejectWithValue("Failed to fetch events");
  }
});

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event.eventId !== action.payload
      );
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
    setFilters: (state, action: PayloadAction<EventFilters>) => {
      state.filters = action.payload;
      state.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1; // Reset to first page when clearing filters
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload.events;
        state.loading = false;
        
        if (action.payload.pagination) {
          // Paginated response
          state.currentPage = action.payload.pagination.page;
          state.pageSize = action.payload.pagination.page_size;
          state.totalCount = action.payload.pagination.total_count;
          state.totalPages = action.payload.pagination.total_pages;
          state.hasNext = action.payload.pagination.has_next;
          state.hasPrevious = action.payload.pagination.has_previous;
        } else {
          // Legacy response - treat as single page
          state.totalCount = action.payload.events.length;
          state.totalPages = 1;
          state.hasNext = false;
          state.hasPrevious = false;
        }
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch events";
      });
  },
});

export const { addEvent, removeEvent, setPage, setPageSize, setFilters, clearFilters } = eventsSlice.actions;
export default eventsSlice.reducer;
