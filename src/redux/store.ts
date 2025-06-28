// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventsReducer from "./slices/eventsSlice";
import userEventsReducer from "./slices/userEventsSlice";
import externalEventsReducer from "./slices/externalEventsSlice";
import nearbyEventsReducer from "./slices/nearbyEventsSlice";
import themeReducer from "./slices/themeSlice";
import friendsReducer from "./slices/friendsSlice";
import friendRequestsReducer from "./slices/friendRequestsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    userEvents: userEventsReducer,
    externalEvents: externalEventsReducer,
    nearbyEvents: nearbyEventsReducer,
    theme: themeReducer,
    friends: friendsReducer,
    friendRequests: friendRequestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;