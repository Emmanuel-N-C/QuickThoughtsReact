// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import thoughtsReducer from './thoughtsSlice';
import todosReducer from './todosSlice';
import plansReducer from './plansSlice';

const store = configureStore({
  reducer: {
    thoughts: thoughtsReducer,
    todos: todosReducer,
    plans: plansReducer,
  },
});

export default store;
