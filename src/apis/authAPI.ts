import axiosInstance from "../utils/axiosInstance";
import { User } from "../types/User";

// Auth API interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  access_token: string;
  refresh_token: string;
}

export interface GoogleLoginRequest {
  token: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignUpResponse {
  access_token: string;
  refresh_token: string;
  email: string;
  name?: string;
}

export interface UpdateInterestsRequest {
  interests: string[];
}

// Auth API functions
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const loginWithGoogle = async (data: GoogleLoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/google", data);
  return response.data;
};

export const registerUser = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await axiosInstance.post<SignUpResponse>("/auth/register", data);
  return response.data;
};

export const updateUserInterests = async (data: UpdateInterestsRequest): Promise<void> => {
  await axiosInstance.put("/auth/me/interests", data);
};

export const updateUserProfile = async (data: Partial<User>): Promise<void> => {
  await axiosInstance.put("/auth/me", data);
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/auth/me");
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<{ access_token: string; refresh_token: string }> => {
  const response = await axiosInstance.post("/auth/refresh", { refresh_token: refreshToken });
  return response.data;
};
