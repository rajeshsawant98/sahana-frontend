
export interface Location {
  longitude?: number;
  latitude?: number;
  country?: string;
  state?: string;
  city?: string;
  formattedAddress?: string;
  name?: string;
}

export interface User {
  name: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  birthdate?: string; // Format: "YYYY-MM-DD"
  profession?: string;
  interests?: string[];
  role: "user" | "admin";
  profile_picture?: string;
  location?: Location | null;
  google_uid?: string | null;
  created_at?: string | null; // ISO datetime
  updated_at?: string | null; // ISO datetime
}