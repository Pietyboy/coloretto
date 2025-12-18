import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { baseApi } from './api/base-api';
import counterReducer from './slices/counter-slice';
import gameReducer from './slices/game-slice';
import profileReducer, { logout } from './slices/profile-slice';

const appReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  counter: counterReducer,
  game: gameReducer,
  profile: profileReducer,
});

const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === logout.type) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
  reducer: rootReducer,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
