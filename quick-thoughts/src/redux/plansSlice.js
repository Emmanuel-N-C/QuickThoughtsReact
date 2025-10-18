// src/redux/plansSlice.js
import { createSlice } from '@reduxjs/toolkit';

const plansSlice = createSlice({
  name: 'plans',
  initialState: [],
  reducers: {
    addPlan: (state, action) => {
      const { id, title, description } = action.payload;
      state.push({ id, title, description, todos: [] });
    },
    removePlan: (state, action) => {
      return state.filter(p => p.id !== action.payload);
    },
    addTodoToPlan: (state, action) => {
      const { planId, todo } = action.payload;
      const plan = state.find(p => p.id === planId);
      if (plan) plan.todos.push(todo);
    },
    togglePlanTodo: (state, action) => {
      const { planId, todoId } = action.payload;
      const plan = state.find(p => p.id === planId);
      if (plan) {
        const todo = plan.todos.find(t => t.id === todoId);
        if (todo) todo.done = !todo.done;
      }
    },
    removePlanTodo: (state, action) => {
      const { planId, todoId } = action.payload;
      const plan = state.find(p => p.id === planId);
      if (plan) {
        plan.todos = plan.todos.filter(t => t.id !== todoId);
      }
    },
  },
});

export const {
  addPlan,
  removePlan,
  addTodoToPlan,
  togglePlanTodo,
  removePlanTodo,
} = plansSlice.actions;

export default plansSlice.reducer;
