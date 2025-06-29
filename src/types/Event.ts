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
  // Archive fields
  isArchived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
}

export interface ArchiveEventRequest {
  reason: string;
}

export interface ArchiveEventResponse {
  message: string;
  archived_by: string;
  reason: string;
}

export interface ArchivedEventsResponse {
  archived_events: Event[];
  count: number;
}

export interface BulkArchiveResponse {
  message: string;
  archived_count: number;
  archived_by: string;
}