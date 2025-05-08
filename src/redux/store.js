import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import {MMKVStorage} from '../Component/Storage';
import {userReducer} from './reducers';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  user: userReducer, // ✅ user becomes key in state
});

const persistConfig = {
  key: 'root',
  version: 2,
  storage: MMKVStorage, // ✅ use MMKV adapter here
  migrate: (state) => {
    console.log('🧹 Dropping old incompatible persisted state');
    return Promise.resolve(undefined); // drops old state
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // ❗ Needed for redux-persist
    }),
});

export const persistor = persistStore(store);
