// src/Thought.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeThought } from './redux/thoughtsSlice';

const ThoughtList = () => {
  const thoughts = useSelector((state) => state.thoughts);
  const dispatch = useDispatch();

  if (thoughts.length === 0) {
    return <p>No thoughts yet!</p>;
  }

  return (
    <div className="thought-list">
      {thoughts.map((t) => (
        <div key={t.id} className="thought-item">
          <p>{t.text}</p>
          <button onClick={() => dispatch(removeThought(t.id))}>×</button>
        </div>
      ))}
    </div>
  );
};

export default ThoughtList;
