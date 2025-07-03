import Toast from 'react-native-toast-message';
import types from './types';
const initialState = {
  userInfo: null,
  ceremonyinfo: [],
  goalByDate: {},
  meditationdata: [],
  advanceMeditationData: [],
  customeMedidation: [],
  subscription: [],
  appliedCoupanDetails: [],
  coupaDetails: [],
  getProducts: [],
  getDailyPrompt: {},
  getDreamData: [],
  getJournalData: [],
};
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };

    case types.SET_CEREMONY_INFO:
      return {
        ...state,
        ceremonyinfo: [...state.ceremonyinfo, action.payload],
      };

    // case types.SET_GOAL_INFO: {
    //   const {date, task} = action.payload;
    //   const goalByDate = state.goalByDate || {}; // ✅ fallback to empty object
    //   const existingEntry = goalByDate[date]; // ✅ safe access
    //   const existingTasks = existingEntry?.tasks || [];

    //   return {
    //     ...state,
    //     goalByDate: {
    //       ...state.goalByDate,
    //       [date]: {
    //         date,
    //         tasks: [...existingTasks, task],
    //       },
    //     },
    //   };
    // }

    case types.SET_GOAL_INFO: {
      const {date, task} = action.payload;
      const goalByDate = state.goalByDate || {};
      const existingEntry = goalByDate[date];
      const existingTasks = existingEntry?.tasks || [];

      const isDuplicate = existingTasks.some(t => t.id === task.id);
      if (isDuplicate) return state;

      return {
        ...state,
        goalByDate: {
          ...goalByDate,
          [date]: {
            date,
            tasks: [...existingTasks, task],
          },
        },
      };
    }

    case types.DELETE_GOAL_BY_DATE: {
      const dateToDelete = action.payload;

      const updatedGoals = {...state.goalByDate};
      delete updatedGoals[dateToDelete];

      return {
        ...state,
        goalByDate: updatedGoals,
      };
    }

    case types.GOAL_INFO_UPDATE: {
      const taskId = action.payload;

      const updatedGoalByDate = {};

      for (const [date, dayData] of Object.entries(state.goalByDate)) {
        const updatedTasks = dayData.tasks.map(task =>
          task.id === taskId ? {...task, completed: !task.completed} : task,
        );

        updatedGoalByDate[date] = {
          ...dayData,
          tasks: updatedTasks,
        };
      }

      return {
        ...state,
        goalByDate: updatedGoalByDate,
      };
    }
    case types.DELETE_TASK_BY_ID: {
      const taskId = action.payload;
      const updatedGoalByDate = {};

      for (const [date, entry] of Object.entries(state.goalByDate)) {
        const filteredTasks = entry.tasks.filter(task => task.id !== taskId);

        if (filteredTasks.length > 0) {
          updatedGoalByDate[date] = {
            ...entry,
            tasks: filteredTasks,
          };
        }
        // else: if no tasks left, we skip this date (it gets removed)
      }

      return {
        ...state,
        goalByDate: updatedGoalByDate,
      };
    }

    case types.GOAL_ALLINFO_UPDATE: {
      const date = action.payload;
      const updatedGoalByDate = {...state.goalByDate};

      if (updatedGoalByDate[date]) {
        const dayData = updatedGoalByDate[date];

        const updatedTasks = dayData.tasks.map(task => ({
          ...task,
          completed: true, // Set all to completed
        }));

        updatedGoalByDate[date] = {
          ...dayData,
          tasks: updatedTasks,
        };
      }

      return {
        ...state,
        goalByDate: updatedGoalByDate,
      };
    }
    case types.MEDITATION_DATA:
      return {
        ...state,
        meditationdata: action.payload,
      };
    case types.ADVANCE_MEDITATION_DATA:
      return {
        ...state,
        advanceMeditationData: action.payload,
      };
    case types.DELETE_CEREMONY:
      return {
        ...state,
        ceremonyinfo: state.ceremonyinfo.filter(
          item => item.id !== action.payload,
        ),
      };
    case types.CUSTOME_MEDITATION:
      return {
        ...state,
        customeMedidation: Array.isArray(state.customeMedidation)
          ? [...state.customeMedidation, action.payload]
          : [action.payload],
      };

    case types.DELETE_CUSTOME_MEDITATION:
      return {
        ...state,
        customeMedidation: state.customeMedidation.filter(
          item => item.id !== action.payload,
        ),
      };
    case types.SUBSCRIPTION_DETAILS:
      return {
        ...state,
        subscription: [action.payload],
      };

    case types.COUPAN_APPLIED:
      return {
        ...state,
        appliedCoupanDetails: [action.payload],
      };
    case types.COUPAN_DETAILS:
      return {
        ...state,
        coupaDetails: [action.payload],
      };

    case types.SUBSCRIPTION_PRODUCTS:
      return {
        ...state,
        getProducts: action.payload,
      };
    case types.DAILY_PROPMPT:
      return {
        ...state,
        getDailyPrompt: action.payload,
      };

    case types.DREAM_DATA:
      const currentData = Array.isArray(state.getDreamData)
        ? state.getDreamData
        : [];

      // Check if an entry with the same date already exists
      const exists = currentData.some(
        entry => entry.currentDat === action.payload.currentDat,
      );

      if (exists) {
        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR, // your custom image
            text: 'Data for this date already exists.',
          },
        });
        return state;
      }

      return {
        ...state,
        getDreamData: [...currentData, action.payload],
      };

    case types.UPDATE_DREAM:
      const updatedData1 = Array.isArray(state.getDreamData)
        ? state.getDreamData.map(entry =>
            entry.currentDat === action.payload.currentDat
              ? {...entry, ...action.payload} // merge update
              : entry,
          )
        : [];

      return {
        ...state,
        getDreamData: updatedData1,
      };
    case types.DELETE_DREAM:
      const filteredData = state.getDreamData.filter(
        dream => dream?.dream?.id !== action.payload,
      );

      return {
        ...state,
        getDreamData: filteredData,
      };
    case types.JOURNAL_DATA:
      const currentData1 = Array.isArray(state.getJournalData)
        ? state.getJournalData
        : [];

      // Check if an entry with the same date already exists
      const exists1 = currentData1.some(
        entry => entry.currentDat === action.payload.currentDat,
      );

      if (exists1) {
        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR, // your custom image
            text: 'Data for this date already exists.',
          },
        });
        return state;
      }

      return {
        ...state,
        getJournalData: [...currentData1, action.payload],
      };

    case types.DELETE_JOURNAL:
      const filteredData1 = state.getJournalData.filter(
        dream => dream?.journal?.id !== action.payload,
      );

      return {
        ...state,
        getJournalData: filteredData1,
      };

    case types.UPDATE_JOURNAL:
      const updatedData = Array.isArray(state.getJournalData)
        ? state.getJournalData.map(entry => {
            if (entry.currentDat === action.payload.currentDat) {
              return {
                ...entry,
                ...action.payload, // merge updated fields
              };
            }
            return entry;
          })
        : [];

      return {
        ...state,
        getJournalData: updatedData,
      };
    case types.DELETE_TASKS_BY_REPEAT_ID: {
      const repeatId = action.payload;
      const updatedGoalByDate = {};

      for (const [date, entry] of Object.entries(state.goalByDate)) {
        const filteredTasks = entry.tasks.filter(
          task => task.repeatId !== repeatId,
        );

        if (filteredTasks.length > 0) {
          updatedGoalByDate[date] = {
            ...entry,
            tasks: filteredTasks,
          };
        }
      }

      return {
        ...state,
        goalByDate: updatedGoalByDate,
      };
    }

    default:
      return state;
  }
};
