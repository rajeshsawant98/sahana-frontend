import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCreatedEvents as fetchCreatedEventsAPI,
  fetchRSVPedEvents as fetchRSVPedEventsAPI,
  cancelRSVP as cancelRSVPAPI,
} from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import type { RootState } from "../store";

const CACHE_DURATION = 5 * 60 * 1000;

interface UserEventsState {
  createdEvents: Event[];
  rsvpedEvents: Event[];
  loadingCreated: boolean;
  loadingRSVPed: boolean;
  errorCreated: string | null;
  errorRSVPed: string | null;
  lastFetchedCreated: number | null;
  lastFetchedRSVPed: number | null;
  hasFetchedRSVPed: boolean;
}

const initialState: UserEventsState = {
  createdEvents: [],
  rsvpedEvents: [],
  loadingCreated: false,
  loadingRSVPed: false,
  errorCreated: null,
  errorRSVPed: null,
  lastFetchedCreated: null,
  lastFetchedRSVPed: null,
  hasFetchedRSVPed: false,
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

export const { resetUserEvents, addCreatedEventLocal } = userEventsSlice.actions;
export default userEventsSlice.reducer;
