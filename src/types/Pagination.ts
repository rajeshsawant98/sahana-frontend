// Pagination types for API responses and UI components

export interface PaginationParams {
  page?: number;
  page_size?: number;
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

// Generic paginated response structure
export interface PaginatedResponse<T> {
  items: T[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
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

// Combined API request parameters
export interface EventsApiParams extends PaginationParams, EventFilters {}
export interface LocationEventsApiParams extends PaginationParams, LocationParams {}
export interface UsersApiParams extends PaginationParams, UserFilters {}

// Type imports (these should be imported from their respective files)
import { Event } from './Event';
import { User } from './User';
