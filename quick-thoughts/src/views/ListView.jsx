import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeThought, convertThought } from "../redux/thoughtsSlice";
import { removeTodo } from "../redux/todosSlice";
import { removePlan } from "../redux/plansSlice";
import PlanDetailView from "./PlanDetailView";
import "./ListView.css";

const ListView = ({ initialFilter = "All", setCurrentView }) => {
  const dispatch = useDispatch();

  // Global state selectors
  const thoughts = useSelector((state) => state.thoughts);
  const todos = useSelector((state) => state.todos);
  const plans = useSelector((state) => state.plans);

  // Local states
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filter, setFilter] = useState(initialFilter);

  // Update filter when initialFilter changes
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  // Compute To-Do progress
  const completedCount = todos.filter((t) => t.completed).length;
  const progress =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  // Apply filter logic
  const filteredIdeas =
    filter === "All" || filter === "Ideas"
      ? thoughts.filter((t) => t.category === "Idea")
      : [];
  const filteredRandomThoughts =
    filter === "All" || filter === "Random Thoughts"
      ? thoughts.filter((t) => t.category === "Random Thought")
      : [];
  const filteredTodos =
    filter === "All" || filter === "To-Dos" ? todos : [];
  const filteredPlans =
    filter === "All" || filter === "Plans" ? plans : [];

  // Check if all filtered arrays are empty
  const hasNoItems =
    filteredIdeas.length === 0 &&
    filteredRandomThoughts.length === 0 &&
    filteredTodos.length === 0 &&
    filteredPlans.length === 0;

  // Show detail view if a plan is selected
  if (selectedPlan) {
    return (
      <PlanDetailView
        planId={selectedPlan}
        onBack={() => setSelectedPlan(null)}
      />
    );
  }

  return (
    <div className="listview-container">
      {/* Back to Overview Button */}
      <button
        onClick={() => setCurrentView("overview")}
        style={{
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        ← Back to Overview
      </button>

      <h2 className="listview-title">🗂️ List View</h2>
      <p className="listview-subtitle">
        Your saved ideas, to-dos, and plans — neatly organized.
      </p>

      <div className="filter-container">
        <label>Filter by:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Ideas">Ideas</option>
          <option value="Random Thoughts">Random Thoughts</option>
          <option value="To-Dos">To-Dos</option>
          <option value="Plans">Plans</option>
        </select>
      </div>

      {/* Show empty state message if nothing to display */}
      {hasNoItems && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#888",
          fontSize: "18px"
        }}>
          <p>📭 No items found</p>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            {filter === "All" && "Start by adding some ideas, thoughts, to-dos, or plans!"}
            {filter === "Ideas" && "No ideas yet. Click 'Back to Overview' to add your first idea!"}
            {filter === "Random Thoughts" && "No random thoughts currently. They auto-delete after 15 seconds!"}
            {filter === "To-Dos" && "No to-dos yet. Click 'Back to Overview' to add your first task!"}
            {filter === "Plans" && "No plans yet. Click 'Back to Overview' to create your first plan!"}
          </p>
        </div>
      )}

      <div className="list-grid">
        {/* === IDEAS CARD === */}
        {(filter === "All" || filter === "Ideas") && (
          <div className="list-card">
            <h3>💡 Ideas</h3>
            {filteredIdeas.length === 0 ? (
              <p className="empty" style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                No ideas yet
              </p>
            ) : (
              filteredIdeas.map((idea) => (
                <div key={idea.id} className="item-card">
                  <div>
                    <strong>{idea.text}</strong>
                    <div className="item-date">
                      {idea.createdAt
                        ? new Date(idea.createdAt).toLocaleString()
                        : "No date"}
                    </div>
                  </div>
                  <div>
                    <button className="star-btn">⭐</button>
                    <button
                      className="delete-btn"
                      onClick={() => dispatch(removeThought(idea.id))}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* === RANDOM THOUGHTS CARD === */}
        {(filter === "All" || filter === "Random Thoughts") && (
          <div className="list-card">
            <h3>💭 Random Thoughts (Auto-delete in 15s)</h3>
            {filteredRandomThoughts.length === 0 ? (
              <p className="empty" style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                No random thoughts currently
              </p>
            ) : (
              filteredRandomThoughts.map((thought) => (
                <div key={thought.id} className="item-card">
                  <div>
                    <strong>{thought.text}</strong>
                  </div>
                  <div>
                    <button
                      className="convert-btn"
                      onClick={() =>
                        dispatch(convertThought({ id: thought.id, newCategory: "Idea" }))
                      }
                      title="Convert to Idea (Save it!)"
                    >
                      💡
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => dispatch(removeThought(thought.id))}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* === TO-DOS CARD === */}
        {(filter === "All" || filter === "To-Dos") && (
          <div className="list-card">
            <h3>📝 To-Dos</h3>
            {filteredTodos.length === 0 ? (
              <p className="empty" style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                No to-dos yet
              </p>
            ) : (
              <>
                <div className="progress-wrapper">
                  <div className="progress-circle">
                    <svg>
                      <circle className="circle-bg" cx="40" cy="40" r="35" />
                      <circle
                        className="circle"
                        cx="40"
                        cy="40"
                        r="35"
                        style={{
                          strokeDasharray: `${progress * 2.2}, 220`,
                        }}
                      />
                    </svg>
                    <div className="progress-text">{progress}%</div>
                  </div>
                </div>
                {filteredTodos.map((todo) => (
                  <div key={todo.id} className="item-card">
                    <label className="checkbox-wrapper">
                      <input type="checkbox" checked={todo.completed || false} readOnly />
                      <span
                        className={`todo-text ${
                          todo.completed ? "completed" : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                    </label>
                    <button
                      className="delete-btn"
                      onClick={() => dispatch(removeTodo(todo.id))}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* === PLANS CARD === */}
        {(filter === "All" || filter === "Plans") && (
          <div className="list-card">
            <h3>📅 Plans</h3>
            {filteredPlans.length === 0 ? (
              <p className="empty" style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                No plans yet
              </p>
            ) : (
              filteredPlans.map((plan) => (
                <div key={plan.id} className="item-card">
                  <div>
                    <strong
                      className="clickable"
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.title}
                    </strong>
                    <p className="item-desc">
                      {plan.description || "No description"}
                    </p>
                  </div>
                  <div>
                    <button
                      className="delete-btn"
                      onClick={() => dispatch(removePlan(plan.id))}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;