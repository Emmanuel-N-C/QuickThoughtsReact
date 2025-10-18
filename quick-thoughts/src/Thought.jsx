// src/Thought.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeThought } from './redux/thoughtsSlice';

const ThoughtList = ({ sortOrder = 'newest', filterCategory = null }) => {
  const thoughts = useSelector((state) => state.thoughts);
  const dispatch = useDispatch();

  // ✅ Filter thoughts by category (Random, Idea, etc.)
  let filteredThoughts = filterCategory
    ? thoughts.filter((t) => t.category === filterCategory)
    : thoughts;

  // ✅ Sort by creation time (newest or oldest)
  filteredThoughts = [...filteredThoughts].sort((a, b) =>
    sortOrder === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  if (filteredThoughts.length === 0) {
    return <p>No {filterCategory ? filterCategory : ''} thoughts yet!</p>;
  }

  return (
    <div className="thought-list">
      <h2>
        {filterCategory
          ? filterCategory === 'Random'
            ? '💭 Random Thoughts'
            : filterCategory === 'Idea'
            ? '💡 Ideas'
            : `${filterCategory}s`
          : '💭 Thoughts & Ideas'}
      </h2>

      {filteredThoughts.map((t) => (
        <div key={t.id} className="thought-item">
          <p>{t.text}</p>
          <button onClick={() => dispatch(removeThought(t.id))}>×</button>
        </div>
      ))}
    </div>
  );
};

export default ThoughtList;
