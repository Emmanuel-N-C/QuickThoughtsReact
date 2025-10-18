// src/redux/thoughtsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const thoughtsSlice = createSlice({
  name: 'thoughts',
  initialState: [],
  reducers: {
    addThought: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload.text,
        category: action.payload.category || 'General',
        createdAt: new Date().toISOString(),
      });
    },
    removeThought: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },
  },
});

export const { addThought, removeThought } = thoughtsSlice.actions;
export default thoughtsSlice.reducer;
