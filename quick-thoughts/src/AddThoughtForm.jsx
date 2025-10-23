// src/AddThoughtForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addThoughtWithTimeout, addThought } from './redux/thoughtsSlice';
import { addTodo } from './redux/todosSlice';

const AddThoughtForm = ({ selectedCategory, setSelectedCategory }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    switch (selectedCategory) {
      case 'Random':
        dispatch(addThoughtWithTimeout(text, selectedCategory));
        break;

      case 'Idea':
        dispatch(addThought({ id: Date.now(), text, category: selectedCategory }));
        break;

      case 'To-Do':
        dispatch(addTodo({ id: Date.now(), text }));
        break;

      case 'Plan':
        dispatch({
          type: 'plans/addPlan',
          payload: {
            id: Date.now(),
            title: text,
            description: 'Created from main input',
          },
        });
        break;

      default:
        break;
    }

    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column flex-sm-row align-items-center gap-2"
    >
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="form-select w-auto"
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
          selectedCategory === 'Plan'
            ? 'Enter plan name...'
            : selectedCategory === 'To-Do'
            ? 'Enter a task...'
            : "What's on your mind?"
        }
        onChange={(e) => setText(e.target.value)}
        className="form-control flex-grow-1"
      />

      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
};

export default AddThoughtForm;
