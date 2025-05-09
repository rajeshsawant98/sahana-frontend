import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const CACHE_DURATION = 5 * 60 * 1000;

export const fetchCreatedEvents = createAsyncThunk(
  "userEvents/fetchCreated",
  async (_, { getState, rejectWithValue }) => {
    const { lastFetchedCreated } = getState().userEvents;
    const now = Date.now();

    if (lastFetchedCreated && now - lastFetchedCreated < CACHE_DURATION) {
      return; // use cache
    }

    try {
      const res = await axiosInstance.get("/events/me/created");
      return res.data.events;
    } catch (err) {
      return rejectWithValue("Failed to fetch created events");
    }
  }
);

export const fetchRSVPedEvents = createAsyncThunk(
    "userEvents/fetchRSVPed",
    async (_, { getState, rejectWithValue }) => {
      const { lastFetchedRSVPed } = getState().userEvents;
      const now = Date.now();
  
      if (lastFetchedRSVPed && now - lastFetchedRSVPed < CACHE_DURATION) {
        return; // use cache
      }
  
      try {
        const res = await axiosInstance.get("/events/me/rsvped");
        return res.data.events;
      } catch (err) {
        return rejectWithValue("Failed to fetch RSVP’d events");
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
       // RSVP’d Events
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
        state.hasFetchedRSVPed = true; // Mark as fetched
    })
    .addCase(fetchRSVPedEvents.rejected, (state, action) => {
        state.loadingRSVPed = false;
        state.errorRSVPed = action.payload;
    });
  },
});

export default userEventsSlice.reducer;
export const { resetUserEvents } = userEventsSlice.actions;