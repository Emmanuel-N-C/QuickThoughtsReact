// src/redux/thoughtsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const thoughtsSlice = createSlice({
  name: 'thoughts',
  initialState: [],
  reducers: {
    addThought: (state, action) => {
      state.push({
        id: action.payload.id || Date.now(),
        text: action.payload.text,
        category: action.payload.category || 'Random',
        createdAt: new Date().toISOString(),
      });
    },
    removeThought: (state, action) => {
      return state.filter((t) => t.id !== action.payload);
    },
    convertThought: (state, action) => {
      const { id, newCategory } = action.payload;
      const thought = state.find((t) => t.id === id);
      if (thought) thought.category = newCategory;
    },
  },
});

export const { addThought, removeThought, convertThought } = thoughtsSlice.actions;

// Enhanced thunk for 15s auto-removal
export const addThoughtWithTimeout = (text, category) => (dispatch) => {
  const id = Date.now();
  dispatch(addThought({ id, text, category }));

  const timer = setTimeout(() => {
    dispatch(removeThought(id));
  }, 15000);

  // Store timer reference globally (so we can cancel later)
  if (!window.randomThoughtTimers) window.randomThoughtTimers = {};
  window.randomThoughtTimers[id] = timer;
};

export const cancelThoughtTimer = (id) => {
  if (window.randomThoughtTimers?.[id]) {
    clearTimeout(window.randomThoughtTimers[id]);
    delete window.randomThoughtTimers[id];
  }
};

export default thoughtsSlice.reducer;
