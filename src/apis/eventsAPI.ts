import { Location } from "../types/User";

// --- Type Definitions ---
export interface CreateEventRequest {
  eventName: string;
  description?: string;
  location?: Location;
  startTime: string;
  duration: number;
  categories: string[];
  isOnline: boolean;
  joinLink?: string;
  organizers: string[];
  moderators: string[];
  imageUrl?: string;
  createdBy?: string;
  createdByEmail?: string;
}

export interface CreateEventResponse {
  eventId: string;
}

export interface RSVPRequest {
  status: "joined" | "interested" | "attended" | "no_show";
  rating?: number;
  review?: string;
}

export interface UpdateOrganizersRequest {
  organizerEmails: string[];
}

export interface UpdateModeratorsRequest {
  moderatorEmails: string[];
}
import axiosInstance from "../utils/axiosInstance";
import { Event, ArchiveEventRequest, ArchiveEventResponse, ArchivedEventsResponse, BulkArchiveResponse, RSVP } from "../types/Event";
import { 
  PaginatedResponse, 
  LegacyEventsResponse, 
  EventsApiParams,
  CursorPaginationParams,
  CursorPaginatedResponse,
  CursorEventsApiParams,
  CursorLocationEventsApiParams
} from "../types/Pagination";

// Event List Endpoints (Cursor-based)
export const fetchCreatedEventsWithCursor = async (
  params?: CursorPaginationParams
): Promise<CursorPaginatedResponse<Event>> => {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.set('cursor', params.cursor);
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params?.direction) queryParams.set('direction', params.direction);
  const res = await axiosInstance.get(`/events/me/created${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

export const fetchRSVPedEventsWithCursor = async (
  params?: CursorPaginationParams
): Promise<CursorPaginatedResponse<Event>> => {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.set('cursor', params.cursor);
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params?.direction) queryParams.set('direction', params.direction);
  const res = await axiosInstance.get(`/events/me/rsvped${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

export const fetchInterestedEventsWithCursor = async (
  params?: CursorPaginationParams
): Promise<CursorPaginatedResponse<Event>> => {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.set('cursor', params.cursor);
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params?.direction) queryParams.set('direction', params.direction);
  const res = await axiosInstance.get(`/events/me/interested${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

export const fetchOrganizedEventsWithCursor = async (
  params?: CursorPaginationParams
): Promise<CursorPaginatedResponse<Event>> => {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.set('cursor', params.cursor);
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params?.direction) queryParams.set('direction', params.direction);
  const res = await axiosInstance.get(`/events/me/organized${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

export const fetchModeratedEventsWithCursor = async (
  params?: CursorPaginationParams
): Promise<CursorPaginatedResponse<Event>> => {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.set('cursor', params.cursor);
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params?.direction) queryParams.set('direction', params.direction);
  const res = await axiosInstance.get(`/events/me/moderated${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

// Location-based Events
export const fetchNearbyEventsByLocationWithCursor = async (
  params: CursorLocationEventsApiParams
): Promise<CursorPaginatedResponse<Event>> => {
  const { city, state, cursor, page_size, direction } = params;
  const queryParams = new URLSearchParams({
    city,
    state,
    ...(cursor && { cursor }),
    ...(page_size && { page_size: page_size.toString() }),
    ...(direction && { direction }),
  });
  const res = await axiosInstance.get(`/events/location/nearby?${queryParams}`);
  return res.data;
};

// ...existing code...


// 🔺 All public events - Updated with pagination
export const fetchAllPublicEvents = async (
  params?: EventsApiParams
): Promise<PaginatedResponse<Event> | LegacyEventsResponse> => {
  const queryParams = new URLSearchParams();
  
  // Add pagination parameters
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  
  // Add filter parameters
  if (params?.city) queryParams.set('city', params.city);
  if (params?.state) queryParams.set('state', params.state);
  if (params?.category) queryParams.set('category', params.category);
  if (params?.is_online !== undefined) queryParams.set('is_online', params.is_online.toString());
  if (params?.creator_email) queryParams.set('creator_email', params.creator_email);
  if (params?.start_date) queryParams.set('start_date', params.start_date);
  if (params?.end_date) queryParams.set('end_date', params.end_date);
  
  const res = await axiosInstance.get(`/events${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

// 🔺 All public events - Cursor-based pagination
export const fetchAllPublicEventsWithCursor = async (
  params?: CursorEventsApiParams
): Promise<CursorPaginatedResponse<Event>> => {
  const queryParams = new URLSearchParams();
  
  // Add cursor pagination parameters
  if (params?.cursor) queryParams.set('cursor', params.cursor);
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params?.direction) queryParams.set('direction', params.direction);
  
  // Add filter parameters
  if (params?.city) queryParams.set('city', params.city);
  if (params?.state) queryParams.set('state', params.state);
  if (params?.category) queryParams.set('category', params.category);
  if (params?.is_online !== undefined) queryParams.set('is_online', params.is_online.toString());
  if (params?.creator_email) queryParams.set('creator_email', params.creator_email);
  if (params?.start_date) queryParams.set('start_date', params.start_date);
  if (params?.end_date) queryParams.set('end_date', params.end_date);
  
  const url = `/events${queryParams.toString() ? `?${queryParams}` : ''}`;
  const res = await axiosInstance.get(url);
  
  return res.data;
};

// 🔸 Admin: Get all events (unfiltered) - REMOVED: API doesn't exist in backend 

// 🔸 Admin: Get all events (unfiltered) - REMOVED: Unused cursor version

// ✨ NEW: Event management functions
export const fetchEventById = async (eventId: string): Promise<Event> => {
  const response = await axiosInstance.get<Event>(`/events/${eventId}`);
  return response.data;
};

export const createEvent = async (eventData: CreateEventRequest): Promise<CreateEventResponse> => {
  const response = await axiosInstance.post<CreateEventResponse>("/events/new", eventData);
  return response.data;
};

export const updateEvent = async (eventId: string, eventData: Partial<CreateEventRequest>): Promise<void> => {
  await axiosInstance.put(`/events/${eventId}`, eventData);
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await axiosInstance.delete(`/events/${eventId}`);
};

export const rsvpToEvent = async (eventId: string, data: RSVPRequest): Promise<any> => {
  const response = await axiosInstance.post(`/events/${eventId}/rsvp`, data);
  return response.data;
};

export const cancelRSVP = async (eventId: string, status: "joined" | "interested"): Promise<{ message: string; rsvp: RSVP }> => {
  const response = await axiosInstance.delete(`/events/${eventId}/rsvp?status=${status}`);
  return response.data;
};

export const updateRSVPStatus = async (
  eventId: string,
  data: { status: "attended" | "no_show"; rating?: number; review?: string }
): Promise<{ message: string; rsvp: RSVP }> => {
  const response = await axiosInstance.patch(`/events/${eventId}/rsvp/status`, data);
  return response.data;
};

export const fetchRSVPList = async (
  eventId: string,
  page = 1,
  page_size = 10
): Promise<{ rsvps: RSVP[]; page: number; page_size: number; total: number }> => {
  const response = await axiosInstance.get(`/events/${eventId}/rsvps?page=${page}&page_size=${page_size}`);
  return response.data;
};

export const updateEventOrganizers = async (eventId: string, data: UpdateOrganizersRequest): Promise<void> => {
  await axiosInstance.patch(`/events/${eventId}/organizers`, data);
};

export const updateEventModerators = async (eventId: string, data: UpdateModeratorsRequest): Promise<void> => {
  await axiosInstance.patch(`/events/${eventId}/moderators`, data);
};

// Archive Event Functions
export const archiveEvent = async (eventId: string, reason: string): Promise<ArchiveEventResponse> => {
  const response = await axiosInstance.patch(`/events/${eventId}/archive`, { reason });
  return response.data;
};

export const unarchiveEvent = async (eventId: string): Promise<{ message: string }> => {
  const response = await axiosInstance.patch(`/events/${eventId}/unarchive`);
  return response.data;
};

export const fetchArchivedEvents = async (): Promise<ArchivedEventsResponse> => {
  const response = await axiosInstance.get('/events/me/archived');
  return response.data;
};

export const fetchAllAdminArchivedEvents = async (params?: { page?: number; page_size?: number }): Promise<ArchivedEventsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  
  const response = await axiosInstance.get(`/events/archived${queryParams.toString() ? `?${queryParams}` : ''}`);
  return response.data;
};

// Admin: Get all archived events - Cursor pagination
export const fetchAllAdminArchivedEventsWithCursor = async (
  params?: CursorPaginationParams
): Promise<CursorPaginatedResponse<Event>> => {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.set('cursor', params.cursor);
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params?.direction) queryParams.set('direction', params.direction);
  
  const response = await axiosInstance.get(`/events/archived${queryParams.toString() ? `?${queryParams}` : ''}`);
  return response.data;
};

export const bulkArchivePastEvents = async (): Promise<BulkArchiveResponse> => {
  const response = await axiosInstance.post('/events/archive/past-events');
  return response.data;
};
