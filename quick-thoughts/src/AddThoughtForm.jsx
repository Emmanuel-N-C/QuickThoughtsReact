// src/AddThoughtForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addThoughtWithTimeout } from './redux/thoughtsSlice';

const AddThoughtForm = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    dispatch(addThoughtWithTimeout(text)); // dispatch to Redux
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-thought-form">
      <input
        type="text"
        value={text}
        placeholder="What's on your mind?"
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddThoughtForm;
