import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchExternalEventsByLocation as fetchEventsAPI } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import type { RootState } from "../store";

interface ExternalEventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: ExternalEventsState = {
  events: [],
  loading: false,
  error: null,
};

interface LocationParams {
  city: string;
  state: string;
}

export const fetchExternalEventsByLocation = createAsyncThunk<
  Event[],
  LocationParams,
  { state: RootState; rejectValue: string }
>("externalEvents/fetchByLocation", async ({ city, state }, { rejectWithValue }) => {
  try {
    const response = await fetchEventsAPI({ city, state });
    // Handle both paginated and legacy responses
    if ('items' in response) {
      return response.items;
    } else if ('events' in response) {
      return response.events;
    } else {
      return response as Event[];
    }
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
        state.events = action.payload;
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
