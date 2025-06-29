# Event Archive Frontend Implementation

This implementation provides a complete event archive system for the Sahana Events frontend application. Users can archive their events, view archived events, and restore them when needed. Admin users have additional capabilities for bulk archiving.

## Features Implemented

### 1. Archive Types & API Integration

- ✅ Extended Event interface with archive fields (`isArchived`, `archivedAt`, `archivedBy`, `archiveReason`)
- ✅ Added archive-related type definitions (`ArchiveEventRequest`, `ArchiveEventResponse`, etc.)
- ✅ Implemented API functions for archiving, unarchiving, and fetching archived events
- ✅ Added bulk archive functionality for admin users

### 2. User Interface Components

#### ArchiveEventButton Component

- ✅ Displays archive/unarchive button based on event status
- ✅ Shows confirmation dialog with reason input for archiving
- ✅ Handles loading states and error display
- ✅ Supports different button sizes and variants

#### ArchivedEventsView Component

- ✅ Lists all user's archived events
- ✅ Shows archive metadata (reason, date, archived by)
- ✅ Provides unarchive functionality
- ✅ Uses visual indicators (opacity, chips) to distinguish archived events

#### BulkArchiveButton Component (Admin Only)

- ✅ Allows admin users to archive all past events
- ✅ Shows confirmation dialog with warning about system-wide impact
- ✅ Handles success feedback

### 3. Updated MyEvents Page

- ✅ Added "Archived" tab with Archive icon
- ✅ Shows archive buttons on created events
- ✅ Added success handlers to refresh data after archive operations

### 4. Enhanced Admin Panel

- ✅ Integrated bulk archive button in admin ManageEvents page
- ✅ Added **"Archived Events"** tab to view all system-wide archived events
- ✅ Added archive status column to events table
- ✅ Visual indicators for archived events in admin view
- ✅ Admin-only bulk archive functionality with proper placement
- ✅ Separate views for active vs archived events with dedicated tabs

### 5. Enhanced EventCard Component

- ✅ Visual indicators for archived events (reduced opacity, warning chip)
- ✅ Archive/unarchive buttons for event creators
- ✅ Improved layout to accommodate additional buttons
- ✅ Conditional rendering based on user permissions

### 5. Custom Hook

- ✅ `useEventArchive` hook for reusable archive functionality
- ✅ Centralized error handling and loading states
- ✅ Provides clean API for archive operations

## File Structure

```
src/
├── components/
│   ├── ArchiveEventButton.tsx       # Archive/unarchive button component
│   ├── ArchivedEventsView.tsx       # View for displaying archived events
│   ├── BulkArchiveButton.tsx        # Admin bulk archive component
│   └── cards/
│       └── EventCard.tsx            # Updated with archive functionality
├── hooks/
│   └── useEventArchive.ts           # Custom hook for archive operations
├── types/
│   └── Event.ts                     # Extended with archive types
├── apis/
│   └── eventsAPI.ts                 # Added archive API functions
└── pages/
    ├── MyEvents.tsx                 # Updated with archive tab functionality
    └── admin/
        └── ManageEvents.tsx         # Added bulk archive for admins
```

## Usage Examples

### Archive an Event

```tsx
import { ArchiveEventButton } from '../components/ArchiveEventButton';

<ArchiveEventButton 
  event={event} 
  size="small"
  onArchiveSuccess={() => refreshEvents()}
/>
```

### View Archived Events

```tsx
import { ArchivedEventsView } from '../components/ArchivedEventsView';

<ArchivedEventsView />
```

### Admin Bulk Archive

```tsx
// In admin/ManageEvents.tsx
import { BulkArchiveButton } from '../../components/BulkArchiveButton';

<BulkArchiveButton 
  onBulkArchiveSuccess={(count) => console.log(`Archived ${count} events`)}
/>
```

### Using the Custom Hook

```tsx
import { useEventArchive } from '../hooks/useEventArchive';

const { handleArchiveEvent, loading, errors } = useEventArchive();

const archiveEvent = async () => {
  const result = await handleArchiveEvent(eventId, "Event completed");
  if (result.success) {
    // Handle success
  }
};
```

## Dependencies Added

- `date-fns` - For better date formatting in archived events view

## API Endpoints Expected

The frontend expects these backend endpoints to be available:

- `PATCH /events/:eventId/archive` - Archive an event
- `PATCH /events/:eventId/unarchive` - Unarchive an event
- `GET /events/me/archived` - Get user's archived events
- `GET /events/archived` - Get all archived events (admin only)
- `POST /events/archive/past-events` - Bulk archive past events (admin only)

## Future Enhancements

### Phase 2 Possibilities

- ✅ Search and filter functionality for archived events
- ✅ Pagination for large numbers of archived events
- ✅ Batch archive/unarchive operations
- ✅ Archive reasons dropdown with predefined options
- ✅ Archive statistics and analytics

### Performance Optimizations

- ✅ Implement virtualization for large archive lists
- ✅ Add infinite scrolling for archived events
- ✅ Cache archived events locally
- ✅ Implement optimistic updates

## Testing Notes

1. **Archive Button**: Test with different user roles (creator vs non-creator)
2. **Permissions**: Verify only event creators can archive their events
3. **Admin Functions**: Test bulk archive with admin and non-admin users
4. **Error Handling**: Test with network failures and invalid requests
5. **Visual States**: Verify loading states and error messages display correctly

## Browser Compatibility

The implementation uses modern React patterns and Material-UI components, compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Archive operations use optimistic updates where possible
- Archived events are loaded on-demand (only when archive tab is accessed)
- API calls include proper error handling and retry mechanisms
- Visual feedback prevents multiple simultaneous archive operations
