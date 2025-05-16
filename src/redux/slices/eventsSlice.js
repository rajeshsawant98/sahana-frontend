import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllPublicEvents as fetchPublicEventsAPI } from "../../apis/eventsAPI";

const CACHE_DURATION = 5 * 60 * 1000;

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { getState, rejectWithValue }) => {
    const { lastFetched } = getState().events;
    const now = Date.now();
    if (lastFetched && now - lastFetched < CACHE_DURATION) return;
    try {
      return await fetchPublicEventsAPI();
    } catch {
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
      state.events = state.events.filter(
        (event) => event.eventId !== action.payload
      );
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