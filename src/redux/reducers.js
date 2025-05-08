import types from './types';
const initialState = {
  userInfo: null,
};
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
};
