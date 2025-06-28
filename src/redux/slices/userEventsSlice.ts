import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCreatedEvents as fetchCreatedEventsAPI,
  fetchRSVPedEvents as fetchRSVPedEventsAPI,
  fetchOrganizedEvents as fetchOrganizedEventsAPI,
  fetchModeratedEvents as fetchModeratedEventsAPI,
  cancelRSVP as cancelRSVPAPI,
} from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { 
  PaginatedResponse, 
  LegacyEventsResponse, 
  PaginationParams 
} from "../../types/Pagination";
import type { RootState } from "../store";
import { 
  createCacheKey, 
  getCachedData, 
  PaginatedCacheData, 
  CACHE_TTL,
  prefetchPage,
  invalidateCache 
} from "../../utils/cacheUtils";

// Helper function to determine if response is paginated
const isPaginatedResponse = (
  response: PaginatedResponse<Event> | LegacyEventsResponse
): response is PaginatedResponse<Event> => {
  return 'items' in response;
};

interface UserEventsPaginationState {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface UserEventsState {
  createdEvents: Event[];
  rsvpedEvents: Event[];
  organizedEvents: Event[];
  moderatedEvents: Event[];
  loadingCreated: boolean;
  loadingRSVPed: boolean;
  loadingOrganized: boolean;
  loadingModerated: boolean;
  errorCreated: string | null;
  errorRSVPed: string | null;
  errorOrganized: string | null;
  errorModerated: string | null;
  hasFetchedRSVPed: boolean;
  hasFetchedOrganized: boolean;
  hasFetchedModerated: boolean;
  // Pagination states for each event type
  createdPagination: UserEventsPaginationState;
  rsvpedPagination: UserEventsPaginationState;
  organizedPagination: UserEventsPaginationState;
  moderatedPagination: UserEventsPaginationState;
}

const defaultPaginationState: UserEventsPaginationState = {
  currentPage: 1,
  pageSize: 12,
  totalCount: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
};

const initialState: UserEventsState = {
  createdEvents: [],
  rsvpedEvents: [],
  organizedEvents: [],
  moderatedEvents: [],
  loadingCreated: false,
  loadingRSVPed: false,
  loadingOrganized: false,
  loadingModerated: false,
  errorCreated: null,
  errorRSVPed: null,
  errorOrganized: null,
  errorModerated: null,
  hasFetchedRSVPed: false,
  hasFetchedOrganized: false,
  hasFetchedModerated: false,
  createdPagination: { ...defaultPaginationState },
  rsvpedPagination: { ...defaultPaginationState },
  organizedPagination: { ...defaultPaginationState },
  moderatedPagination: { ...defaultPaginationState },
};

// Async thunks
export const fetchCreatedEvents = createAsyncThunk<
  { events: Event[]; pagination?: Omit<PaginatedResponse<Event>, 'items'> },
  PaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchCreated", async (params, { rejectWithValue }) => {
  try {
    // Create cache key
    const cacheKey = createCacheKey.userCreatedEvents(
      params.page || 1,
      params.page_size || 12
    );
    
    // Use cached data with API fallback
    const cachedData = await getCachedData<Event>(
      cacheKey,
      async () => {
        const response = await fetchCreatedEventsAPI(params);
        
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
      CACHE_TTL.USER_EVENTS
    );
    
    // Prefetch next page if available
    if (cachedData.hasNext) {
      const nextPageParams = { ...params, page: (params.page || 1) + 1 };
      const nextPageCacheKey = createCacheKey.userCreatedEvents(
        nextPageParams.page || 1,
        nextPageParams.page_size || 12
      );
      
      prefetchPage<Event>(
        nextPageCacheKey,
        async () => {
          const response = await fetchCreatedEventsAPI(nextPageParams);
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
        CACHE_TTL.USER_EVENTS
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
    return rejectWithValue("Failed to fetch created events");
  }
});

export const fetchRSVPedEvents = createAsyncThunk<
  { events: Event[]; pagination?: Omit<PaginatedResponse<Event>, 'items'> },
  PaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchRSVPed", async (params, { rejectWithValue }) => {
  try {
    // Create cache key
    const cacheKey = createCacheKey.userRSVPedEvents(
      params.page || 1,
      params.page_size || 12
    );
    
    // Use cached data with API fallback
    const cachedData = await getCachedData<Event>(
      cacheKey,
      async () => {
        const response = await fetchRSVPedEventsAPI(params);
        
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
      CACHE_TTL.USER_EVENTS
    );
    
    // Prefetch next page if available
    if (cachedData.hasNext) {
      const nextPageParams = { ...params, page: (params.page || 1) + 1 };
      const nextPageCacheKey = createCacheKey.userRSVPedEvents(
        nextPageParams.page || 1,
        nextPageParams.page_size || 12
      );
      
      prefetchPage<Event>(
        nextPageCacheKey,
        async () => {
          const response = await fetchRSVPedEventsAPI(nextPageParams);
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
        CACHE_TTL.USER_EVENTS
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
    return rejectWithValue("Failed to fetch RSVP'd events");
  }
});

export const fetchOrganizedEvents = createAsyncThunk<
  { events: Event[]; pagination?: Omit<PaginatedResponse<Event>, 'items'> },
  PaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchOrganized", async (params, { rejectWithValue }) => {
  try {
    // Create cache key
    const cacheKey = createCacheKey.userOrganizedEvents(
      params.page || 1,
      params.page_size || 12
    );
    
    // Use cached data with API fallback
    const cachedData = await getCachedData<Event>(
      cacheKey,
      async () => {
        const response = await fetchOrganizedEventsAPI(params);
        
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
      CACHE_TTL.USER_EVENTS
    );
    
    // Prefetch next page if available
    if (cachedData.hasNext) {
      const nextPageParams = { ...params, page: (params.page || 1) + 1 };
      const nextPageCacheKey = createCacheKey.userOrganizedEvents(
        nextPageParams.page || 1,
        nextPageParams.page_size || 12
      );
      
      prefetchPage<Event>(
        nextPageCacheKey,
        async () => {
          const response = await fetchOrganizedEventsAPI(nextPageParams);
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
        CACHE_TTL.USER_EVENTS
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
    return rejectWithValue("Failed to fetch organized events");
  }
});

export const fetchModeratedEvents = createAsyncThunk<
  { events: Event[]; pagination?: Omit<PaginatedResponse<Event>, 'items'> },
  PaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchModerated", async (params, { rejectWithValue }) => {
  try {
    // Create cache key
    const cacheKey = createCacheKey.userModeratedEvents(
      params.page || 1,
      params.page_size || 12
    );
    
    // Use cached data with API fallback
    const cachedData = await getCachedData<Event>(
      cacheKey,
      async () => {
        const response = await fetchModeratedEventsAPI(params);
        
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
      CACHE_TTL.USER_EVENTS
    );
    
    // Prefetch next page if available
    if (cachedData.hasNext) {
      const nextPageParams = { ...params, page: (params.page || 1) + 1 };
      const nextPageCacheKey = createCacheKey.userModeratedEvents(
        nextPageParams.page || 1,
        nextPageParams.page_size || 12
      );
      
      prefetchPage<Event>(
        nextPageCacheKey,
        async () => {
          const response = await fetchModeratedEventsAPI(nextPageParams);
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
        CACHE_TTL.USER_EVENTS
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
    return rejectWithValue("Failed to fetch moderated events");
  }
});

export const cancelRSVP = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("userEvents/cancelRSVP", async (eventId, { rejectWithValue }) => {
  try {
    await cancelRSVPAPI(eventId);
    return eventId;
  } catch (error) {
    return rejectWithValue("Failed to cancel RSVP");
  }
});

const userEventsSlice = createSlice({
  name: "userEvents",
  initialState,
  reducers: {
    resetUserEvents: (state) => {
      Object.assign(state, initialState);
    },
    addRSVPedEvent: (state, action: PayloadAction<Event>) => {
      const exists = state.rsvpedEvents.some(event => event.eventId === action.payload.eventId);
      if (!exists) {
        state.rsvpedEvents.push(action.payload);
        state.rsvpedPagination.totalCount += 1;
      }
      // Invalidate RSVP cache
      invalidateCache.userEvents();
    },
    addCreatedEventLocal: (state, action: PayloadAction<Event>) => {
      const exists = state.createdEvents.some(event => event.eventId === action.payload.eventId);
      if (!exists) {
        state.createdEvents.push(action.payload);
        state.createdPagination.totalCount += 1;
      }
      // Invalidate created events cache
      invalidateCache.userEvents();
    },
    removeRSVPedEvent: (state, action: PayloadAction<string>) => {
      const index = state.rsvpedEvents.findIndex(event => event.eventId === action.payload);
      if (index !== -1) {
        state.rsvpedEvents.splice(index, 1);
        state.rsvpedPagination.totalCount = Math.max(0, state.rsvpedPagination.totalCount - 1);
      }
      // Invalidate RSVP cache
      invalidateCache.userEvents();
    },
    // Pagination actions
    setCreatedPage: (state, action: PayloadAction<number>) => {
      state.createdPagination.currentPage = action.payload;
    },
    setCreatedPageSize: (state, action: PayloadAction<number>) => {
      state.createdPagination.pageSize = action.payload;
      state.createdPagination.currentPage = 1;
    },
    setRSVPedPage: (state, action: PayloadAction<number>) => {
      state.rsvpedPagination.currentPage = action.payload;
    },
    setRSVPedPageSize: (state, action: PayloadAction<number>) => {
      state.rsvpedPagination.pageSize = action.payload;
      state.rsvpedPagination.currentPage = 1;
    },
    setOrganizedPage: (state, action: PayloadAction<number>) => {
      state.organizedPagination.currentPage = action.payload;
    },
    setOrganizedPageSize: (state, action: PayloadAction<number>) => {
      state.organizedPagination.pageSize = action.payload;
      state.organizedPagination.currentPage = 1;
    },
    setModeratedPage: (state, action: PayloadAction<number>) => {
      state.moderatedPagination.currentPage = action.payload;
    },
    setModeratedPageSize: (state, action: PayloadAction<number>) => {
      state.moderatedPagination.pageSize = action.payload;
      state.moderatedPagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Created events
      .addCase(fetchCreatedEvents.pending, (state) => {
        state.loadingCreated = true;
        state.errorCreated = null;
      })
      .addCase(fetchCreatedEvents.fulfilled, (state, action) => {
        state.createdEvents = action.payload.events;
        state.loadingCreated = false;
        
        if (action.payload.pagination) {
          state.createdPagination.currentPage = action.payload.pagination.page;
          state.createdPagination.pageSize = action.payload.pagination.page_size;
          state.createdPagination.totalCount = action.payload.pagination.total_count;
          state.createdPagination.totalPages = action.payload.pagination.total_pages;
          state.createdPagination.hasNext = action.payload.pagination.has_next;
          state.createdPagination.hasPrevious = action.payload.pagination.has_previous;
        }
      })
      .addCase(fetchCreatedEvents.rejected, (state, action) => {
        state.loadingCreated = false;
        state.errorCreated = action.payload || "Failed to fetch created events";
      })
      // RSVP'd events
      .addCase(fetchRSVPedEvents.pending, (state) => {
        state.loadingRSVPed = true;
        state.errorRSVPed = null;
      })
      .addCase(fetchRSVPedEvents.fulfilled, (state, action) => {
        state.rsvpedEvents = action.payload.events;
        state.loadingRSVPed = false;
        state.hasFetchedRSVPed = true;
        
        if (action.payload.pagination) {
          state.rsvpedPagination.currentPage = action.payload.pagination.page;
          state.rsvpedPagination.pageSize = action.payload.pagination.page_size;
          state.rsvpedPagination.totalCount = action.payload.pagination.total_count;
          state.rsvpedPagination.totalPages = action.payload.pagination.total_pages;
          state.rsvpedPagination.hasNext = action.payload.pagination.has_next;
          state.rsvpedPagination.hasPrevious = action.payload.pagination.has_previous;
        }
      })
      .addCase(fetchRSVPedEvents.rejected, (state, action) => {
        state.loadingRSVPed = false;
        state.errorRSVPed = action.payload || "Failed to fetch RSVP'd events";
      })
      // Organized events
      .addCase(fetchOrganizedEvents.pending, (state) => {
        state.loadingOrganized = true;
        state.errorOrganized = null;
      })
      .addCase(fetchOrganizedEvents.fulfilled, (state, action) => {
        state.organizedEvents = action.payload.events;
        state.loadingOrganized = false;
        state.hasFetchedOrganized = true;
        
        if (action.payload.pagination) {
          state.organizedPagination.currentPage = action.payload.pagination.page;
          state.organizedPagination.pageSize = action.payload.pagination.page_size;
          state.organizedPagination.totalCount = action.payload.pagination.total_count;
          state.organizedPagination.totalPages = action.payload.pagination.total_pages;
          state.organizedPagination.hasNext = action.payload.pagination.has_next;
          state.organizedPagination.hasPrevious = action.payload.pagination.has_previous;
        }
      })
      .addCase(fetchOrganizedEvents.rejected, (state, action) => {
        state.loadingOrganized = false;
        state.errorOrganized = action.payload || "Failed to fetch organized events";
      })
      // Moderated events
      .addCase(fetchModeratedEvents.pending, (state) => {
        state.loadingModerated = true;
        state.errorModerated = null;
      })
      .addCase(fetchModeratedEvents.fulfilled, (state, action) => {
        state.moderatedEvents = action.payload.events;
        state.loadingModerated = false;
        state.hasFetchedModerated = true;
        
        if (action.payload.pagination) {
          state.moderatedPagination.currentPage = action.payload.pagination.page;
          state.moderatedPagination.pageSize = action.payload.pagination.page_size;
          state.moderatedPagination.totalCount = action.payload.pagination.total_count;
          state.moderatedPagination.totalPages = action.payload.pagination.total_pages;
          state.moderatedPagination.hasNext = action.payload.pagination.has_next;
          state.moderatedPagination.hasPrevious = action.payload.pagination.has_previous;
        }
      })
      .addCase(fetchModeratedEvents.rejected, (state, action) => {
        state.loadingModerated = false;
        state.errorModerated = action.payload || "Failed to fetch moderated events";
      })
      // Cancel RSVP
      .addCase(cancelRSVP.fulfilled, (state, action) => {
        const eventId = action.payload;
        state.rsvpedEvents = state.rsvpedEvents.filter(event => event.eventId !== eventId);
        state.rsvpedPagination.totalCount = Math.max(0, state.rsvpedPagination.totalCount - 1);
        // Invalidate cache when RSVP is cancelled
        invalidateCache.userEvents();
      });
  },
});

export const {
  resetUserEvents,
  addRSVPedEvent,
  addCreatedEventLocal,
  removeRSVPedEvent,
  setCreatedPage,
  setCreatedPageSize,
  setRSVPedPage,
  setRSVPedPageSize,
  setOrganizedPage,
  setOrganizedPageSize,
  setModeratedPage,
  setModeratedPageSize,
} = userEventsSlice.actions;

export default userEventsSlice.reducer;
