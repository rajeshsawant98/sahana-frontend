// Pagination types for API responses and UI components

// Legacy offset-based pagination (used only by admin pages)
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

// New cursor-based pagination
export interface CursorPaginationParams {
  cursor?: string;
  page_size?: number;
  direction?: 'next' | 'prev';
}

export interface EventFilters {
  city?: string;
  state?: string;
  category?: string;
  is_online?: boolean;
  creator_email?: string;
  start_date?: string;
  end_date?: string;
}

export interface UserFilters {
  role?: string;
  profession?: string;
}

export interface LocationParams {
  city: string;
  state: string;
}

// Generic paginated response structure (legacy)
export interface PaginatedResponse<T> {
  items: T[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// New cursor-based pagination response
export interface CursorPaginatedResponse<T> {
  items: T[];
  pagination: {
    next_cursor?: string;
    prev_cursor?: string;
    has_next: boolean;
    has_previous: boolean;
    page_size: number;
    total_count?: number; // Optional for UI display
  };
}

// Legacy response format (without pagination)
export interface LegacyEventsResponse {
  events: Event[];
  count?: number;
}

export interface LegacyUsersResponse {
  users: User[];
  count?: number;
}

// Combined API request parameters (legacy - used only by admin pages)
export interface EventsApiParams extends PaginationParams, EventFilters {}
export interface UsersApiParams extends PaginationParams, UserFilters {}

// Combined API request parameters (cursor-based - used by main app)
export interface CursorEventsApiParams extends CursorPaginationParams, EventFilters {}
export interface CursorLocationEventsApiParams extends CursorPaginationParams, LocationParams {}

// REMOVED: LocationEventsApiParams - was only used by removed legacy APIs
// REMOVED: CursorUsersApiParams - no cursor-based user pagination needed

// Type imports (these should be imported from their respective files)
import { Event } from './Event';
import { User } from './User';
