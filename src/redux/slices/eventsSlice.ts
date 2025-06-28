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
import { 
  createCacheKey, 
  getCachedData, 
  PaginatedCacheData, 
  CACHE_TTL,
  prefetchPage 
} from "../../utils/cacheUtils";

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
    // Create cache key
    const cacheKey = createCacheKey.events(
      params.page || 1, 
      params.page_size || 12, 
      params
    );
    
    // Use cached data with API fallback
    const cachedData = await getCachedData<Event>(
      cacheKey,
      async () => {
        const response = await fetchPublicEventsAPI(params);
        
        if (isPaginatedResponse(response)) {
          return {
            items: response.items,
            totalCount: response.total_count,
            totalPages: response.total_pages,
            page: response.page,
            pageSize: response.page_size,
            hasNext: response.has_next,
            hasPrevious: response.has_previous,
          };
        } else {
          return {
            items: response.events || response,
            totalCount: (response.events || response).length,
            totalPages: 1,
            page: 1,
            pageSize: (response.events || response).length,
            hasNext: false,
            hasPrevious: false,
          };
        }
      },
      CACHE_TTL.EVENTS
    );
    
    // Prefetch next page if available
    if (cachedData.hasNext) {
      const nextPageParams = { ...params, page: (params.page || 1) + 1 };
      const nextPageCacheKey = createCacheKey.events(
        nextPageParams.page || 1,
        nextPageParams.page_size || 12,
        nextPageParams
      );
      
      prefetchPage<Event>(
        nextPageCacheKey,
        async () => {
          const response = await fetchPublicEventsAPI(nextPageParams);
          if (isPaginatedResponse(response)) {
            return {
              items: response.items,
              totalCount: response.total_count,
              totalPages: response.total_pages,
              page: response.page,
              pageSize: response.page_size,
              hasNext: response.has_next,
              hasPrevious: response.has_previous,
            };
          } else {
            return {
              items: response.events || response,
              totalCount: (response.events || response).length,
              totalPages: 1,
              page: 1,
              pageSize: (response.events || response).length,
              hasNext: false,
              hasPrevious: false,
            };
          }
        },
        CACHE_TTL.EVENTS
      );
    }
    
    if (cachedData.totalPages > 1) {
      return {
        events: cachedData.items,
        pagination: {
          total_count: cachedData.totalCount,
          page: cachedData.page,
          page_size: cachedData.pageSize,
          total_pages: cachedData.totalPages,
          has_next: cachedData.hasNext,
          has_previous: cachedData.hasPrevious,
        },
      };
    } else {
      return { events: cachedData.items };
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
