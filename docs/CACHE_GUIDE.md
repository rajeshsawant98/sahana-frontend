# Cache Guide - Developer Handbook

## Overview

This guide provides practical instructions for working with the caching system in the Sahana Frontend application. It covers common use cases, best practices, and troubleshooting tips for developers.

## Using getCachedData()

### Basic Usage

The `getCachedData()` function is the core of our caching system. It checks for cached data first, then falls back to an API call if needed.

```typescript
import { getCachedData, createCacheKey, CACHE_TTL } from '../utils/cacheUtils';

const fetchMyData = async (params) => {
  const cacheKey = createCacheKey.events(params.page, params.pageSize, params.filters);
  
  const data = await getCachedData(
    cacheKey,
    async () => {
      // This function only runs if cache miss
      const response = await myAPI.fetchData(params);
      return response.data;
    },
    CACHE_TTL.EVENTS
  );
  
  return data;
};
```

### In Redux Async Thunks

```typescript
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params: EventsApiParams) => {
    const cacheKey = createCacheKey.events(params.page, params.pageSize, params);
    
    const cachedData = await getCachedData<Event>(
      cacheKey,
      async () => {
        const response = await fetchEventsAPI(params);
        // Transform API response to cache format
        return {
          items: response.items,
          totalCount: response.total_count,
          page: response.page,
          // ... other pagination data
        };
      },
      CACHE_TTL.EVENTS
    );
    
    return cachedData;
  }
);
```

### Custom Cache Keys

For complex data with multiple parameters:

```typescript
// For filtered data
const cacheKey = createCacheKey.events(
  page, 
  pageSize, 
  { category: 'tech', location: 'Phoenix', date: '2025-01-01' }
);

// For user-specific data
const cacheKey = createCacheKey.userEvents(userId, 'created', page, pageSize);

// For location-based data
const cacheKey = createCacheKey.nearbyEvents('Phoenix', 'AZ', page, pageSize);
```

## TTL Best Practices

### Understanding TTL Values

TTL (Time To Live) determines how long data stays in cache before expiring:

```typescript
export const CACHE_TTL = {
  EVENTS: 5 * 60 * 1000,        // 5 minutes - moderate freshness
  USER_EVENTS: 10 * 60 * 1000,  // 10 minutes - user data changes less
  NEARBY_EVENTS: 3 * 60 * 1000, // 3 minutes - location data changes more
  ADMIN_DATA: 5 * 60 * 1000,    // 5 minutes - admin views
};
```

### Choosing the Right TTL

| Data Type | TTL | Reasoning |
|-----------|-----|-----------|
| **Public Events** | 5 minutes | Balance between freshness and performance |
| **User Events** | 10 minutes | User's own data changes less frequently |
| **Nearby Events** | 3 minutes | Location-based data can change quickly |
| **Search Results** | 2 minutes | Search results should be fresh |
| **User Profile** | 15 minutes | Profile data changes rarely |
| **Admin Data** | 5 minutes | Admin needs relatively fresh data |

### Custom TTL for Special Cases

```typescript
// Short TTL for real-time data
const realtimeData = await getCachedData(
  cacheKey,
  fetchRealtimeAPI,
  30 * 1000 // 30 seconds
);

// Long TTL for static data
const staticData = await getCachedData(
  cacheKey,
  fetchStaticAPI,
  60 * 60 * 1000 // 1 hour
);

// No caching (TTL = 0)
const alwaysFresh = await getCachedData(
  cacheKey,
  fetchAPI,
  0 // Always fetch from API
);
```

## Cache Invalidation Strategies

### Using the Hook in Components

```typescript
import { useCacheInvalidation } from '../hooks/useCacheInvalidation';

const MyComponent = () => {
  const {
    invalidateEvents,
    invalidateUserEvents,
    invalidateNearbyEvents,
    invalidateAll
  } = useCacheInvalidation();
  
  // ... component logic
};
```

### When to Use Each Method

#### `invalidateEvents()` - Public Events

**Use when:**

