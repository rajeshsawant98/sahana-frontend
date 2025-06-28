import { 
  FriendProfile, 
  UserSearchResult, 
  FriendRequest, 
  FriendRequestsResponse,
  SendFriendRequestPayload,
  FriendshipStatusResponse,
  FriendsApiParams,
  FriendRequestsApiParams
} from '../types/friends';
import { createCacheKey, CACHE_TTL, cacheManager } from '../utils/cacheUtils';
import axiosInstance from '../utils/axiosInstance';

// Extend CACHE_TTL with friends-specific TTLs
export const FRIENDS_CACHE_TTL = {
  ...CACHE_TTL,
  FRIENDS: 10 * 60 * 1000,      // 10 minutes - friends list changes less frequently
  FRIEND_REQUESTS: 5 * 60 * 1000, // 5 minutes - moderate freshness needed
  USER_SEARCH: 2 * 60 * 1000,    // 2 minutes - search results should be fresh
  USER_PROFILES: 15 * 60 * 1000, // 15 minutes - profile data changes rarely
};

// Extend createCacheKey with friends-specific keys
export const createFriendsCacheKey = {
  ...createCacheKey,
  friends: (userId?: string) => `friends_${userId || 'current'}`,
  friendRequests: (userId?: string) => `friend_requests_${userId || 'current'}`,
  userSearch: (query: string) => `user_search_${query.toLowerCase().trim()}`,
  userProfile: (userId: string) => `user_profile_${userId}`,
  friendshipStatus: (userId: string) => `friendship_status_${userId}`,
};

// Generic cache helper for non-paginated data
const getCachedDataGeneric = async <T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  ttl: number
): Promise<T> => {
  // Try to get from cache first
  const cached = cacheManager.get<T>(cacheKey);
  if (cached) {
    return cached;
  }
  
  // If not in cache, fetch from API
  const data = await fetchFunction();
  
  // Store in cache
  cacheManager.set(cacheKey, data, ttl);
  
  return data;
};

class FriendsApiService {
  // Send friend request
  async sendFriendRequest(payload: SendFriendRequestPayload): Promise<{ message: string; request_id: string }> {
    const response = await axiosInstance.post('/friends/request', payload);
    return response.data;
  }

  // Get friend requests (both sent and received) with caching
  async getFriendRequests(params: FriendRequestsApiParams = {}): Promise<FriendRequestsResponse> {
    const cacheKey = createFriendsCacheKey.friendRequests();
    
    return await getCachedDataGeneric(
      cacheKey,
      async () => {
        const response = await axiosInstance.get('/friends/requests', { params });
        return response.data;
      },
      FRIENDS_CACHE_TTL.FRIEND_REQUESTS
    );
  }

  // Accept friend request
  async acceptFriendRequest(requestId: string): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/friends/accept/${requestId}`);
    return response.data;
  }

  // Reject friend request
  async rejectFriendRequest(requestId: string): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/friends/reject/${requestId}`);
    return response.data;
  }

  // Cancel sent friend request
  async cancelFriendRequest(requestId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/friends/request/${requestId}`);
    return response.data;
  }

  // Get friends list with caching
  async getFriendsList(params: FriendsApiParams = {}): Promise<FriendProfile[]> {
    const cacheKey = createFriendsCacheKey.friends();
    
    return await getCachedDataGeneric(
      cacheKey,
      async () => {
        const response = await axiosInstance.get('/friends/list', { params });
        return response.data;
      },
      FRIENDS_CACHE_TTL.FRIENDS
    );
  }

  // Search users with caching
  async searchUsers(query: string, limit: number = 20): Promise<UserSearchResult[]> {
    if (!query.trim()) return [];
    
    const cacheKey = createFriendsCacheKey.userSearch(query);
    
    return await getCachedDataGeneric(
      cacheKey,
      async () => {
        const response = await axiosInstance.get('/friends/search', {
          params: { q: query, limit }
        });
        return response.data;
      },
      FRIENDS_CACHE_TTL.USER_SEARCH
    );
  }

  // Get friendship status with caching
  async getFriendshipStatus(userId: string): Promise<FriendshipStatusResponse> {
    const cacheKey = createFriendsCacheKey.friendshipStatus(userId);
    
    return await getCachedDataGeneric(
      cacheKey,
      async () => {
        const response = await axiosInstance.get(`/friends/status/${userId}`);
        return response.data;
      },
      FRIENDS_CACHE_TTL.USER_PROFILES
    );
  }

  // Get user profile with caching
  async getUserProfile(userId: string): Promise<FriendProfile> {
    const cacheKey = createFriendsCacheKey.userProfile(userId);
    
    return await getCachedDataGeneric(
      cacheKey,
      async () => {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
      },
      FRIENDS_CACHE_TTL.USER_PROFILES
    );
  }
}

export const friendsAPI = new FriendsApiService();
export default friendsAPI;
