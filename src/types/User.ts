export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  formattedAddress: string;
  name?: string;
}

export interface User {
  email: string;
  name: string;
  role: "admin" | "user";
  location?: LocationData;
  bio?: string;
  interests?: string[];
  profile_picture?: string;
  phoneNumber?: string;
  birthdate?: string;
  profession?: string;
}