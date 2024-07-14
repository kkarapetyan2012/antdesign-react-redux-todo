import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';
import { loadState, saveState } from './app/localStorage';

const persistedState = loadState();

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>; // Correctly type RootState
export type AppDispatch = typeof store.dispatch;

export default store;
