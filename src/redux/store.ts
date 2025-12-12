// src/redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import authReducer from "./slices/authSlice";
// Core slices
import themeReducer from "./slices/themeSlice";
import friendsReducer from "./slices/friendsSlice";
import friendRequestsReducer from "./slices/friendRequestsSlice";
// Main infinite scroll slices (clean names)
import eventsReducer from "./slices/eventsSlice";
import userEventsReducer from "./slices/userEventsSlice";
import nearbyEventsReducer from "./slices/nearbyEventsSlice";

const rootReducer = combineReducers({
  // Core authentication and application state
  auth: authReducer,
  theme: themeReducer,
  friends: friendsReducer,
  friendRequests: friendRequestsReducer,
  
  // Primary infinite scroll slices (clean names)
  events: eventsReducer,
  userEvents: userEventsReducer,
  nearbyEvents: nearbyEventsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme", "userEvents"], // Persist auth, theme, and user's events
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;