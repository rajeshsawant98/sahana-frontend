import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// ⏱ Time in milliseconds before refetch (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { getState, rejectWithValue }) => {
    const { lastFetched } = getState().events;
    const now = Date.now();

    // ✅ Use cache if fetched recently
    if (lastFetched && now - lastFetched < CACHE_DURATION) {
        console.log("⏱️ Using cached events");
        return; // Or: return dispatch(eventsCacheHit()); if you define one
      }

    try {
      const response = await axiosInstance.get("/events");
      return response.data.events;
    } catch (error) {
      return rejectWithValue("Failed to fetch events");
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(e => e.eventId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        if (action.payload) {
          state.events = action.payload;
          state.lastFetched = Date.now();
        }
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addEvent, removeEvent } = eventsSlice.actions;
export default eventsSlice.reducer;