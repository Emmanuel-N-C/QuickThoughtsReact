import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { addThoughtWithTimeout, convertThought, removeThought } from "../redux/thoughtsSlice";
import { addTodo } from "../redux/todosSlice";
import { addPlan } from "../redux/plansSlice";
import "./Overview.css";

const Overview = ({ setCurrentView, setListFilter }) => {
  const dispatch = useDispatch();
  const thoughts = useSelector((state) => state.thoughts);
  const todos = useSelector((state) => state.todos);
  const ideas = thoughts.filter((t) => t.category === "Idea");
  const randomThoughts = thoughts.filter((t) => t.category === "Random Thought");
  const plans = useSelector((state) => state.plans);

  const [category, setCategory] = useState("Random Thought");
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");

  // Navigate to list view with specific filter
  const handleCardClick = (filterType) => {
    setListFilter(filterType);
    setCurrentView("list");
  };

  // Handle button click - just change category, don't navigate
  const handleButtonClick = (e, newCategory) => {
    e.stopPropagation();
    setCategory(newCategory);
  };

  // handle adding new input based on category
  const handleAdd = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    // Route to appropriate action based on category
    if (category === "Idea" || category === "Random Thought") {
      dispatch(addThoughtWithTimeout(text, category));
      if (category === "Idea") {
        toast.success("💡 Idea added!");
      } else {
        toast.success("💭 Random thought added! (Disappears in 15s)");
      }
    } else if (category === "To-Do") {
      dispatch(addTodo({ 
        id: Date.now(), 
        text, 
        completed: false 
      }));
      toast.success("✅ To-do added!");
    } else if (category === "Plan") {
      dispatch(addPlan(text, description));
      toast.success("📅 Plan created!");
    }

    setText("");
    setDescription("");
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
          className={`overview-card ${category === "Idea" ? "active" : ""}`}
          onClick={() => handleCardClick("Ideas")}
          style={{ cursor: 'pointer' }}
        >
          <span className="icon">💡</span>
          <h3>Ideas</h3>
          <p>{ideas.length}</p>
          <button 
            className="small-btn"
            onClick={(e) => handleButtonClick(e, "Idea")}
          >
            + Add Idea
          </button>
        </div>

        <div
          className={`overview-card ${category === "Random Thought" ? "active" : ""}`}
          onClick={() => handleCardClick("Random Thoughts")}
          style={{ cursor: 'pointer' }}
        >
          <span className="icon">💭</span>
          <h3>Random Thoughts</h3>
          <p>{randomThoughts.length}</p>
          <button 
            className="small-btn"
            onClick={(e) => handleButtonClick(e, "Random Thought")}
          >
            + Add Thought
          </button>
        </div>

        <div
          className={`overview-card ${category === "To-Do" ? "active" : ""}`}
          onClick={() => handleCardClick("To-Dos")}
          style={{ cursor: 'pointer' }}
        >
          <span className="icon">📝</span>
          <h3>To-Dos</h3>
          <p>{todos.length}</p>
          <button 
            className="small-btn"
            onClick={(e) => handleButtonClick(e, "To-Do")}
          >
            + Add Task
          </button>
        </div>

        <div
          className={`overview-card ${category === "Plan" ? "active" : ""}`}
          onClick={() => handleCardClick("Plans")}
          style={{ cursor: 'pointer' }}
        >
          <span className="icon">📅</span>
          <h3>Plans</h3>
          <p>{plans.length}</p>
          <button 
            className="small-btn"
            onClick={(e) => handleButtonClick(e, "Plan")}
          >
            + Add Plan
          </button>
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
        
        {category === "Plan" ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <input
              type="text"
              placeholder="Plan title..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: '100%' }}
            />
            <input
              type="text"
              placeholder="Plan description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        ) : (
          <input
            type="text"
            placeholder={`Add a new ${category.toLowerCase()}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
        
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      {/* Recent Thoughts */}
      <div className="recent-section">
        <h3>🕒 Recent Random Thoughts (Auto-delete in 15s)</h3>
        {randomThoughts.length === 0 ? (
          <p className="empty">No random thoughts yet.</p>
        ) : (
          <ul className="recent-list">
            {randomThoughts
              .slice(-5)
              .reverse()
              .map((t) => (
                <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span className="thought-text">{t.text}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        dispatch(convertThought({ id: t.id, newCategory: "Idea" }));
                        toast.success("💡 Converted to Idea!");
                      }}
                      style={{
                        background: '#ffd700',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      title="Save as Idea"
                    >
                      💡
                    </button>
                    <button
                      onClick={() => {
                        dispatch(removeThought(t.id));
                        toast.success("🗑️ Random thought deleted!");
                      }}
                      style={{
                        background: '#ff4444',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        color: 'white'
                      }}
                      title="Delete now"
                    >
                      ✖
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Overview;