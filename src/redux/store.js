import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventsReducer from "./slices/eventsSlice";
import userEventsReducer from "./slices/userEventsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventsReducer,
        userEvents: userEventsReducer,
    },
});

export default store;