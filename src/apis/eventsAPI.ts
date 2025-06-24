import axiosInstance from "../utils/axiosInstance";
import { Event } from "../types/Event";

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
