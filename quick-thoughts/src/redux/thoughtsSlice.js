// src/redux/thoughtsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const thoughtsSlice = createSlice({
  name: 'thoughts',
  initialState: [],
  reducers: {
    addThought: (state, action) => {
      const { id, text, category } = action.payload;
      state.push({
        id,
        text,
        category,
        createdAt: new Date().toISOString(),
      });
    },
    removeThought: (state, action) => {
      return state.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addThought, removeThought } = thoughtsSlice.actions;

// ✅ FIXED: consistent id for add/remove
export const addThoughtWithTimeout =
  (text, category, timeout = 15000) =>
  (dispatch) => {
    const id = Date.now();
    dispatch(addThought({ id, text, category }));

    setTimeout(() => {
      dispatch(removeThought(id));
    }, timeout);
  };

export default thoughtsSlice.reducer;
