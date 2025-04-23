import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events: [],
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        setEvents: (state, action) => {
            state.events = action.payload;
        },
        addEvent: (state, action) => {
            state.events.push(action.payload);
        },
        removeEvent: (state, action) => {
            state.events = state.events.filter(event => event.id !== action.payload);
        },
    },
});

export const { setEvents, addEvent, removeEvent } = eventsSlice.actions;
export default eventsSlice.reducer;