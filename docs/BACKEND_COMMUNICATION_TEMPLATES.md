# Quick Backend Communication Template

## Email/Slack Message Template

```
Subject: Frontend Pagination Cleanup - API Usage Update

Hi Backend Team,

We just completed a frontend pagination cleanup that removed unused legacy APIs. 

TL;DR: 
✅ Keep these APIs: /events, /events/me/*, /admin/users, /events/archived  
❌ Remove these: /events/admin (doesn't exist anyway)
🔍 Check usage: /events/location/external

**ACTIVE APIs we're using:**

Main app (cursor pagination):
- GET /events (cursor=..., page_size=...)
- GET /events/me/created (cursor pagination)  
- GET /events/me/rsvped (cursor pagination)
- GET /events/me/organized (cursor pagination)
- GET /events/me/moderated (cursor pagination)
- GET /events/location/nearby (cursor pagination)

Admin dashboard (offset pagination):
- GET /events (page=1, page_size=12)
- GET /admin/users (page=1, page_size=12)
- GET /events/archived (page=1, page_size=12)

**APIs we REMOVED from frontend:**
- GET /events/admin (this API doesn't exist - we fixed it)
- Any offset-only versions of /events/me/* APIs (if you have separate endpoints)

Questions:
1. Can you confirm /events/admin was never implemented?
2. Is /events/location/external used by anyone else?
3. Do you have separate endpoints for cursor vs offset, or does the same endpoint handle both?

Full details: docs/BACKEND_API_USAGE_REPORT.md

Thanks!
Frontend Team
```

## Slack Thread Template

```
🧹 Pagination cleanup complete! 

We removed 8+ unused API calls from the frontend. Here's what the backend should know:

**Still using these APIs** ✅
• Main app: cursor pagination on /events, /events/me/*, /events/location/nearby
• Admin: offset pagination on /events, /admin/users, /events/archived

**No longer calling** ❌  
• /events/admin (this API doesn't exist anyway)
• Legacy offset versions of user event APIs (if separate from cursor)

**Need confirmation** 🤔
• Is /events/location/external used by other clients?
• Do you have separate endpoints for cursor vs offset pagination?

Full report: docs/BACKEND_API_USAGE_REPORT.md

@backend-team thoughts?
```

## Teams/Discord Template

```
**Frontend Pagination Update** 📊

Just cleaned up our API calls - removed unused pagination logic.

**What backend needs to know:**
🟢 **Keep supporting:** /events, /events/me/*, /admin/users, /events/archived
🔴 **Can remove:** /events/admin (doesn't exist), unused offset-only endpoints  
🟡 **Please check:** /events/location/external usage

**Architecture now:**
- User pages → cursor pagination (infinite scroll)
- Admin pages → offset pagination (traditional pages)

Details in `docs/BACKEND_API_USAGE_REPORT.md`

Any questions? 👆
```
