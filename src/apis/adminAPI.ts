import axiosInstance from "../utils/axiosInstance";
import { Event } from "../types/Event";
import { User } from "../types/User";
import { 
  PaginatedResponse, 
  LegacyUsersResponse, 
  UsersApiParams,
  CursorPaginatedResponse,
  CursorPaginationParams,
  UserFilters
} from "../types/Pagination";

// Admin API to manage users - Legacy offset pagination (deprecated)
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

// Admin API to manage users - Cursor pagination
export const fetchAllUsersWithCursor = async (
  params?: CursorPaginationParams & UserFilters
): Promise<CursorPaginatedResponse<User>> => {
  const queryParams = new URLSearchParams();
  
  // Add cursor pagination parameters
  if (params?.cursor) queryParams.set('cursor', params.cursor);
  if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params?.direction) queryParams.set('direction', params.direction);
  
  // Add filter parameters
  if (params?.role) queryParams.set('role', params.role);
  if (params?.profession) queryParams.set('profession', params.profession);
  
  const res = await axiosInstance.get(`/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`);
  return res.data;
};