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
export const setAdvanceMedatationData = date => ({
  type: types.ADVANCE_MEDITATION_DATA,
  payload: date,
});
export const deleteCeromonykById = taskId => ({
  type: types.DELETE_CEREMONY,
  payload: taskId,
});
export const setCustomeMedidation = payload => ({
  type: types.CUSTOME_MEDITATION,
  payload,
});

export const deleteCustomMeditation = taskId => ({
  type: types.DELETE_CUSTOME_MEDITATION,
  payload: taskId,
});
export const setSubscriptionDetails = date => ({
  type: types.SUBSCRIPTION_DETAILS,
  payload: date,
});
export const setSubscriptionProducts = date => ({
  type: types.SUBSCRIPTION_PRODUCTS,
  payload: date,
});
export const setDailyPrompt = date => ({
  type: types.DAILY_PROPMPT,
  payload: date,
});
export const setDreamData = date => ({
  type: types.DREAM_DATA,
  payload: date,
});
export const deleteDreamData = taskId => ({
  type: types.DELETE_DREAM,
  payload: taskId,
});

export const updateDream = date => ({
  type: types.UPDATE_DREAM,
  payload: date,
});
export const setJournalData = date => ({
  type: types.JOURNAL_DATA,
  payload: date,
});
export const deleteJournalData = taskId => ({
  type: types.DELETE_JOURNAL,
  payload: taskId,
});
export const updateJournalData = updatedEntry => ({
  type: types.UPDATE_JOURNAL,
  payload: updatedEntry,
});
