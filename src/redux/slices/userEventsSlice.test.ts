import { describe, it, expect, vi, beforeEach } from 'vitest';
import rootReducer, { 
  fetchInitialCreatedEvents, 
  resetUserEvents, 
  addCreatedEventLocal 
} from './userEventsSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as eventsAPI from '../../apis/eventsAPI';

// Mock the API
vi.mock('../../apis/eventsAPI', () => ({
  fetchCreatedEventsWithCursor: vi.fn(),
  fetchRSVPedEventsWithCursor: vi.fn(),
  fetchOrganizedEventsWithCursor: vi.fn(),
  fetchModeratedEventsWithCursor: vi.fn(),
  fetchInterestedEventsWithCursor: vi.fn(),
}));

describe('userEventsSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    });
    vi.clearAllMocks();
  });

  it('should handle initial state', () => {
    const state = store.getState();
    expect(state.created.events).toEqual([]);
    expect(state.created.loading).toBe(false);
    expect(state.rsvped.events).toEqual([]);
  });

  it('should handle fetchInitialCreatedEvents.pending', () => {
    store.dispatch(fetchInitialCreatedEvents.pending('', { page_size: 10 }));
    const state = store.getState();
    expect(state.created.loading).toBe(true);
  });

  it('should handle fetchInitialCreatedEvents.fulfilled', async () => {
    const mockResponse = {
      items: [{ eventId: '1', name: 'Test Event' }],
      pagination: {
        next_cursor: 'next',
        prev_cursor: 'prev',
        has_next: true,
        has_previous: false,
        page_size: 10,
        total_count: 1,
      },
    };

    (eventsAPI.fetchCreatedEventsWithCursor as any).mockResolvedValue(mockResponse);

    await store.dispatch(fetchInitialCreatedEvents({ page_size: 10 }));

    const state = store.getState();
    expect(state.created.loading).toBe(false);
    expect(state.created.events).toHaveLength(1);
    expect(state.created.events[0].eventId).toBe('1');
    expect(state.created.totalCount).toBe(1);
  });

  it('should handle addCreatedEventLocal', () => {
    const newEvent = { eventId: '2', name: 'New Event' } as any;
    store.dispatch(addCreatedEventLocal(newEvent));
    const state = store.getState();
    expect(state.created.events).toContainEqual(newEvent);
  });

  it('should handle resetUserEvents', () => {
    // First modify state
    const newEvent = { eventId: '2', name: 'New Event' } as any;
    store.dispatch(addCreatedEventLocal(newEvent));
    
    // Then reset
    store.dispatch(resetUserEvents());
    const state = store.getState();
    expect(state.created.events).toEqual([]);
  });
});
