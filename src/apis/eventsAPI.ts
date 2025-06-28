import axiosInstance from "../utils/axiosInstance";
import { Event } from "../types/Event";
import { 
  PaginatedResponse, 
  LegacyEventsResponse, 
  EventsApiParams,
  LocationEventsApiParams,
  PaginationParams 
} from "../types/Pagination";

// Event API interfaces
export interface CreateEventRequest {
  eventName: string;
  description?: string;
  location?: any;
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
  status: string;
}

export interface UpdateOrganizersRequest {
  organizerEmails: string[];
}

export interface UpdateModeratorsRequest {
  moderatorEmails: string[];
}

// External events (Ticketmaster) - Updated with pagination
export const fetchExternalEventsByLocation = async (
  params: LocationEventsApiParams
): Promise<PaginatedResponse<Event> | LegacyEventsResponse> => {
  const { city, state, page, page_size } = params;
  const queryParams = new URLSearchParams({
    city,
    state,
    ...(page && { page: page.toString() }),
    ...(page_size && { page_size: page_size.toString() }),
  });
  
  const res = await axiosInstance.get(`/events/location/external?${queryParams}`);
  return res.data;
};

export const fetchNearbyEventsByLocation = async (
  params: LocationEventsApiParams
): Promise<PaginatedResponse<Event> | LegacyEventsResponse> => {
  const { city, state, page, page_size } = params;
  const queryParams = new URLSearchParams({
    city,
    state,
    ...(page && { page: page.toString() }),
    ...(page_size && { page_size: page_size.toString() }),
  });
  
  const res = await axiosInstance.get(`/events/location/nearby?${queryParams}`);
  return res.data;
};

// 🟢 Created events (by user) - Updated with pagination
export const fetchCreatedEvents = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Event> | LegacyEventsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  
  const res = await axiosInstance.get(`/events/me/created${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

// 🔵 RSVP'd events (user joined) - Updated with pagination
export const fetchRSVPedEvents = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Event> | LegacyEventsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  
  const res = await axiosInstance.get(`/events/me/rsvped${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

// 🟠 Organized events (user is organizer) - Updated with pagination
export const fetchOrganizedEvents = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Event> | LegacyEventsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  
  const res = await axiosInstance.get(`/events/me/organized${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

// 🟣 Moderated events (user is moderator) - Updated with pagination
export const fetchModeratedEvents = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Event> | LegacyEventsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  
  const res = await axiosInstance.get(`/events/me/moderated${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};

export const cancelRSVP = async (eventId: string): Promise<string> => {
  await axiosInstance.delete(`/events/${eventId}/rsvp`);
  return eventId;
};

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

// 🔸 Admin: Get all events (unfiltered) - Updated with pagination
export const fetchAllAdminEvents = async (
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

export const rsvpToEvent = async (eventId: string, data: RSVPRequest): Promise<void> => {
  await axiosInstance.post(`/events/${eventId}/rsvp`, data);
};

export const updateEventOrganizers = async (eventId: string, data: UpdateOrganizersRequest): Promise<void> => {
  await axiosInstance.patch(`/events/${eventId}/organizers`, data);
};

export const updateEventModerators = async (eventId: string, data: UpdateModeratorsRequest): Promise<void> => {
  await axiosInstance.patch(`/events/${eventId}/moderators`, data);
};
