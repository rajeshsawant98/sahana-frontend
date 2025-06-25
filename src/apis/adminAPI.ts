import axiosInstance from "../utils/axiosInstance";
import { Event } from "../types/Event";
import { User } from "../types/User";


// Admin API to manage users


export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await axiosInstance.get("/admin/users");
  return res.data.users;
};