import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchNearbyEventsByLocation as fetchEventsAPI } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { 
  PaginatedResponse, 
  LocationEventsApiParams 
} from "../../types/Pagination";
import type { RootState } from "../store";
import { 
  createCacheKey, 
  getCachedData, 
  PaginatedCacheData, 
  CACHE_TTL,
  prefetchPage 
} from "../../utils/cacheUtils";

interface NearbyEventsState {
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
  // Location state
  lastCity: string | null;
  lastState: string | null;
}

const initialState: NearbyEventsState = {
  events: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 12,
  totalCount: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  lastCity: null,
  lastState: null,
};

export const fetchNearbyEventsByLocation = createAsyncThunk<
  Omit<PaginatedResponse<Event>, 'items'> & { events: Event[] },
  LocationEventsApiParams,
  { state: RootState; rejectValue: string }
>("nearbyEvents/fetchByLocation", async (params, { rejectWithValue }) => {
  const requestParams = {
    city: params.city,
    state: params.state,
    page: params.page || 1,
    page_size: params.page_size || 12,
  };

  try {
    // Create cache key
    const cacheKey = createCacheKey.nearbyEvents(
      requestParams.city,
      requestParams.state,
      requestParams.page,
      requestParams.page_size
    );
    
    // Use cached data with API fallback
    const cachedData = await getCachedData<Event>(
      cacheKey,
      async () => {
        const response = await fetchEventsAPI(requestParams) as PaginatedResponse<Event>;
        
        return {
          items: response.items,
          totalCount: response.total_count,
          totalPages: response.total_pages,
          page: response.page,
          pageSize: response.page_size,
          hasNext: response.has_next,
          hasPrevious: response.has_previous,
        };
      },
      CACHE_TTL.NEARBY_EVENTS
    );
    
    // Prefetch next page if available
    if (cachedData.hasNext) {
      const nextPageParams = { ...requestParams, page: requestParams.page + 1 };
      const nextPageCacheKey = createCacheKey.nearbyEvents(
        nextPageParams.city,
        nextPageParams.state,
        nextPageParams.page,
        nextPageParams.page_size
      );
      
      prefetchPage<Event>(
        nextPageCacheKey,
        async () => {
          const response = await fetchEventsAPI(nextPageParams) as PaginatedResponse<Event>;
          return {
            items: response.items,
            totalCount: response.total_count,
            totalPages: response.total_pages,
            page: response.page,
            pageSize: response.page_size,
            hasNext: response.has_next,
            hasPrevious: response.has_previous,
          };
        },
        CACHE_TTL.NEARBY_EVENTS
      );
    }
    
    return {
      events: cachedData.items,
      total_count: cachedData.totalCount,
      page: cachedData.page,
      page_size: cachedData.pageSize,
      total_pages: cachedData.totalPages,
      has_next: cachedData.hasNext,
      has_previous: cachedData.hasPrevious,
    };
  } catch (error) {
    return rejectWithValue("Failed to fetch nearby events");
  }
});

const nearbyEventsSlice = createSlice({
  name: "nearbyEvents",
  initialState,
  reducers: {
    resetNearbyEvents: (state) => {
      Object.assign(state, initialState);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyEventsByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyEventsByLocation.fulfilled, (state, action) => {
        state.events = action.payload.events;
        
        // Update location state
        if (action.meta.arg.city) {
          state.lastCity = action.meta.arg.city;
        }
        if (action.meta.arg.state) {
          state.lastState = action.meta.arg.state;
        }
        
        // Update pagination state
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.page_size;
        state.totalCount = action.payload.total_count;
        state.totalPages = action.payload.total_pages;
        state.hasNext = action.payload.has_next;
        state.hasPrevious = action.payload.has_previous;
        
        state.loading = false;
      })
      .addCase(fetchNearbyEventsByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch nearby events";
      });
  },
});

export const { resetNearbyEvents, setPage, setPageSize } = nearbyEventsSlice.actions;
export default nearbyEventsSlice.reducer;
