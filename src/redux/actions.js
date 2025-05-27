import types from './types';

export const setUserInfo = payload => ({
  type: types?.SET_USER_INFO,
  payload,
});

export const setCeremonyInfo = payload => ({
  type: types?.SET_CEREMONY_INFO,
  payload,
});
export const setGaolData = payload => ({
  type: types?.SET_GOAL_INFO,
  payload,
});
export const deleteGoalByDate = date => ({
  type: types.DELETE_GOAL_BY_DATE,
  payload: date,
});
export const upDateGoalById = date => ({
  type: types.GOAL_INFO_UPDATE,
  payload: date,
});
export const deleteTaskById = taskId => ({
  type: types.DELETE_TASK_BY_ID,
  payload: taskId,
});
export const updateAllGoalData = date => ({
  type: types.GOAL_ALLINFO_UPDATE,
  payload: date,
});
export const setMeditationData = date => ({
  type: types.MEDITATION_DATA,
  payload: date,
});
