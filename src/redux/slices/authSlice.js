import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  role: "anonymous",
  accessToken: null,
  initialized: false,
  profileFetchedAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("Login action payload: %o", action.payload);
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role || "user";
      state.accessToken = action.payload.accessToken;
      state.initialized = true;
      state.profileFetchedAt = Date.now();
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

export const { login, logout, setAccessToken, initialize } = authSlice.actions;
export default authSlice.reducer;