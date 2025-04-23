
let dispatch = null;
let currentAccessToken = null;

export const setDispatch = (storeDispatch) => {
  dispatch = storeDispatch;
};

export const updateAccessToken = (token) => {
  currentAccessToken = token;
  if (dispatch) {
    dispatch({
      type: "auth/setAccessToken",
      payload: token,
    });
  }
};

export const getAccessToken = () => currentAccessToken;