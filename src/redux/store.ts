// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
// Core slices
import themeReducer from "./slices/themeSlice";
import friendsReducer from "./slices/friendsSlice";
import friendRequestsReducer from "./slices/friendRequestsSlice";
// Main infinite scroll slices (clean names)
import eventsReducer from "./slices/eventsSlice";
import userEventsReducer from "./slices/userEventsSlice";
import nearbyEventsReducer from "./slices/nearbyEventsSlice";

const store = configureStore({
  reducer: {
    // Core authentication and application state
    auth: authReducer,
    theme: themeReducer,
    friends: friendsReducer,
    friendRequests: friendRequestsReducer,
    
    // Primary infinite scroll slices (clean names)
    events: eventsReducer,
    userEvents: userEventsReducer,
    nearbyEvents: nearbyEventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;