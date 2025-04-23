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
      const res = await axiosInstance.get("/auth/me/events/created");
      return res.data.events;
    } catch (err) {
      return rejectWithValue("Failed to fetch created events");
    }
  }
);

const userEventsSlice = createSlice({
  name: "userEvents",
  initialState: {
    createdEvents: [],
    loadingCreated: false,
    errorCreated: null,
    lastFetchedCreated: null,
  },
  reducers: {},
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
      });
  },
});

export default userEventsSlice.reducer;