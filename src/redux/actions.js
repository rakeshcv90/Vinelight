import types from "./types";

export const setUserInfo = (payload) => ({
    type: types?.SET_USER_INFO,
    payload,
  });