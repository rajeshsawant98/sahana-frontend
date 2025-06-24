import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchExternalEventsByLocation as fetchEventsAPI } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import type { RootState } from "../store";

const CACHE_DURATION = 5 * 60 * 1000;

interface ExternalEventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ExternalEventsState = {
  events: [],
  loading: false,
  error: null,
  lastFetched: null,
};

interface LocationParams {
  city: string;
  state: string;
}

export const fetchExternalEventsByLocation = createAsyncThunk<
  Event[],
  LocationParams,
  { state: RootState; rejectValue: string }
>("externalEvents/fetchByLocation", async ({ city, state }, { getState, rejectWithValue }) => {
  const { lastFetched } = getState().externalEvents;
  const now = Date.now();
  if (lastFetched && now - lastFetched < CACHE_DURATION) return [];

  try {
    return await fetchEventsAPI(city, state);
  } catch {
    return rejectWithValue("Failed to fetch external events");
  }
});

const externalEventsSlice = createSlice({
  name: "externalEvents",
  initialState,
  reducers: {
    resetExternalEvents: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExternalEventsByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExternalEventsByLocation.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.events = action.payload;
          state.lastFetched = Date.now();
        }
        state.loading = false;
      })
      .addCase(fetchExternalEventsByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch external events";
      });
  },
});

export const { resetExternalEvents } = externalEventsSlice.actions;
export default externalEventsSlice.reducer;
