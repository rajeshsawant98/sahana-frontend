import type { AppDispatch } from "./store";

let dispatch: AppDispatch | null = null;
let currentAccessToken: string | null = null;

export const setDispatch = (storeDispatch: AppDispatch) => {
  dispatch = storeDispatch;
};

export const updateAccessToken = (token: string) => {
  currentAccessToken = token;
  if (dispatch) {
    dispatch({
      type: "auth/setAccessToken",
      payload: token,
    });
  }
};

export const getAccessToken = (): string | null => currentAccessToken;