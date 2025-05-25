import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  role: "anonymous", // 'admin', 'user', etc.
  accessToken: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role || "user";
      state.accessToken = action.payload.accessToken;
      state.initialized = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.initialized = true;
      state.role = "anonymous"; 
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    initialize: (state) => {
        state.initialized = true;
    },
  },
});

export const { login, logout, setAccessToken, initialize} = authSlice.actions;
export default authSlice.reducer;