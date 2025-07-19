import { PayloadAction } from '@reduxjs/toolkit';

// Generic loading state interface
export interface LoadingState {
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

// Generic pagination state interface
export interface PaginationState {
  nextCursor?: string;
  prevCursor?: string;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount?: number;
  hasFetched: boolean;
}

// Combined state interface for common event/data lists
export interface ListState<T> extends LoadingState, PaginationState {
  items: T[];
}

// Helper to create consistent fulfilled reducers for cursor-based pagination
export const createCursorFulfilledReducer = <T>(
  isLoadMore: boolean = false
) => (state: any, action: PayloadAction<any>) => {
  const data = action.payload;
  
  if (isLoadMore) {
    state.loadingMore = false;
    state.items = [...state.items, ...data.items];
  } else {
    state.loading = false;
    state.hasFetched = true;
    state.items = data.items;
  }
  
  state.nextCursor = data.pagination.next_cursor;
  state.prevCursor = data.pagination.prev_cursor;
  state.hasNext = data.pagination.has_next;
  state.hasPrevious = data.pagination.has_previous;
  state.pageSize = data.pagination.page_size;
  state.totalCount = data.pagination.total_count;
};

// Helper to create fulfilled reducer for events specifically
export const createEventsFulfilledReducer = (isLoadMore: boolean = false) => (state: any, action: PayloadAction<any>) => {
  const data = action.payload;
  
  if (isLoadMore) {
    state.loadingMore = false;
    state.events = [...state.events, ...data.items];
  } else {
    state.loading = false;
    state.hasFetched = true;
    state.events = data.items;
  }
  
  state.nextCursor = data.pagination.next_cursor;
  state.prevCursor = data.pagination.prev_cursor;
  state.hasNext = data.pagination.has_next;
  state.hasPrevious = data.pagination.has_previous;
  state.pageSize = data.pagination.page_size;
  state.totalCount = data.pagination.total_count;
};

// Common pending reducer for initial fetch
export const pendingReducer = (state: LoadingState) => {
  state.loading = true;
  state.error = null;
};

// Common pending reducer for load more
export const loadMorePendingReducer = (state: LoadingState) => {
  state.loadingMore = true;
  state.error = null;
};

// Common rejected reducer for initial fetch
export const rejectedReducer = (errorMessage: string) => (state: LoadingState) => {
  state.loading = false;
  state.error = errorMessage;
};

// Common rejected reducer for load more
export const loadMoreRejectedReducer = (errorMessage: string) => (state: LoadingState) => {
  state.loadingMore = false;
  state.error = errorMessage;
};

// Common async operation result type
export interface AsyncOperationResult {
  success: boolean;
  error?: string;
  data?: any;
}

// Helper function for consistent async operation handling in hooks
export const handleAsyncOperation = async (
  operation: () => Promise<any>
): Promise<AsyncOperationResult> => {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : error as string 
    };
  }
};
