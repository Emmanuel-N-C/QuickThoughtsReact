import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { FaLightbulb, FaBrain, FaCheckCircle, FaCalendarAlt, FaTrash, FaSave, FaArrowRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { MdAccessTime } from 'react-icons/md';
import { addThoughtWithTimeout, convertThought, removeThought } from "../redux/thoughtsSlice";
import { addTodo } from "../redux/todosSlice";
import { addPlan } from "../redux/plansSlice";
import { getRelativeTime } from "../utilities";
import "./Overview.css";

const Overview = ({ setCurrentView, setListFilter }) => {
  const dispatch = useDispatch();
  const thoughts = useSelector((state) => state.thoughts);
  const todos = useSelector((state) => state.todos);
  const ideas = thoughts.filter((t) => t.category === "Idea");
  const randomThoughts = thoughts.filter((t) => t.category === "Random Thought");
  const plans = useSelector((state) => state.plans);

  const [category, setCategory] = useState("Idea");
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K for quick add
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickAdd(!showQuickAdd);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setShowQuickAdd(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showQuickAdd]);

  const handleCardClick = (filterType) => {
    setListFilter(filterType);
    setCurrentView("list");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    if (category === "Idea" || category === "Random Thought") {
      dispatch(addThoughtWithTimeout(text, category));
      toast.success(category === "Idea" ? "💡 Idea saved!" : "💭 Thought captured!");
    } else if (category === "To-Do") {
      dispatch(addTodo({ id: Date.now(), text, completed: false }));
      toast.success("✅ Task added!");
    } else if (category === "Plan") {
      dispatch(addPlan(text, description));
      toast.success("📅 Plan created!");
    }

    setText("");
    setDescription("");
    setShowQuickAdd(false);
  };

  const completedTodos = todos.filter(t => t.completed).length;
  const todoProgress = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;

  return (
    <div className="overview-container">
      {/* Header with gradient */}
      <div className="overview-header">
        <div className="header-content">
          <h1 className="overview-title">
            <span className="title-icon">
              <HiSparkles />
            </span>
            Overview
          </h1>
          <p className="overview-subtitle">
            Your creative workspace at a glance
          </p>
        </div>
        <button 
          className="quick-add-btn"
          onClick={() => setShowQuickAdd(!showQuickAdd)}
        >
          <span className="plus-icon">+</span>
          Quick Add
          <span className="kbd-hint">⌘K</span>
        </button>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="quick-add-modal">
          <div className="modal-overlay" onClick={() => setShowQuickAdd(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <HiSparkles style={{ marginRight: '8px' }} />
                Quick Add
              </h3>
              <button onClick={() => setShowQuickAdd(false)} className="modal-close">×</button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="category-tabs">
                <button
                  type="button"
                  className={`tab ${category === "Idea" ? "active" : ""}`}
                  onClick={() => setCategory("Idea")}
                >
                  <FaLightbulb style={{ marginRight: '6px' }} />
                  Idea
                </button>
                <button
                  type="button"
                  className={`tab ${category === "Random Thought" ? "active" : ""}`}
                  onClick={() => setCategory("Random Thought")}
                >
                  <FaBrain style={{ marginRight: '6px' }} />
                  Thought
                </button>
                <button
                  type="button"
                  className={`tab ${category === "To-Do" ? "active" : ""}`}
                  onClick={() => setCategory("To-Do")}
                >
                  <FaCheckCircle style={{ marginRight: '6px' }} />
                  To-Do
                </button>
                <button
                  type="button"
                  className={`tab ${category === "Plan" ? "active" : ""}`}
                  onClick={() => setCategory("Plan")}
                >
                  <FaCalendarAlt style={{ marginRight: '6px' }} />
                  Plan
                </button>
              </div>
              
              <input
                type="text"
                placeholder={`Enter ${category.toLowerCase()}...`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                className="modal-input"
              />
              
              {category === "Plan" && (
                <textarea
                  placeholder="Description (optional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="modal-textarea"
                  rows="3"
                />
              )}
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowQuickAdd(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add {category}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Horizontal Cards Grid */}
      <div className="cards-grid">
        <div className="stat-card gradient-purple" onClick={() => handleCardClick("Ideas")}>
          <div className="card-icon">
            <FaLightbulb />
          </div>
          <div className="card-content">
            <h3>Ideas</h3>
            <div className="card-number">{ideas.length}</div>
            <p className="card-subtitle">Brilliant thoughts</p>
          </div>
          <div className="card-arrow">
            <FaArrowRight />
          </div>
        </div>

        <div className="stat-card gradient-blue" onClick={() => handleCardClick("Random Thoughts")}>
          <div className="card-icon">
            <FaBrain />
          </div>
          <div className="card-content">
            <h3>Random Thoughts</h3>
            <div className="card-number">{randomThoughts.length}</div>
            <p className="card-subtitle">Fleeting moments</p>
          </div>
          <div className="card-arrow">
            <FaArrowRight />
          </div>
        </div>

        <div className="stat-card gradient-green" onClick={() => handleCardClick("To-Dos")}>
          <div className="card-icon">
            <FaCheckCircle />
          </div>
          <div className="card-content">
            <h3>To-Dos</h3>
            <div className="card-number">{todos.length}</div>
            <div className="progress-mini">
              <div className="progress-mini-fill" style={{ width: `${todoProgress}%` }}></div>
            </div>
            <p className="card-subtitle">{todoProgress}% complete</p>
          </div>
          <div className="card-arrow">
            <FaArrowRight />
          </div>
        </div>

        <div className="stat-card gradient-pink" onClick={() => handleCardClick("Plans")}>
          <div className="card-icon">
            <FaCalendarAlt />
          </div>
          <div className="card-content">
            <h3>Plans</h3>
            <div className="card-number">{plans.length}</div>
            <p className="card-subtitle">Active projects</p>
          </div>
          <div className="card-arrow">
            <FaArrowRight />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="activity-section">
        <div className="section-header">
          <h2>
            <MdAccessTime style={{ marginRight: '8px' }} />
            Recent Activity
          </h2>
          <button className="view-all-btn" onClick={() => setCurrentView("list")}>
            View All <FaArrowRight style={{ marginLeft: '4px' }} />
          </button>
        </div>

        <div className="activity-grid">
          {/* Recent Random Thoughts */}
          <div className="activity-card">
            <h3>
              <FaBrain style={{ marginRight: '8px', color: '#8b5cf6' }} />
              Random Thoughts
            </h3>
            {randomThoughts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">
                  <HiSparkles />
                </span>
                <p>No thoughts yet</p>
              </div>
            ) : (
              <div className="activity-list">
                {randomThoughts.slice(-3).reverse().map((thought) => (
                  <div key={thought.id} className="activity-item">
                    <div className="activity-text">{thought.text}</div>
                    <div className="activity-meta">
                      <span className="activity-time">{getRelativeTime(thought.createdAt)}</span>
                      <div className="activity-actions">
                        <button
                          onClick={() => {
                            dispatch(convertThought({ id: thought.id, newCategory: "Idea" }));
                            toast.success("💡 Saved as idea!");
                          }}
                          className="action-btn save"
                          title="Save as Idea"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => {
                            dispatch(removeThought(thought.id));
                            toast.success("Deleted!");
                          }}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Ideas */}
          <div className="activity-card">
            <h3>
              <FaLightbulb style={{ marginRight: '8px', color: '#fbbf24' }} />
              Recent Ideas
            </h3>
            {ideas.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">
                  <FaLightbulb />
                </span>
                <p>No ideas yet</p>
              </div>
            ) : (
              <div className="activity-list">
                {ideas.slice(-3).reverse().map((idea) => (
                  <div key={idea.id} className="activity-item">
                    <div className="activity-text">{idea.text}</div>
                    <div className="activity-meta">
                      <span className="activity-time">{getRelativeTime(idea.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;