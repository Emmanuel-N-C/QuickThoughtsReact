// src/redux/localStorage.js

// ✅ Save Redux state to localStorage
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('quickThoughtAppState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

// ✅ Load Redux state from localStorage
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('quickThoughtAppState');
    if (serializedState === null) {
      return undefined; // No saved state → use default reducers
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// ✅ Optional — clear saved data manually
export const clearState = () => {
  try {
    localStorage.removeItem('quickThoughtAppState');
  } catch (err) {
    console.error('Error clearing state:', err);
  }
};
