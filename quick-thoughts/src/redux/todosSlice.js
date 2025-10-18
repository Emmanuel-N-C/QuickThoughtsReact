// src/redux/todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const { id, text, done = false, planId = null } = action.payload;
      state.push({ id, text, done, planId });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    removeTodo: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },
    assignTodoToPlan: (state, action) => {
      const { todoId, planId } = action.payload;
      const todo = state.find(t => t.id === todoId);
      if (todo) todo.planId = planId;
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, assignTodoToPlan } =
  todosSlice.actions;
export default todosSlice.reducer;
