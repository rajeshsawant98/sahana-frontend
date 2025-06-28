import axiosInstance from "../utils/axiosInstance";
import { Event } from "../types/Event";
import { User } from "../types/User";
import { 
  PaginatedResponse, 
  LegacyUsersResponse, 
  UsersApiParams 
} from "../types/Pagination";

// Admin API to manage users

export const fetchAllUsers = async (
  params?: UsersApiParams
): Promise<PaginatedResponse<User> | LegacyUsersResponse> => {
  const queryParams = new URLSearchParams();
  
  // Add pagination parameters
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  
  // Add filter parameters
  if (params?.role) queryParams.set('role', params.role);
  if (params?.profession) queryParams.set('profession', params.profession);
  
  const res = await axiosInstance.get(`/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};