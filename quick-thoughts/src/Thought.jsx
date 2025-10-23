// src/Thought.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeThought, addThought } from "./redux/thoughtsSlice";

const ThoughtList = () => {
  const thoughts = useSelector((state) => state.thoughts);
  const dispatch = useDispatch();
  const [fadingIds, setFadingIds] = useState([]);

  useEffect(() => {
    // Trigger fade-out 2 seconds before removal (13s mark)
    const timers = thoughts.map((t) => {
      if (t.category === "Random") {
        return setTimeout(() => setFadingIds((prev) => [...prev, t.id]), 13000);
      }
      return null;
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [thoughts]);

  if (thoughts.length === 0) {
    return <p className="no-thoughts">No thoughts yet!</p>;
  }

  return (
    <div className="thought-list">
      {thoughts.map((t) => (
        <div
          key={t.id}
          className={`thought-item ${
            fadingIds.includes(t.id) ? "fade-out" : ""
          }`}
        >
          <p>
            <strong>{t.category}:</strong> {t.text}
          </p>

          {t.category === "Random" && (
            <div className="thought-actions">
              <button
                onClick={() =>
                  dispatch(addThought({ id: Date.now(), text: t.text, category: "Idea" }))
                }
              >
                💡 Save as Idea
              </button>
              <button
                onClick={() =>
                  dispatch(addThought({ id: Date.now(), text: t.text, category: "To-Do" }))
                }
              >
                📝 Save as To-Do
              </button>
            </div>
          )}

          <button
            className="delete-btn"
            onClick={() => dispatch(removeThought(t.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ThoughtList;
