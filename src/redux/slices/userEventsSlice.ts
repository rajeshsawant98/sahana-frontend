import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCreatedEvents as fetchCreatedEventsAPI,
  fetchRSVPedEvents as fetchRSVPedEventsAPI,
  fetchOrganizedEvents as fetchOrganizedEventsAPI,
  fetchModeratedEvents as fetchModeratedEventsAPI,
  cancelRSVP as cancelRSVPAPI,
} from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import type { RootState } from "../store";

const CACHE_DURATION = 5 * 60 * 1000;

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
  lastFetchedCreated: number | null;
  lastFetchedRSVPed: number | null;
  lastFetchedOrganized: number | null;
  lastFetchedModerated: number | null;
  hasFetchedRSVPed: boolean;
  hasFetchedOrganized: boolean;
  hasFetchedModerated: boolean;
}

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
  lastFetchedCreated: null,
  lastFetchedRSVPed: null,
  lastFetchedOrganized: null,
  lastFetchedModerated: null,
  hasFetchedRSVPed: false,
  hasFetchedOrganized: false,
  hasFetchedModerated: false,
};

export const fetchCreatedEvents = createAsyncThunk<
  Event[],
  void,
  { state: RootState; rejectValue: string }
>("userEvents/fetchCreated", async (_, { getState, rejectWithValue }) => {
  const { lastFetchedCreated, createdEvents } = getState().userEvents;
  const now = Date.now();
  
  // If cache is valid and we have data, return cached data
  if (lastFetchedCreated && now - lastFetchedCreated < CACHE_DURATION && createdEvents.length > 0) {
    return createdEvents;
  }
  
  try {
    return await fetchCreatedEventsAPI();
  } catch {
    return rejectWithValue("Failed to fetch created events");
  }
});

export const fetchRSVPedEvents = createAsyncThunk<
  Event[],
  void,
  { state: RootState; rejectValue: string }
>("userEvents/fetchRSVPed", async (_, { getState, rejectWithValue }) => {
  const { lastFetchedRSVPed, rsvpedEvents } = getState().userEvents;
  const now = Date.now();
  
  // If cache is valid and we have data, return cached data
  if (lastFetchedRSVPed && now - lastFetchedRSVPed < CACHE_DURATION && rsvpedEvents.length >= 0) {
    return rsvpedEvents;
  }
  
  try {
    return await fetchRSVPedEventsAPI();
  } catch {
    return rejectWithValue("Failed to fetch RSVP'd events");
  }
});

export const fetchOrganizedEvents = createAsyncThunk<
  Event[],
  void,
  { state: RootState; rejectValue: string }
>("userEvents/fetchOrganized", async (_, { getState, rejectWithValue }) => {
  const { lastFetchedOrganized, organizedEvents } = getState().userEvents;
  const now = Date.now();
  
  // If cache is valid and we have data, return cached data
  if (lastFetchedOrganized && now - lastFetchedOrganized < CACHE_DURATION && organizedEvents.length >= 0) {
    return organizedEvents;
  }
  
  try {
    return await fetchOrganizedEventsAPI();
  } catch {
    return rejectWithValue("Failed to fetch organized events");
  }
});

export const fetchModeratedEvents = createAsyncThunk<
  Event[],
  void,
  { state: RootState; rejectValue: string }
>("userEvents/fetchModerated", async (_, { getState, rejectWithValue }) => {
  const { lastFetchedModerated, moderatedEvents } = getState().userEvents;
  const now = Date.now();
  
  // If cache is valid and we have data, return cached data
  if (lastFetchedModerated && now - lastFetchedModerated < CACHE_DURATION && moderatedEvents.length >= 0) {
    return moderatedEvents;
  }
  
  try {
    return await fetchModeratedEventsAPI();
  } catch {
    return rejectWithValue("Failed to fetch moderated events");
  }
});

