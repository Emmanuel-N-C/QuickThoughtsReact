// src/redux/todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const { id, text, completed = false, planId = null } = action.payload; 
      state.push({ id, text, completed, planId }); 
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed; 
    },
    removeTodo: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },
    editTodo: (state, action) => { 
      const { id, text } = action.payload;
      const todo = state.find(t => t.id === id);
      if (todo && text !== undefined) todo.text = text;
    },
    assignTodoToPlan: (state, action) => {
      const { todoId, planId } = action.payload;
      const todo = state.find(t => t.id === todoId);
      if (todo) todo.planId = planId;
    },
    updateTodoStatus: (state, action) => {
      const { id, newStatus } = action.payload;
      const todo = state.find((t) => t.id.toString() === id.toString());
      if (todo) todo.status = newStatus;
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, editTodo, assignTodoToPlan, updateTodoStatus } =
  todosSlice.actions;
export default todosSlice.reducer;