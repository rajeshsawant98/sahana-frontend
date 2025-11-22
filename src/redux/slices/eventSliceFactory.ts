import { 
  createSlice, 
  createAsyncThunk, 
  PayloadAction, 
  Reducer, 
  ActionCreatorWithPayload, 
  ActionCreatorWithoutPayload, 
  AsyncThunk 
} from "@reduxjs/toolkit";
import { Event } from "../../types/Event";
import { CursorPaginatedResponse, CursorPaginationParams } from "../../types/Pagination";
import { RootState } from "../store";

// State interface for each event type
export interface UserEventState {
  events: Event[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  nextCursor?: string;
  prevCursor?: string;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount?: number;
  hasFetched: boolean;
}

export const defaultEventState: UserEventState = {
  events: [],
  loading: false,
  loadingMore: false,
  error: null,
  nextCursor: undefined,
  prevCursor: undefined,
  hasNext: false,
  hasPrevious: false,
  pageSize: 12,
  totalCount: undefined,
  hasFetched: false,
};

interface CreateEventSliceOptions {
  name: string;
  fetchInitial: (params: CursorPaginationParams) => Promise<CursorPaginatedResponse<Event>>;
  fetchMore: (params: CursorPaginationParams) => Promise<CursorPaginatedResponse<Event>>;
}

export interface EventSliceActions {
  reset: ActionCreatorWithoutPayload;
  setPageSize: ActionCreatorWithPayload<number>;
  addEventLocal: ActionCreatorWithPayload<Event>;
  removeEventLocal: ActionCreatorWithPayload<string>;
  fetchInitial: AsyncThunk<CursorPaginatedResponse<Event>, CursorPaginationParams, { state: RootState; rejectValue: string }>;
  loadMore: AsyncThunk<CursorPaginatedResponse<Event>, { cursor: string; pageSize?: number }, { state: RootState; rejectValue: string }>;
}

export interface EventSliceResult {
  reducer: Reducer<UserEventState>;
  actions: EventSliceActions;
}

export const createEventSlice = (options: CreateEventSliceOptions): EventSliceResult => {
  const { name, fetchInitial, fetchMore } = options;

  // Async Thunks
  const fetchInitialEvents = createAsyncThunk<
    CursorPaginatedResponse<Event>,
    CursorPaginationParams,
    { state: RootState; rejectValue: string }
  >(`${name}/fetchInitial`, async (params, { rejectWithValue }) => {
    try {
      return await fetchInitial(params);
    } catch (error) {
      return rejectWithValue(`Failed to fetch ${name} events`);
    }
  });

  const loadMoreEvents = createAsyncThunk<
    CursorPaginatedResponse<Event>,
    { cursor: string; pageSize?: number },
    { state: RootState; rejectValue: string }
  >(`${name}/loadMore`, async ({ cursor, pageSize = 12 }, { rejectWithValue }) => {
    try {
      return await fetchMore({
        cursor,
        page_size: pageSize,
        direction: 'next',
      });
    } catch (error) {
      return rejectWithValue(`Failed to load more ${name} events`);
    }
  });

  // Slice
  const slice = createSlice({
    name,
    initialState: defaultEventState,
    reducers: {
      reset: (state) => {
        Object.assign(state, defaultEventState);
      },
      setPageSize: (state, action: PayloadAction<number>) => {
        state.pageSize = action.payload;
      },
      addEventLocal: (state, action: PayloadAction<Event>) => {
        state.events.unshift(action.payload);
        if (state.totalCount !== undefined) {
          state.totalCount += 1;
        }
      },
      removeEventLocal: (state, action: PayloadAction<string>) => {
        state.events = state.events.filter(e => e.eventId !== action.payload);
        if (state.totalCount !== undefined) {
          state.totalCount = Math.max(0, state.totalCount - 1);
        }
      }
    },
    extraReducers: (builder) => {
      builder
        // Initial Fetch
        .addCase(fetchInitialEvents.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchInitialEvents.fulfilled, (state, action) => {
          state.loading = false;
          state.hasFetched = true;
          state.events = action.payload.items;
          state.nextCursor = action.payload.pagination.next_cursor;
          state.prevCursor = action.payload.pagination.prev_cursor;
          state.hasNext = action.payload.pagination.has_next;
          state.hasPrevious = action.payload.pagination.has_previous;
          state.pageSize = action.payload.pagination.page_size;
          state.totalCount = action.payload.pagination.total_count;
        })
        .addCase(fetchInitialEvents.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch events";
        })
        // Load More
        .addCase(loadMoreEvents.pending, (state) => {
          state.loadingMore = true;
          state.error = null;
        })
        .addCase(loadMoreEvents.fulfilled, (state, action) => {
          state.loadingMore = false;
          state.events = [...state.events, ...action.payload.items];
          state.nextCursor = action.payload.pagination.next_cursor;
          state.prevCursor = action.payload.pagination.prev_cursor;
          state.hasNext = action.payload.pagination.has_next;
          state.hasPrevious = action.payload.pagination.has_previous;
          state.totalCount = action.payload.pagination.total_count;
        })
        .addCase(loadMoreEvents.rejected, (state, action) => {
          state.loadingMore = false;
          state.error = action.payload || "Failed to load more events";
        });
    },
  });

  return {
    reducer: slice.reducer,
    actions: {
      ...slice.actions,
      fetchInitial: fetchInitialEvents,
      loadMore: loadMoreEvents,
    },
  };
};
