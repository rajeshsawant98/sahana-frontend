import axiosInstance from "../utils/axiosInstance";
import { Event } from "../types/Event";

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

// 🟡 External events (Ticketmaster)
export const fetchExternalEventsByLocation = async (city: string, state: string): Promise<Event[]> => {
  const res = await axiosInstance.get(
    `/events/location/external?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
  );
  return res.data.events;
};

export const fetchNearbyEventsByLocation = async (city: string, state: string): Promise<Event[]> => {
  const res = await axiosInstance.get(
    `/events/location/nearby?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
  );
  return res.data.events;
};

// 🟢 Created events (by user)
export const fetchCreatedEvents = async (): Promise<Event[]> => {
  const res = await axiosInstance.get("/events/me/created");
  return res.data.events;
};

// 🔵 RSVP'd events (user joined)
export const fetchRSVPedEvents = async (): Promise<Event[]> => {
  const res = await axiosInstance.get("/events/me/rsvped");
  return res.data.events;
};

export const cancelRSVP = async (eventId: string): Promise<string> => {
  await axiosInstance.delete(`/events/${eventId}/rsvp`);
  return eventId;
};

// 🔺 All public events
export const fetchAllPublicEvents = async (): Promise<Event[]> => {
  const res = await axiosInstance.get("/events");
  return res.data.events;
};

// 🔸 Admin: Get all events (unfiltered)
export const fetchAllAdminEvents = async (): Promise<Event[]> => {
  const res = await axiosInstance.get("/events");
  return res.data.events;
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
