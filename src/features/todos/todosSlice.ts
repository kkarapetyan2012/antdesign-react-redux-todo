import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Define the async thunk
export const fetchTodos = createAsyncThunk<Todo[], void, AsyncThunkConfig>('todos/fetchTodos', async () => {
  const response = await fetch('/api/todos');
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  const todos = await response.json();
  return todos;  // This will be passed on to the fulfilled action payload
});

interface Todo {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  overdue?: boolean;
}

// Define the AsyncThunkConfig type
interface AsyncThunkConfig {
  rejectValue: string;
}

export type FilterType = 'all' | 'completed' | 'incomplete' | 'overdue';

export interface TodosState {
  items: Todo[];
  filter: FilterType;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  filter: 'all',
  status: 'idle',
  error: null,
};

const saveStateToLocalStorage = (state: TodosState) => {
  localStorage.setItem('todos', JSON.stringify(state.items));
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
      saveStateToLocalStorage(state);
    },
    toggleComplete: (state, action: PayloadAction<{ id: string }>) => {
      const todo = state.items.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.completed = !todo.completed;
        todo.overdue = !todo.completed && new Date(todo.deadline) < new Date();
        saveStateToLocalStorage(state);
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      saveStateToLocalStorage(state);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.items.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveStateToLocalStorage(state);
      }
    },
    setOverdue: (state) => {
      const now = new Date();
      state.items.forEach(todo => {
        if (!todo.completed && new Date(todo.deadline) < now) {
          todo.overdue = true;
        } else {
          todo.overdue = false;
        }
      });
      saveStateToLocalStorage(state);
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
    loadState: (state) => {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        state.items = JSON.parse(savedTodos);
      }
    },
    restoreTodo: (state, action: PayloadAction<Todo>) => {
      const todo = action.payload;
      state.items.push(todo);
      saveStateToLocalStorage(state);
    },
    editTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.items.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveStateToLocalStorage(state);
      }
    },
    updateOrder: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
      saveStateToLocalStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;  // Set the fetched todos
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      });
  },
});

export const { addTodo, toggleComplete, deleteTodo, updateTodo, setOverdue, setFilter, loadState, restoreTodo, editTodo, updateOrder } = todosSlice.actions;

// Selector to get the current filter
export const selectFilter = (state: RootState) => state.todos.filter;

// Selector to get todo items
export const selectTodos = (state: { todos: TodosState }) => state.todos.items;

// Selector to get a specific todo by ID
export const selectTodoById = (state: { todos: TodosState }, todoId: string) =>
  state.todos.items.find((todo) => todo.id === todoId);

export default todosSlice.reducer;