- Creating a new public event
- Editing event details that affect listings
- Admin actions on events

```typescript
const handleCreateEvent = async (eventData) => {
  await createEvent(eventData);
  invalidateEvents(); // Clear public events cache
};
```

#### `invalidateUserEvents()` - User-Specific Events

**Use when:**

- User RSVPs to an event
- User creates/edits their own events
- User's event participation changes

```typescript
const handleRSVP = async (eventId) => {
  await rsvpToEvent(eventId);
  invalidateUserEvents(); // Clear user's events cache
  // Note: May also want to invalidate public events if RSVP affects listings
};
```

#### `invalidateNearbyEvents(city?, state?)` - Location-Based Events

**Use when:**

- Creating events in specific locations
- User changes location
- Location-specific filters change

```typescript
const handleCreateEventInPhoenix = async (eventData) => {
  await createEvent(eventData);
  invalidateNearbyEvents('Phoenix', 'AZ'); // Clear Phoenix events only
  invalidateEvents(); // Also clear general events cache
};

// Clear all nearby events
invalidateNearbyEvents(); // No parameters = clear all locations
```

#### `invalidateAll()` - Nuclear Option

**Use when:**

- User logs out
- Major data changes that affect everything
- Error recovery scenarios
- Development testing

```typescript
const handleLogout = () => {
  logout();
  invalidateAll(); // Clear all cached data
};
```

### Advanced Invalidation Patterns

```typescript
// Selective invalidation for efficiency
const handleEventEdit = async (eventId, changes) => {
  await updateEvent(eventId, changes);
  
  if (changes.category || changes.location) {
    // Location/category changed - clear all event caches
    invalidateEvents();
    invalidateNearbyEvents();
  } else {
    // Minor changes - just clear user events
    invalidateUserEvents();
  }
};

// Batch invalidation for multiple operations
const handleBulkActions = async (actions) => {
  await Promise.all(actions);
  
  // Invalidate once after all operations
  invalidateEvents();
  invalidateUserEvents();
};
```

## Development and Testing

### Disabling Cache for Testing

#### Method 1: Environment Variable

```typescript
// In your component or API file
const useCache = import.meta.env.VITE_ENABLE_CACHE !== 'false';

const data = useCache 
  ? await getCachedData(cacheKey, apiCall, ttl)
  : await apiCall();
```

#### Method 2: TTL = 0 (Always Fresh)

```typescript
// Force fresh data by setting TTL to 0
const data = await getCachedData(
  cacheKey,
  apiCall,
  0 // Always bypass cache
);
```

#### Method 3: Conditional Caching

```typescript
const CACHE_TTL_DEV = {
  EVENTS: import.meta.env.DEV ? 0 : 5 * 60 * 1000,
  USER_EVENTS: import.meta.env.DEV ? 0 : 10 * 60 * 1000,
};
```

### Testing Cache Behavior

#### Manual Testing with Dev Tools

```typescript
// Access cache manager in browser console (dev only)
window.cacheManager = cacheManager;

// Check cache contents
console.log(cacheManager.getAll());

// Clear specific cache
cacheManager.delete('events_1_12_*');

// Get cache statistics
console.log(cacheManager.getStats());
```

#### Unit Testing Cache Logic

```typescript
// Mock the cache for testing
jest.mock('../utils/cacheUtils', () => ({
  getCachedData: jest.fn().mockImplementation((key, apiCall) => apiCall()),
  invalidateCache: {
    events: jest.fn(),
    userEvents: jest.fn(),
    all: jest.fn(),
  }
}));

// Test that API is called when cache is disabled
it('should call API when cache disabled', async () => {
  const mockAPI = jest.fn().mockResolvedValue(mockData);
  
  const result = await getCachedData('test-key', mockAPI, 0);
  
  expect(mockAPI).toHaveBeenCalled();
  expect(result).toEqual(mockData);
});
```

### Cache Status Component (Development Only)

**Features:**

- Real-time cache statistics
- Manual cache invalidation buttons
- Cache entry inspection
- Performance monitoring

