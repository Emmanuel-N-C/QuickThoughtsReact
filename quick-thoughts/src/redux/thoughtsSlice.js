// src/redux/thoughtsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const thoughtsSlice = createSlice({
  name: 'thoughts',
  initialState: [],
  reducers: {
    addThought: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        createdAt: new Date().toISOString(),
      });
    },
    removeThought: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },
  },
});

export const { addThought, removeThought } = thoughtsSlice.actions;

export const addThoughtWithTimeout = (text, timeout = 15000) => (dispatch) => {
  const id = Date.now();
  dispatch(addThought(text));

  // remove after 15 seconds
  setTimeout(() => {
    dispatch(removeThought(id));
  }, timeout);
};

export default thoughtsSlice.reducer;
