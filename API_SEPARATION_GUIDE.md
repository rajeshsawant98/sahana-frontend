# API Call Separation - Documentation

## Overview
This document outlines the separation of API calls from page components into dedicated API modules for better organization, maintainability, and reusability.

## Files Modified

### New API Files Created:
1. **`src/apis/authAPI.ts`** - Authentication-related API calls
2. **`src/apis/eventsAPI.ts`** - Enhanced with additional event management functions
3. **`src/apis/adminAPI.ts`** - Already existed, minimal changes needed

### Pages/Components Updated:

#### 1. Authentication Related:
- **`src/pages/LoginPage.tsx`**
  - Removed: Direct `axiosInstance.post("/auth/login")` calls
  - Added: `loginUser()` and `loginWithGoogle()` from `authAPI`

- **`src/components/SignUpComponent.tsx`**
  - Removed: Direct `axiosInstance.post("/auth/register")` calls
  - Added: `registerUser()` from `authAPI`

- **`src/pages/UserInterests.tsx`**
  - Removed: Direct `axiosInstance.put("/auth/me/interests")` calls
  - Added: `updateUserInterests()` from `authAPI`

- **`src/pages/ProfilePage.tsx`**
  - Removed: Direct `axiosInstance.put("/auth/me")` calls
  - Added: `updateUserProfile()` from `authAPI`

- **`src/utils/AuthBootstrap.tsx`**
  - Removed: Direct `axiosInstance` calls for auth refresh and user fetch
  - Added: `refreshToken()` and `getCurrentUser()` from `authAPI`

#### 2. Event Related:
- **`src/pages/EventDetails.tsx`**
  - Removed: Direct `axiosInstance.get("/events/{id}")` and `axiosInstance.post("/events/{id}/rsvp")` calls
  - Added: `fetchEventById()` and `rsvpToEvent()` from `eventsAPI`

- **`src/pages/CreateEvent.tsx`**
  - Removed: Direct `axiosInstance.post("/events/new")` and organizer/moderator patch calls
  - Added: `createEvent()`, `updateEventOrganizers()`, `updateEventModerators()` from `eventsAPI`

- **`src/pages/EditEvent.tsx`**
  - Removed: Direct `axiosInstance.get()`, `axiosInstance.put()`, and `axiosInstance.delete()` calls
  - Added: `fetchEventById()`, `updateEvent()`, `deleteEvent()` from `eventsAPI`

- **`src/components/cards/EventCard.tsx`**
  - Removed: Direct `axiosInstance.post("/events/{id}/rsvp")` calls
  - Added: `rsvpToEvent()` from `eventsAPI`

## API Functions Created

### Auth API (`src/apis/authAPI.ts`)
```typescript
- loginUser(data: LoginRequest): Promise<LoginResponse>
- loginWithGoogle(data: GoogleLoginRequest): Promise<LoginResponse>
- registerUser(data: SignUpRequest): Promise<SignUpResponse>
- updateUserInterests(data: UpdateInterestsRequest): Promise<void>
- updateUserProfile(data: Partial<User>): Promise<void>
- getCurrentUser(): Promise<User>
- refreshToken(refreshToken: string): Promise<TokenResponse>
```

### Events API (`src/apis/eventsAPI.ts`)
```typescript
// Existing functions (unchanged):
- fetchExternalEventsByLocation()
- fetchNearbyEventsByLocation()
- fetchCreatedEvents()
- fetchRSVPedEvents()
- cancelRSVP()
- fetchAllPublicEvents()
- fetchAllAdminEvents()

// New functions added:
- fetchEventById(eventId: string): Promise<Event>
- createEvent(eventData: CreateEventRequest): Promise<CreateEventResponse>
- updateEvent(eventId: string, eventData: Partial<CreateEventRequest>): Promise<void>
- deleteEvent(eventId: string): Promise<void>
- rsvpToEvent(eventId: string, data: RSVPRequest): Promise<void>
- updateEventOrganizers(eventId: string, data: UpdateOrganizersRequest): Promise<void>
- updateEventModerators(eventId: string, data: UpdateModeratorsRequest): Promise<void>
```

## Benefits of This Separation

1. **Better Organization**: API calls are now centralized in dedicated modules
2. **Reusability**: API functions can be reused across multiple components
3. **Type Safety**: Proper TypeScript interfaces for all API requests/responses
4. **Maintainability**: Easier to update API endpoints in one place
5. **Testing**: API functions can be easily mocked for unit tests
6. **Error Handling**: Centralized error handling can be implemented
7. **Documentation**: API functions are self-documenting with clear interfaces

## Next Steps

1. Consider adding error handling middleware to API functions
2. Add JSDoc comments to API functions for better documentation
3. Implement request/response logging for debugging
4. Add unit tests for API functions
5. Consider implementing API response caching for performance
6. Add API versioning support if needed

## Files That Still Use axiosInstance Directly

The following files still use `axiosInstance` directly but should be acceptable:
- `src/utils/axiosInstance.ts` - The axios instance configuration itself
- Any admin-specific pages that haven't been updated yet

All user-facing pages and components now use the proper API abstraction layer.
