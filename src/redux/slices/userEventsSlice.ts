import { combineReducers, UnknownAction } from "@reduxjs/toolkit";
import { createEventSlice } from "./eventSliceFactory";
import {
  fetchCreatedEventsWithCursor,
  fetchRSVPedEventsWithCursor,
  fetchOrganizedEventsWithCursor,
  fetchModeratedEventsWithCursor,
  fetchInterestedEventsWithCursor,
} from "../../apis/eventsAPI";

// Created Events
const created = createEventSlice({
  name: "userEvents/created",
  fetchInitial: (params) => fetchCreatedEventsWithCursor({ ...params, cursor: undefined }),
  fetchMore: fetchCreatedEventsWithCursor,
});

// RSVPed Events
const rsvped = createEventSlice({
  name: "userEvents/rsvped",
  fetchInitial: (params) => fetchRSVPedEventsWithCursor({ ...params, cursor: undefined }),
  fetchMore: fetchRSVPedEventsWithCursor,
});

// Organized Events
const organized = createEventSlice({
  name: "userEvents/organized",
  fetchInitial: (params) => fetchOrganizedEventsWithCursor({ ...params, cursor: undefined }),
  fetchMore: fetchOrganizedEventsWithCursor,
});

// Moderated Events
const moderated = createEventSlice({
  name: "userEvents/moderated",
  fetchInitial: (params) => fetchModeratedEventsWithCursor({ ...params, cursor: undefined }),
  fetchMore: fetchModeratedEventsWithCursor,
});

// Interested Events
const interested = createEventSlice({
  name: "userEvents/interested",
  fetchInitial: (params) => fetchInterestedEventsWithCursor({ ...params, cursor: undefined }),
  fetchMore: fetchInterestedEventsWithCursor,
});

// Combine reducers
const appReducer = combineReducers({
  created: created.reducer,
  rsvped: rsvped.reducer,
  organized: organized.reducer,
  moderated: moderated.reducer,
  interested: interested.reducer,
});



// Root reducer to handle global reset
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
  if (action.type === 'userEvents/resetUserEvents') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;

// Export Actions
export const resetUserEvents = () => ({ type: 'userEvents/resetUserEvents' });

// Created Exports
export const {
  fetchInitial: fetchInitialCreatedEvents,
  loadMore: loadMoreCreatedEvents,
  reset: resetCreatedEvents,
  setPageSize: setCreatedPageSize,
  addEventLocal: addCreatedEventLocal,
} = created.actions;

// RSVPed Exports
export const {
  fetchInitial: fetchInitialRsvpEvents,
  loadMore: loadMoreRsvpEvents,
  reset: resetRSVPedEvents,
  setPageSize: setRSVPedPageSize,
  removeEventLocal: removeRSVPedEvent,
} = rsvped.actions;

// Organized Exports
export const {
  fetchInitial: fetchInitialOrganizedEvents,
  loadMore: loadMoreOrganizedEvents,
  reset: resetOrganizedEvents,
  setPageSize: setOrganizedPageSize,
} = organized.actions;

// Moderated Exports
export const {
  fetchInitial: fetchInitialModeratedEvents,
  loadMore: loadMoreModeratedEvents,
  reset: resetModeratedEvents,
  setPageSize: setModeratedPageSize,
} = moderated.actions;

// Interested Exports
export const {
  fetchInitial: fetchInitialInterestedEvents,
  loadMore: loadMoreInterestedEvents,
  reset: resetInterestedEvents,
  setPageSize: setInterestedPageSize,
} = interested.actions;

