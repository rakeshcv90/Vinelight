import types from './types';
const initialState = {
  userInfo: null,
  ceremonyinfo: [],
  goalByDate: {},
  meditationdata: [],
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

    case types.SET_GOAL_INFO: {
      const {date, task} = action.payload;
      const goalByDate = state.goalByDate || {}; // ✅ fallback to empty object
      const existingEntry = goalByDate[date]; // ✅ safe access
      const existingTasks = existingEntry?.tasks || [];

      return {
        ...state,
        goalByDate: {
          ...state.goalByDate,
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

    default:
      return state;
  }
};
