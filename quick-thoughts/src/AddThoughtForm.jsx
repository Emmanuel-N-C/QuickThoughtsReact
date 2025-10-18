// src/AddThoughtForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addThoughtWithTimeout, addThought } from './redux/thoughtsSlice';

const AddThoughtForm = () => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Random');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    switch (category) {
      case 'Random':
        // Temporary thought (auto-deletes after 15 seconds)
        dispatch(addThoughtWithTimeout(text, category));
        break;

      case 'Idea':
        // Persistent idea (stored in Redux)
        dispatch(addThought({ text, category }));
        break;

      case 'To-Do':
        // We'll later send this to todosSlice
        console.log('TODO:', text);
        break;

      case 'Plan':
        // Will later trigger Plan creation modal
        console.log('PLAN CREATION TRIGGER');
        break;

      default:
        break;
    }

    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-thought-form">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="category-select"
      >
        <option value="Random">💭 Random Thought</option>
        <option value="Idea">💡 Idea</option>
        <option value="To-Do">📝 To-Do</option>
        <option value="Plan">📅 Plan</option>
      </select>

      <input
        type="text"
        value={text}
        placeholder={
          category === 'Plan'
            ? 'Enter plan title or description...'
            : "What's on your mind?"
        }
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddThoughtForm;
