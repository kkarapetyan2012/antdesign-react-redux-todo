// import { configureStore } from '@reduxjs/toolkit';
// import todosReducer from '../features/todos/todosSlice';
// import { loadState, saveState } from './localStorage';

// const persistedState = loadState();

// const store = configureStore({
//   reducer: {
//     todos: todosReducer,
//   },
//   preloadedState: persistedState,
// });

// store.subscribe(() => {
//   saveState({
//     todos: store.getState().todos,
//   });
// });

// export default store

import { configureStore } from '@reduxjs/toolkit';
import todosReducer, { TodosState } from '../features/todos/todosSlice';
import { loadState, saveState } from './localStorage';

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

export type RootState = {
  todos: TodosState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
