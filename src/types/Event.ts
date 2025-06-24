import { LocationData } from "./User";

export interface Event {
  eventId: string;
  eventName: string;
  description?: string;
  imageUrl?: string;
  startTime: string;
  duration: number;
  categories: string[];
  isOnline: boolean;
  joinLink?: string;
  createdBy: string;
  createdByEmail: string;
  organizers: string[];
  moderators: string[];
  location?: LocationData;
}