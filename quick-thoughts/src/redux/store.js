// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import thoughtsReducer from './thoughtsSlice';
import todosReducer from './todosSlice';
import plansReducer from './plansSlice';
import { saveState, loadState } from './localStorage';


const persistedState = loadState();

 
const store = configureStore({
  reducer: {
    thoughts: thoughtsReducer,
    todos: todosReducer,
    plans: plansReducer,
  },
  preloadedState: persistedState, 
});

 
store.subscribe(() => {
  saveState({
    thoughts: store.getState().thoughts,
    todos: store.getState().todos,
    plans: store.getState().plans,
  });
});

export default store;
