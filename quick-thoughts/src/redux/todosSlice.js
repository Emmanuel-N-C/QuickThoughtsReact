// src/redux/todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const { id, text, completed = false, planId = null, dueDate = null } = action.payload; 
      state.push({ id, text, completed, planId, dueDate }); 
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed; 
    },
    removeTodo: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },
    editTodo: (state, action) => { 
      const { id, text, dueDate } = action.payload;
      const todo = state.find(t => t.id === id);
      if (todo) {
        if (text !== undefined) todo.text = text;
        if (dueDate !== undefined) todo.dueDate = dueDate;
      }
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
    // New action for reordering todos
    reorderTodos: (state, action) => {
      return action.payload;
    },
    // New action for batch operations
    batchDeleteTodos: (state, action) => {
      const idsToDelete = action.payload;
      return state.filter(t => !idsToDelete.includes(t.id));
    },
    batchToggleTodos: (state, action) => {
      const idsToToggle = action.payload;
      state.forEach(todo => {
        if (idsToToggle.includes(todo.id)) {
          todo.completed = !todo.completed;
        }
      });
    },
  },
});

export const { 
  addTodo, 
  toggleTodo, 
  removeTodo, 
  editTodo, 
  assignTodoToPlan, 
  updateTodoStatus,
  reorderTodos,
  batchDeleteTodos,
  batchToggleTodos
} = todosSlice.actions;
export default todosSlice.reducer;