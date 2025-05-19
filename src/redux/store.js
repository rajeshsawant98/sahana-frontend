import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventsReducer from "./slices/eventsSlice";
import userEventsReducer from "./slices/userEventsSlice";
import externalEventsReducer from "./slices/externalEventsSlice";
import nearbyEventsReducer from "./slices/nearbyEventsSlice"; 

const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventsReducer,
        userEvents: userEventsReducer,
        externalEvents: externalEventsReducer,
        nearbyEvents: nearbyEventsReducer,
    },
});

export default store;