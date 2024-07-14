import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';  // Adjust the path as needed

export type FilterType = 'all' | 'completed' | 'incomplete' | 'overdue';

export interface Todo {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  overdue?: boolean;
}

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

export const fetchTodos = createAsyncThunk<Todo[], void, { rejectValue: string }>(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const todos = await response.json();
      return todos;
    } catch (error) {
      return rejectWithValue('Failed to fetch todos');
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
    },
    toggleComplete: (state, action: PayloadAction<{ id: string }>) => {
      const todo = state.items.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.completed = !todo.completed;
        todo.overdue = !todo.completed && new Date(todo.deadline) < new Date();
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.items.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
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
    },
    editTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.items.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    updateOrder: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      });
  },
});

export const {
  addTodo,
  toggleComplete,
  deleteTodo,
  updateTodo,
  setOverdue,
  setFilter,
  loadState,
  restoreTodo,
  editTodo,
  updateOrder,
} = todosSlice.actions;

export const selectFilter = (state: RootState) => state.todos.filter;
export const selectTodos = (state: RootState) => state.todos.items;
export const selectTodoById = (state: RootState, todoId: string) =>
  state.todos.items.find((todo) => todo.id === todoId);

export default todosSlice.reducer;

// export type { TodosState }; // Explicitly export TodosState