export const cancelRSVP = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("userEvents/cancelRSVP", async (eventId, { rejectWithValue }) => {
  try {
    return await cancelRSVPAPI(eventId);
  } catch {
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
    addCreatedEventLocal: (state, action: PayloadAction<Event>) => {
      const event = action.payload;
      const exists = state.createdEvents.some((e) => e.eventId === event.eventId);
      if (!exists) {
        state.createdEvents.unshift(event);
      }
    },
    addRSVPedEvent: (state, action: PayloadAction<Event>) => {
      const event = action.payload;
      const exists = state.rsvpedEvents.some((e) => e.eventId === event.eventId);
      if (!exists) {
        state.rsvpedEvents.unshift(event);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatedEvents.pending, (state) => {
        state.loadingCreated = true;
        state.errorCreated = null;
      })
      .addCase(fetchCreatedEvents.fulfilled, (state, action) => {
        // Always update if we have fresh data, or if this is the first load
        if (action.payload && (action.payload.length > 0 || !state.lastFetchedCreated)) {
          state.createdEvents = action.payload;
          state.lastFetchedCreated = Date.now();
        }
        state.loadingCreated = false;
      })
      .addCase(fetchCreatedEvents.rejected, (state, action) => {
        state.loadingCreated = false;
        state.errorCreated = action.payload || "Failed to fetch created events";
      })
      .addCase(fetchRSVPedEvents.pending, (state) => {
        state.loadingRSVPed = true;
        state.errorRSVPed = null;
      })
      .addCase(fetchRSVPedEvents.fulfilled, (state, action) => {
        // Always update if we have fresh data, or if this is the first load
        if (action.payload !== undefined && (action.payload.length > 0 || !state.lastFetchedRSVPed)) {
          state.rsvpedEvents = action.payload;
          state.lastFetchedRSVPed = Date.now();
        }
        state.loadingRSVPed = false;
        state.hasFetchedRSVPed = true;
      })
      .addCase(fetchRSVPedEvents.rejected, (state, action) => {
        state.loadingRSVPed = false;
        state.errorRSVPed = action.payload || "Failed to fetch RSVP'd events";
      })
      .addCase(fetchOrganizedEvents.pending, (state) => {
        state.loadingOrganized = true;
        state.errorOrganized = null;
      })
      .addCase(fetchOrganizedEvents.fulfilled, (state, action) => {
        if (action.payload !== undefined && (action.payload.length > 0 || !state.lastFetchedOrganized)) {
          state.organizedEvents = action.payload;
          state.lastFetchedOrganized = Date.now();
        }
        state.loadingOrganized = false;
        state.hasFetchedOrganized = true;
      })
      .addCase(fetchOrganizedEvents.rejected, (state, action) => {
        state.loadingOrganized = false;
        state.errorOrganized = action.payload || "Failed to fetch organized events";
      })
      .addCase(fetchModeratedEvents.pending, (state) => {
        state.loadingModerated = true;
        state.errorModerated = null;
      })
      .addCase(fetchModeratedEvents.fulfilled, (state, action) => {
        if (action.payload !== undefined && (action.payload.length > 0 || !state.lastFetchedModerated)) {
          state.moderatedEvents = action.payload;
          state.lastFetchedModerated = Date.now();
        }
        state.loadingModerated = false;
        state.hasFetchedModerated = true;
      })
      .addCase(fetchModeratedEvents.rejected, (state, action) => {
        state.loadingModerated = false;
        state.errorModerated = action.payload || "Failed to fetch moderated events";
      })
      .addCase(cancelRSVP.fulfilled, (state, action) => {
        state.rsvpedEvents = state.rsvpedEvents.filter(
          (e) => e.eventId !== action.payload && e.eventId !== action.payload
        );
      })
      .addCase(cancelRSVP.rejected, (state, action) => {
        state.errorRSVPed = action.payload || "Failed to cancel RSVP";
      });
  },
});

export const { resetUserEvents, addCreatedEventLocal, addRSVPedEvent } = userEventsSlice.actions;
export default userEventsSlice.reducer;
