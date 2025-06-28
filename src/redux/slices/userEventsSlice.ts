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
    const response = await fetchCreatedEventsAPI(params);
    
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
    return rejectWithValue("Failed to fetch created events");
  }
});

export const fetchRSVPedEvents = createAsyncThunk<
  { events: Event[]; pagination?: Omit<PaginatedResponse<Event>, 'items'> },
  PaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchRSVPed", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchRSVPedEventsAPI(params);
    
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
    return rejectWithValue("Failed to fetch RSVP'd events");
  }
});

export const fetchOrganizedEvents = createAsyncThunk<
  { events: Event[]; pagination?: Omit<PaginatedResponse<Event>, 'items'> },
  PaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchOrganized", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchOrganizedEventsAPI(params);
    
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
    return rejectWithValue("Failed to fetch organized events");
  }
});

export const fetchModeratedEvents = createAsyncThunk<
  { events: Event[]; pagination?: Omit<PaginatedResponse<Event>, 'items'> },
  PaginationParams,
  { state: RootState; rejectValue: string }
>("userEvents/fetchModerated", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchModeratedEventsAPI(params);
    
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
    },
    addCreatedEventLocal: (state, action: PayloadAction<Event>) => {
      const exists = state.createdEvents.some(event => event.eventId === action.payload.eventId);
      if (!exists) {
        state.createdEvents.push(action.payload);
        state.createdPagination.totalCount += 1;
      }
    },
    removeRSVPedEvent: (state, action: PayloadAction<string>) => {
      const index = state.rsvpedEvents.findIndex(event => event.eventId === action.payload);
      if (index !== -1) {
        state.rsvpedEvents.splice(index, 1);
        state.rsvpedPagination.totalCount = Math.max(0, state.rsvpedPagination.totalCount - 1);
      }
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
