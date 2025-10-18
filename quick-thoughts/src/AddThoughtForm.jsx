// src/AddThoughtForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addThoughtWithTimeout, addThought } from './redux/thoughtsSlice';
import { addTodo } from './redux/todosSlice';

const AddThoughtForm = () => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Random');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    switch (category) {
      case 'Random':
        dispatch(addThoughtWithTimeout(text, category));
        break;

      case 'Idea':
        dispatch(addThought({ id: Date.now(), text, category }));
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
            ? 'Enter plan name...'
            : category === 'To-Do'
            ? 'Enter a task...'
            : "What's on your mind?"
        }
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddThoughtForm;
