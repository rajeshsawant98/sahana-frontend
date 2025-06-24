import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllPublicEvents as fetchPublicEventsAPI } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import type { RootState } from "../store";

const CACHE_DURATION = 5 * 60 * 1000;

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchEvents = createAsyncThunk<
  Event[],
  void,
  { state: RootState; rejectValue: string }
>("events/fetchEvents", async (_, { getState, rejectWithValue }) => {
  const { lastFetched, events } = getState().events;
  const now = Date.now();
  if (lastFetched && now - lastFetched < CACHE_DURATION) {
    return events; // Return existing cached events instead of empty array
  }
  try {
    return await fetchPublicEventsAPI();
  } catch {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.lastFetched = Date.now();
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch events";
      });
  },
});

export const { addEvent, removeEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
