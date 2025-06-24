import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNearbyEventsByLocation as fetchEventsAPI } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import type { RootState } from "../store";

const CACHE_DURATION = 5 * 60 * 1000;

interface NearbyEventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: NearbyEventsState = {
  events: [],
  loading: false,
  error: null,
  lastFetched: null,
};

interface LocationParams {
  city: string;
  state: string;
}

export const fetchNearbyEventsByLocation = createAsyncThunk<
  Event[],
  LocationParams,
  { state: RootState; rejectValue: string }
>("nearbyEvents/fetchByLocation", async ({ city, state }, { getState, rejectWithValue }) => {
  const { lastFetched } = getState().nearbyEvents;
  const now = Date.now();
  if (lastFetched && now - lastFetched < CACHE_DURATION) return [];

  try {
    return await fetchEventsAPI(city, state);
  } catch {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyEventsByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyEventsByLocation.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.events = action.payload;
          state.lastFetched = Date.now();
        }
        state.loading = false;
      })
      .addCase(fetchNearbyEventsByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch nearby events";
      });
  },
});

export const { resetNearbyEvents } = nearbyEventsSlice.actions;
export default nearbyEventsSlice.reducer;
