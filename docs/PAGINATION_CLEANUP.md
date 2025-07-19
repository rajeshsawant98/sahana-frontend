# Technical Debt Cleanup - Pagination APIs

## Summary of Changes

This cleanup removed unused legacy pagination logic to reduce technical debt and simplify the codebase.

## 🗑️ Removed APIs (8 functions)

### From `eventsAPI.ts`

1. ❌ `fetchExternalEventsByLocation()` - Legacy offset/limit pagination
2. ❌ `fetchExternalEventsByLocationWithCursor()` - Unused cursor pagination
3. ❌ `fetchNearbyEventsByLocation()` - Legacy offset/limit pagination
4. ❌ `fetchCreatedEvents()` - Legacy offset/limit pagination
5. ❌ `fetchRSVPedEvents()` - Legacy offset/limit pagination
6. ❌ `fetchOrganizedEvents()` - Legacy offset/limit pagination
7. ❌ `fetchModeratedEvents()` - Legacy offset/limit pagination
8. ❌ `fetchAllAdminEvents()` - Backend API doesn't exist
9. ❌ `fetchAllAdminEventsWithCursor()` - Unused cursor pagination

## 🗑️ Removed Types (2 interfaces)

### From `Pagination.ts`

1. ❌ `LocationEventsApiParams` - Only used by removed legacy APIs
2. ❌ `CursorUsersApiParams` - No cursor-based user pagination needed

## 🗑️ Removed Cache Keys (6 functions)

### From `cacheUtils.ts`

1. ❌ `nearbyEvents()` - Legacy offset/limit cache
2. ❌ `userCreatedEvents()` - Legacy offset/limit cache
3. ❌ `userRSVPedEvents()` - Legacy offset/limit cache  
4. ❌ `userOrganizedEvents()` - Legacy offset/limit cache
5. ❌ `userModeratedEvents()` - Legacy offset/limit cache
6. ❌ `adminEvents()` - Backend API doesn't exist

## ✅ Kept APIs (Actively Used)

### Cursor-Based Pagination (User-Facing Pages)

- `fetchAllPublicEventsWithCursor()` → **EventsPage**
- `fetchNearbyEventsByLocationWithCursor()` → **NearbyEventsPage**
- `fetchCreatedEventsWithCursor()` → **MyEventsPage**
- `fetchRSVPedEventsWithCursor()` → **MyEventsPage**
- `fetchOrganizedEventsWithCursor()` → **MyEventsPage**
- `fetchModeratedEventsWithCursor()` → **MyEventsPage**

### Offset/Limit Pagination (Admin Pages)

- `fetchAllPublicEvents()` → **ManageEvents** (Admin)
- `fetchAllUsers()` → **ManageUsers** (Admin)
- `fetchAllAdminArchivedEvents()` → **ManageEvents** (Admin)

## ✅ Kept Types (Actively Used)

### From `Pagination.ts`

- `PaginationParams` - Used by admin pages
- `CursorPaginationParams` - Used by main app
- `PaginatedResponse<T>` - Used by admin pages
- `CursorPaginatedResponse<T>` - Used by main app
- `EventsApiParams` - Used by admin events
- `UsersApiParams` - Used by admin users
- `CursorEventsApiParams` - Used by main events
- `CursorLocationEventsApiParams` - Used by nearby events

## ✅ Kept Cache Keys (Actively Used)

### From `cacheUtils.ts`

- `events()` - Admin events pagination
- `cursorEvents()` - Main events infinite scroll
- `cursorNearbyEvents()` - Nearby events infinite scroll
- `cursorUserCreatedEvents()` - User created events
- `cursorUserRSVPedEvents()` - User RSVP events
- `cursorUserOrganizedEvents()` - User organized events
- `cursorUserModeratedEvents()` - User moderated events
- `adminUsers()` - Admin users pagination

## Benefits

✅ **Reduced Bundle Size**: Removed ~8 unused API functions and associated types
✅ **Simplified Codebase**: Clear separation between cursor (main app) and offset (admin) pagination
✅ **Eliminated Dead Code**: No more unused imports or functions
✅ **Improved Maintainability**: Easier to understand which pagination methods are actually used
✅ **Consistent Architecture**:

- Main app uses cursor pagination with infinite scroll
- Admin pages use offset pagination with traditional page controls

## Final Architecture

```
USER-FACING PAGES (Infinite Scroll)
├── EventsPage → fetchAllPublicEventsWithCursor
├── NearbyEventsPage → fetchNearbyEventsByLocationWithCursor  
└── MyEventsPage → fetch*EventsWithCursor (4 variants)

ADMIN PAGES (Traditional Pagination)
├── ManageEvents → fetchAllPublicEvents + fetchAllAdminArchivedEvents
└── ManageUsers → fetchAllUsers
```

## No Breaking Changes

All actively used components continue to work exactly as before. This was purely a cleanup of unused code.
