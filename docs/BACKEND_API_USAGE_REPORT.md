# Backend API Usage Report - Pagination Methods

**To: Backend Team**  
**From: Frontend Team**  
**Date: July 18, 2025**  
**Subject: Active API Usage After Frontend Pagination Cleanup**

## Executive Summary

The frontend has completed a pagination cleanup that removed unused legacy APIs. This document details which backend APIs are **actively used** vs which can be **safely deprecated/removed** from the backend.

## 🟢 ACTIVELY USED APIs (Keep These)

### Cursor-Based Pagination APIs (Main User Experience)

These APIs power the main user-facing pages with infinite scroll:

| API Endpoint | Frontend Usage | Component | Pagination Type |
|-------------|----------------|-----------|-----------------|
| `GET /events` | ✅ ACTIVE | EventsPage | Cursor (`?cursor=...&page_size=...`) |
| `GET /events/location/nearby` | ✅ ACTIVE | NearbyEventsPage | Cursor (`?city=...&state=...&cursor=...`) |
| `GET /events/me/created` | ✅ ACTIVE | MyEventsPage | Cursor (`?cursor=...&page_size=...`) |
| `GET /events/me/rsvped` | ✅ ACTIVE | MyEventsPage | Cursor (`?cursor=...&page_size=...`) |
| `GET /events/me/organized` | ✅ ACTIVE | MyEventsPage | Cursor (`?cursor=...&page_size=...`) |
| `GET /events/me/moderated` | ✅ ACTIVE | MyEventsPage | Cursor (`?cursor=...&page_size=...`) |

### Offset/Limit Pagination APIs (Admin Interface)

These APIs power the admin dashboard with traditional pagination:

| API Endpoint | Frontend Usage | Component | Pagination Type |
|-------------|----------------|-----------|-----------------|
| `GET /events` | ✅ ACTIVE | Admin ManageEvents | Offset (`?page=1&page_size=12`) |
| `GET /admin/users` | ✅ ACTIVE | Admin ManageUsers | Offset (`?page=1&page_size=12`) |
| `GET /events/archived` | ✅ ACTIVE | Admin ManageEvents | Offset (`?page=1&page_size=12`) |

## 🔴 UNUSED APIs (Can Be Deprecated/Removed)

### Never Implemented or Non-Existent

| API Endpoint | Status | Reason |
|-------------|--------|---------|
| `GET /events/admin` | ❌ DOESN'T EXIST | Frontend was calling non-existent API |
| `GET /events/location/external` | ❓ UNKNOWN | Frontend removed all usage, check if used elsewhere |

### Legacy Offset/Limit APIs (If Separate from Cursor)

If your backend has separate endpoints for offset vs cursor pagination, these offset versions are unused:

| API Endpoint | Status | Reason |
|-------------|--------|---------|
| `GET /events/me/created` (offset-only) | ❌ UNUSED | Frontend only uses cursor version |
| `GET /events/me/rsvped` (offset-only) | ❌ UNUSED | Frontend only uses cursor version |
| `GET /events/me/organized` (offset-only) | ❌ UNUSED | Frontend only uses cursor version |
| `GET /events/me/moderated` (offset-only) | ❌ UNUSED | Frontend only uses cursor version |
| `GET /events/location/nearby` (offset-only) | ❌ UNUSED | Frontend only uses cursor version |

## 📋 Required API Response Formats

### Cursor-Based Response Format (Required)

```json
{
  "items": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzfQ==",
    "prev_cursor": "eyJpZCI6OTk=",
    "has_next": true,
    "has_previous": false,
    "page_size": 12,
    "total_count": 150
  }
}
```

### Offset-Based Response Format (Required)

```json
{
  "items": [...],
  "total_count": 150,
  "page": 1,
  "page_size": 12,
  "total_pages": 13,
  "has_next": true,
  "has_previous": false
}
```

## 🔄 API Parameter Requirements

### Cursor Pagination Parameters

- `cursor` (string, optional) - Base64 encoded cursor for pagination
- `page_size` (number, optional) - Number of items per page (default: 12)
- `direction` (string, optional) - "next" or "prev" for navigation

### Offset Pagination Parameters  

- `page` (number, optional) - Page number (default: 1)
- `page_size` (number, optional) - Number of items per page (default: 12)

### Filter Parameters (Both Types)

- `city` (string, optional)
- `state` (string, optional)
- `category` (string, optional)
- `is_online` (boolean, optional)
- `creator_email` (string, optional)
- `start_date` (string, optional)
- `end_date` (string, optional)

## 🎯 Backend Action Items

### High Priority

1. ✅ **Ensure cursor pagination works** for all main user APIs
2. ✅ **Ensure offset pagination works** for admin APIs
3. ❌ **Remove `/events/admin` references** (API doesn't exist)

### Medium Priority  

4. 🔍 **Audit `/events/location/external`** - Check if used by other clients
5. 🗑️ **Consider deprecating unused offset-only versions** of user event APIs

### Low Priority

6. 📊 **Monitor API usage** to confirm these patterns
7. 🚀 **Optimize cursor pagination performance** for main user flows

## 🔧 Implementation Notes

### Single Endpoint Supporting Both Methods

If your backend uses the same endpoint for both cursor and offset pagination (detecting by query parameters), then you only need to ensure both parameter sets work correctly on these endpoints:

**Dual Support Required:**

- `GET /events` - Must support both cursor AND offset parameters
- `GET /events/me/*` - Must support both cursor AND offset parameters  
- `GET /events/location/nearby` - Must support both cursor AND offset parameters

**Offset Only:**

- `GET /admin/users` - Only needs offset pagination
- `GET /events/archived` - Only needs offset pagination

## 📞 Questions for Backend Team

1. **Do you have separate endpoints for cursor vs offset pagination?**
2. **Is `/events/location/external` used by any other clients?**
3. **Can you confirm `/events/admin` was never implemented?**
4. **Are there any other pagination-related endpoints we should be aware of?**
5. **What's the performance impact of cursor vs offset pagination on your side?**

## 📈 Traffic Expectations

Based on our frontend architecture:

**High Traffic (Cursor APIs):**

- `GET /events` - Main events browsing
- `GET /events/me/*` - User's personal event lists

**Medium Traffic (Offset APIs):**  

- `GET /admin/users` - Admin usage only
- `GET /events/archived` - Admin usage only

**Low Traffic:**

- `GET /events/location/nearby` - Location-based feature

---

**Contact:** Frontend Team  
**Next Review:** After backend confirms API status
