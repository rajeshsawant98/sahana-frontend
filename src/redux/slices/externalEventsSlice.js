import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchExternalEventsByLocation as fetchEventsAPI } from "../../apis/eventsAPI";

const CACHE_DURATION = 5 * 60 * 1000;

export const fetchExternalEventsByLocation = createAsyncThunk(
  "externalEvents/fetchByLocation",
  async ({ city, state }, { getState, rejectWithValue }) => {
    const { lastFetched } = getState().externalEvents;
    const now = Date.now();
    if (lastFetched && now - lastFetched < CACHE_DURATION) return;

    try {
      return await fetchEventsAPI(city, state);
    } catch {
      return rejectWithValue("Failed to fetch external events");
    }
  }
);

const externalEventsSlice = createSlice({
  name: "externalEvents",
  initialState: {
    events: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    resetExternalEvents: (state) => {
      state.events = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExternalEventsByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExternalEventsByLocation.fulfilled, (state, action) => {
        if (action.payload) {
          state.events = action.payload;
          state.lastFetched = Date.now();
        }
        state.loading = false;
      })
      .addCase(fetchExternalEventsByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetExternalEvents } = externalEventsSlice.actions;
export default externalEventsSlice.reducer;