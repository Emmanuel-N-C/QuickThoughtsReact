import React, { useEffect } from 'react';

export function Thought({ thought, removeThought }) {
  useEffect(() => {
    const timeRemaining = thought.expiresAt - Date.now();

    const timeout = setTimeout(() => {
      removeThought(thought.id);
    }, timeRemaining);

    return () => clearTimeout(timeout);
  }, [thought]);

  const handleRemoveClick = () => {
    removeThought(thought.id);
  };

  return (
    <li className="Thought">
      <button
        aria-label="Remove thought"
        className="remove-button"
        onClick={handleRemoveClick}
      >
        &times;
      </button>
      <div className="text">{thought.text}</div>
    </li>
  );
}
