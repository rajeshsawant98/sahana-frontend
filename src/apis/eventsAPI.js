import axiosInstance from "../utils/axiosInstance";

// 🟡 External events (Ticketmaster)
export const fetchExternalEventsByLocation = async (city, state) => {
  const res = await axiosInstance.get(
    `/events/location/external?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
  );
  return res.data.events;
};

export const fetchNearbyEventsByLocation = async (city, state) => {
  const res = await axiosInstance.get(
    `/events/location/nearby?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
  );
  return res.data.events;
};

// 🟢 Created events (by user)
export const fetchCreatedEvents = async () => {
  const res = await axiosInstance.get("/events/me/created");
  return res.data.events;
};

// 🔵 RSVP'd events (user joined)
export const fetchRSVPedEvents = async () => {
  const res = await axiosInstance.get("/events/me/rsvped");
  return res.data.events;
};

export const cancelRSVP = async (eventId) => {
  await axiosInstance.delete(`/events/${eventId}/rsvp`);
  return eventId;
};

// 🔺 All public events
export const fetchAllPublicEvents = async () => {
  const res = await axiosInstance.get("/events");
  return res.data.events;
};