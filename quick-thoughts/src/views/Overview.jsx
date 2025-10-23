import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addThought } from "../redux/thoughtsSlice";
import "./Overview.css";

const Overview = () => {
  const dispatch = useDispatch();
  const thoughts = useSelector((state) => state.thoughts);
  const todos = useSelector((state) => state.todos);
  const ideas = thoughts.filter((t) => t.category === "Idea");
  const randomThoughts = thoughts.filter((t) => t.category === "Random Thought");
  const plans = useSelector((state) => state.plans);

  const [category, setCategory] = useState("Random Thought");
  const [text, setText] = useState("");

  // handle adding new input
  const handleAdd = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    dispatch(addThought({ text, category, date: new Date().toISOString() }));
    setText("");
  };

  return (
    <div className="overview-container">
      {/* Dashboard Header */}
      <h2 className="overview-title">📊 Overview</h2>
      <p className="overview-subtitle">
        A quick summary of your creative workspace.
      </p>

      {/* Dashboard Cards */}
      <div className="overview-cards">
        <div
          className={`overview-card ${
            category === "Idea" ? "active" : ""
          }`}
          onClick={() => setCategory("Idea")}
        >
          <span className="icon">💡</span>
          <h3>Ideas</h3>
          <p>{ideas.length}</p>
          <button className="small-btn">+ Add Idea</button>
        </div>

        <div
          className={`overview-card ${
            category === "Random Thought" ? "active" : ""
          }`}
          onClick={() => setCategory("Random Thought")}
        >
          <span className="icon">💭</span>
          <h3>Random Thoughts</h3>
          <p>{randomThoughts.length}</p>
          <button className="small-btn">+ Add Thought</button>
        </div>

        <div
          className={`overview-card ${
            category === "To-Do" ? "active" : ""
          }`}
          onClick={() => setCategory("To-Do")}
        >
          <span className="icon">📝</span>
          <h3>To-Dos</h3>
          <p>{todos.length}</p>
          <button className="small-btn">+ Add Task</button>
        </div>

        <div
          className={`overview-card ${
            category === "Plan" ? "active" : ""
          }`}
          onClick={() => setCategory("Plan")}
        >
          <span className="icon">📅</span>
          <h3>Plans</h3>
          <p>{plans.length}</p>
          <button className="small-btn">+ Add Plan</button>
        </div>
      </div>

      {/* Input Section */}
      <form className="overview-input" onSubmit={handleAdd}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option>Idea</option>
          <option>Random Thought</option>
          <option>To-Do</option>
          <option>Plan</option>
        </select>
        <input
          type="text"
          placeholder={`Add a new ${category.toLowerCase()}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      {/* Recent Thoughts */}
      <div className="recent-section">
        <h3>🕒 Recent Random Thoughts</h3>
        {randomThoughts.length === 0 ? (
          <p className="empty">No random thoughts yet.</p>
        ) : (
          <ul className="recent-list">
            {randomThoughts
              .slice(-5)
              .reverse()
              .map((t) => (
                <li key={t.id}>
                  <span className="thought-text">{t.text}</span>
                  <span className="thought-time">
                    {new Date(t.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Overview;
