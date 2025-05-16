import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCreatedEvents as fetchCreatedEventsAPI,
  fetchRSVPedEvents as fetchRSVPedEventsAPI,
  cancelRSVP as cancelRSVPAPI,
} from "../../apis/eventsAPI";

const CACHE_DURATION = 5 * 60 * 1000;

export const fetchCreatedEvents = createAsyncThunk(
  "userEvents/fetchCreated",
  async (_, { getState, rejectWithValue }) => {
    const { lastFetchedCreated } = getState().userEvents;
    const now = Date.now();
    if (lastFetchedCreated && now - lastFetchedCreated < CACHE_DURATION) return;
    try {
      return await fetchCreatedEventsAPI();
    } catch {
      return rejectWithValue("Failed to fetch created events");
    }
  }
);

export const fetchRSVPedEvents = createAsyncThunk(
  "userEvents/fetchRSVPed",
  async (_, { getState, rejectWithValue }) => {
    const { lastFetchedRSVPed } = getState().userEvents;
    const now = Date.now();
    if (lastFetchedRSVPed && now - lastFetchedRSVPed < CACHE_DURATION) return;
    try {
      return await fetchRSVPedEventsAPI();
    } catch {
      return rejectWithValue("Failed to fetch RSVP’d events");
    }
  }
);

export const cancelRSVP = createAsyncThunk(
  "userEvents/cancelRSVP",
  async (eventId, { rejectWithValue }) => {
    try {
      return await cancelRSVPAPI(eventId);
    } catch {
      return rejectWithValue("Failed to cancel RSVP");
    }
  }
);

const userEventsSlice = createSlice({
  name: "userEvents",
  initialState: {
    createdEvents: [],
    rsvpedEvents: [],
    loadingCreated: false,
    loadingRSVPed: false,
    errorCreated: null,
    errorRSVPed: null,
    lastFetchedCreated: null,
    lastFetchedRSVPed: null,
    hasFetchedRSVPed: false,
  },
  reducers: {
    resetUserEvents: (state) => {
      Object.assign(state, {
        createdEvents: [],
        rsvpedEvents: [],
        loadingCreated: false,
        loadingRSVPed: false,
        errorCreated: null,
        errorRSVPed: null,
        lastFetchedCreated: null,
        lastFetchedRSVPed: null,
        hasFetchedRSVPed: false,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatedEvents.pending, (state) => {
        state.loadingCreated = true;
        state.errorCreated = null;
      })
      .addCase(fetchCreatedEvents.fulfilled, (state, action) => {
        if (action.payload) {
          state.createdEvents = action.payload;
          state.lastFetchedCreated = Date.now();
        }
        state.loadingCreated = false;
      })
      .addCase(fetchCreatedEvents.rejected, (state, action) => {
        state.loadingCreated = false;
        state.errorCreated = action.payload;
      })
      .addCase(fetchRSVPedEvents.pending, (state) => {
        state.loadingRSVPed = true;
        state.errorRSVPed = null;
      })
      .addCase(fetchRSVPedEvents.fulfilled, (state, action) => {
        if (action.payload) {
          state.rsvpedEvents = action.payload;
          state.lastFetchedRSVPed = Date.now();
        }
        state.loadingRSVPed = false;
        state.hasFetchedRSVPed = true;
      })
      .addCase(fetchRSVPedEvents.rejected, (state, action) => {
        state.loadingRSVPed = false;
        state.errorRSVPed = action.payload;
      })
      .addCase(cancelRSVP.fulfilled, (state, action) => {
        state.rsvpedEvents = state.rsvpedEvents.filter(
          (e) => e.eventId !== action.payload && e.id !== action.payload
        );
      })
      .addCase(cancelRSVP.rejected, (state, action) => {
        state.errorRSVPed = action.payload;
      });
  },
});

export const { resetUserEvents } = userEventsSlice.actions;
export default userEventsSlice.reducer;