**Accessing:**

1. Run `npm run dev`
2. Look for the "Cache Status" accordion in bottom-left
3. Expand to see cache controls and statistics
4. Look for the "Cache Status" accordion in bottom-left
5. Expand to see cache controls and statistics

### Debugging Cache Issues

#### Common Problems and Solutions

**Problem:** Data not updating after changes

```typescript
// Solution: Check if proper invalidation is called
const handleDataChange = async () => {
  await updateData();
  // Make sure to invalidate relevant cache
  invalidateUserEvents();
};
```

**Problem:** Cache not working (always hitting API)

```typescript
// Check cache key consistency
const key1 = createCacheKey.events(1, 12, { category: 'tech' });
````typescript
// Check cache cleanup is running
console.log(cacheManager.getStats());
// Expired entries should be cleaned up automatically

// Manual cleanup if needed
cacheManager.cleanup();
````markdown
// Check cache cleanup is running
console.log(cacheManager.getStats());
// Expired entries should be cleaned up automatically

// Manual cleanup if needed
cacheManager.cleanup();

#### Debug Logging

```typescript
// Enable cache logging in development
const getCachedDataWithLogging = async (key, apiCall, ttl) => {
  console.log(`Cache check for key: ${key}`);
  
  const result = await getCachedData(key, apiCall, ttl);
  
  console.log(`Cache ${cacheManager.has(key) ? 'HIT' : 'MISS'} for ${key}`);
  return result;
};
```

const getCachedDataWithLogging = async (key, apiCall, ttl) => {
  console.log(`Cache check for key: ${key}`);
  
  const result = await getCachedData(key, apiCall, ttl);
  
  console.log(`Cache ${cacheManager.has(key) ? 'HIT' : 'MISS'} for ${key}`);
  return result;
};

## Performance Monitoring

### Measuring Cache Effectiveness

```typescript
// Track cache hit ratio
const cacheMetrics = {
  hits: 0,
  misses: 0,
  
  recordHit() { this.hits++; },
  recordMiss() { this.misses++; },
  
  getHitRatio() {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }
};

// Log cache performance
setInterval(() => {
  if (import.meta.env.DEV) {
    console.log('Cache Hit Ratio:', cacheMetrics.getHitRatio().toFixed(1) + '%');
  }
}, 30000); // Every 30 seconds
```

### Performance Best Practices

1. **Monitor cache hit ratio** - aim for 60%+ hit rate
2. **Adjust TTL based on usage patterns** - longer for stable data
3. **Use specific invalidation** - avoid `invalidateAll()` unless necessary
4. **Prefetch strategically** - next page, related data
5. **Clean up regularly** - expired entries consume memory

## Quick Reference

### Common Cache Operations

```typescript
// Import what you need
import { 
  getCachedData, 
  createCacheKey, 
  CACHE_TTL, 
  invalidateCache 
} from '../utils/cacheUtils';
import { useCacheInvalidation } from '../hooks/useCacheInvalidation';
import { useFriendsCacheInvalidation } from '../hooks/useFriendsCacheInvalidation';

// Basic caching
const data = await getCachedData(key, apiCall, CACHE_TTL.EVENTS);

// Invalidate in components
const { invalidateEvents } = useCacheInvalidation();
invalidateEvents();

// Friends-specific invalidation
const { invalidateFriends, invalidateFriendRequests } = useFriendsCacheInvalidation();
invalidateFriends();
invalidateFriendRequests();

// Manual invalidation
invalidateCache.events();
invalidateCache.friends();
invalidateCache.friendRequests();
invalidateCache.all();

// Create cache keys
const key = createCacheKey.events(page, pageSize, filters);
```

### Environment Checks

```typescript
// Development only features
if (import.meta.env.DEV) {
  // Development code here
}

// Production optimizations
if (import.meta.env.PROD) {
  // Production code here
}
```

This guide covers the essential patterns for working with the caching system. For more detailed implementation examples, refer to the existing Redux slices and the technical documentation in `CACHING_IMPLEMENTATION.md`.
