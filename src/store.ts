import { configureStore } from '@reduxjs/toolkit';
import todosReducer, { TodosState } from './features/todos/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

// Explicitly type RootState to reference TodosState
export type RootState = {
  todos: TodosState;
};

export type AppDispatch = typeof store.dispatch;
