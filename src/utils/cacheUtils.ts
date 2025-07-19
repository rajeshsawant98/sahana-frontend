// Cache utilities for pagination data
import { Event } from '../types/Event';
import { User } from '../types/User';
import { EventFilters, UserFilters } from '../types/Pagination';

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  EVENTS: 5 * 60 * 1000, // 5 minutes for events
  USER_EVENTS: 10 * 60 * 1000, // 10 minutes for user events
  NEARBY_EVENTS: 3 * 60 * 1000, // 3 minutes for nearby events
  ADMIN_DATA: 5 * 60 * 1000, // 5 minutes for admin data
};

// Generic cache entry structure
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Paginated cache data structure
export interface PaginatedCacheData<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Cache key generators
export const createCacheKey = {
  // ACTIVELY USED: Admin offset/limit pagination
  events: (page: number, pageSize: number, filters: EventFilters): string => {
    const filterStr = JSON.stringify(filters);
    return `events_${page}_${pageSize}_${btoa(filterStr)}`;
  },
  
  // ACTIVELY USED: Main app cursor-based pagination
  cursorEvents: (cursor: string | null, pageSize: number, filters: EventFilters): string => {
    const filterStr = JSON.stringify(filters);
    return `cursor_events_${cursor || 'initial'}_${pageSize}_${btoa(filterStr)}`;
  },
  
  // ACTIVELY USED: Nearby events cursor pagination
  cursorNearbyEvents: (cursor: string | null, city: string, state: string, pageSize: number): string => {
    return `cursor_nearby_${city}_${state}_${cursor || 'initial'}_${pageSize}`;
  },
  
  // ACTIVELY USED: User events cursor pagination
  cursorUserCreatedEvents: (cursor: string | null, pageSize: number): string => {
    return `cursor_user_created_${cursor || 'initial'}_${pageSize}`;
  },
  
  cursorUserRSVPedEvents: (cursor: string | null, pageSize: number): string => {
    return `cursor_user_rsvped_${cursor || 'initial'}_${pageSize}`;
  },
  
  cursorUserOrganizedEvents: (cursor: string | null, pageSize: number): string => {
    return `cursor_user_organized_${cursor || 'initial'}_${pageSize}`;
  },
  
  cursorUserModeratedEvents: (cursor: string | null, pageSize: number): string => {
    return `cursor_user_moderated_${cursor || 'initial'}_${pageSize}`;
  },
  
  // ACTIVELY USED: Admin pages
  adminUsers: (page: number, pageSize: number, filters: UserFilters): string => {
    const filterStr = JSON.stringify(filters);
    return `admin_users_${page}_${pageSize}_${btoa(filterStr)}`;
  },

  // REMOVED UNUSED CACHE KEYS:
  // - nearbyEvents (legacy offset/limit)
  // - userCreatedEvents, userRSVPedEvents, userOrganizedEvents, userModeratedEvents (legacy offset/limit)
  // - adminEvents (API doesn't exist in backend)
};

// In-memory cache with automatic cleanup
class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: number;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  set<T>(key: string, data: T, ttl: number): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  invalidate(keyPattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    });
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.cache.delete(key));
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }

  // Get cache statistics for debugging
  getStats(): { totalEntries: number; expiredEntries: number } {
    const now = Date.now();
    let expiredCount = 0;
    
    this.cache.forEach(entry => {
      if (now > entry.expiresAt) {
        expiredCount++;
      }
    });
    
    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
    };
  }
}

// Global cache instance
export const cacheManager = new CacheManager();

// Cache invalidation helpers
export const invalidateCache = {
  // Invalidate when events are created, updated, or deleted
  events: () => {
    cacheManager.invalidate('events_');
    cacheManager.invalidate('nearby_');
    cacheManager.invalidate('admin_events_');
  },
  
  // Invalidate cursor-based events cache
  cursorEvents: () => {
    cacheManager.invalidate('cursor_events_');
  },
  
  // Invalidate when user events change (RSVP, create, etc.)
  userEvents: () => {
    cacheManager.invalidate('user_created_');
    cacheManager.invalidate('user_rsvped_');
    cacheManager.invalidate('user_organized_');
    cacheManager.invalidate('user_moderated_');
  },
  
  // Invalidate cursor-based user events cache
  cursorUserEvents: () => {
    cacheManager.invalidate('cursor_user_created_');
    cacheManager.invalidate('cursor_user_rsvped_');
    cacheManager.invalidate('cursor_user_organized_');
    cacheManager.invalidate('cursor_user_moderated_');
  },
  
  // Invalidate nearby events for specific location
  nearbyEvents: (city?: string, state?: string) => {
    if (city && state) {
      cacheManager.invalidate(`nearby_${city}_${state}_`);
    } else {
      cacheManager.invalidate('nearby_');
    }
  },
  
  // Invalidate cursor-based nearby events cache
  cursorNearbyEvents: () => {
    cacheManager.invalidate('cursor_nearby_');
  },
  
  // Invalidate admin data
  adminUsers: () => {
    cacheManager.invalidate('admin_users_');
  },
  
  adminEvents: () => {
    cacheManager.invalidate('admin_events_');
  },
  
  // Invalidate friends data
  friends: () => {
    cacheManager.invalidate('friends_');
  },
  
  // Invalidate friend requests
  friendRequests: () => {
    cacheManager.invalidate('friend_requests_');
  },
  
  // Invalidate user search results
  userSearch: () => {
    cacheManager.invalidate('user_search_');
  },
  
  // Invalidate user profiles
  userProfiles: () => {
    cacheManager.invalidate('user_profile_');
    cacheManager.invalidate('friendship_status_');
  },
  
  // Clear all cache
  all: () => {
    cacheManager.invalidateAll();
  },
};

// Cache helper for paginated API responses
export const getCachedData = <T>(
  cacheKey: string,
  fetchFunction: () => Promise<PaginatedCacheData<T>>,
  ttl: number
): Promise<PaginatedCacheData<T>> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Try to get from cache first
      const cached = cacheManager.get<PaginatedCacheData<T>>(cacheKey);
      if (cached) {
        resolve(cached);
        return;
      }
      
      // If not in cache, fetch from API
      const data = await fetchFunction();
      
      // Store in cache
      cacheManager.set(cacheKey, data, ttl);
      
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

// Prefetching helper for better UX
export const prefetchPage = async <T>(
  cacheKey: string,
  fetchFunction: () => Promise<PaginatedCacheData<T>>,
  ttl: number
): Promise<void> => {
  try {
    const cached = cacheManager.get<PaginatedCacheData<T>>(cacheKey);
    if (!cached) {
      const data = await fetchFunction();
      cacheManager.set(cacheKey, data, ttl);
    }
  } catch (error) {
    // Silently fail for prefetching
    console.warn('Prefetch failed:', error);
  }
};
