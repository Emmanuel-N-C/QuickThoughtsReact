import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeThought } from "../redux/thoughtsSlice";
import { removeTodo } from "../redux/todosSlice";
import { removePlan } from "../redux/plansSlice";
import PlanDetailView from "./PlanDetailView";
import "./ListView.css";

const ListView = () => {
  const dispatch = useDispatch();

  // Global state selectors
  const thoughts = useSelector((state) => state.thoughts);
  const todos = useSelector((state) => state.todos);
  const plans = useSelector((state) => state.plans);

  // Local states
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filter, setFilter] = useState("All");

  // Compute To-Do progress
  const completedCount = todos.filter((t) => t.completed).length;
  const progress =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  // Apply filter logic
  const filteredIdeas =
    filter === "All" || filter === "Ideas"
      ? thoughts.filter((t) => t.category === "Idea")
      : [];
  const filteredTodos =
    filter === "All" || filter === "To-Dos" ? todos : [];
  const filteredPlans =
    filter === "All" || filter === "Plans" ? plans : [];

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
          <option value="To-Dos">To-Dos</option>
          <option value="Plans">Plans</option>
        </select>
      </div>

      <div className="list-grid">
        {/* === IDEAS CARD === */}
        {filteredIdeas.length > 0 && (
          <div className="list-card">
            <h3>💡 Ideas</h3>
            {filteredIdeas.map((idea) => (
              <div key={idea.id} className="item-card">
                <div>
                  <strong>{idea.text}</strong>
                  <div className="item-date">
                    {idea.date
                      ? new Date(idea.date).toLocaleString()
                      : "Invalid Date"}
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
            ))}
          </div>
        )}

        {/* === TO-DOS CARD === */}
        {filteredTodos.length > 0 && (
          <div className="list-card">
            <h3>📝 To-Dos</h3>
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
          </div>
        )}

        {/* === PLANS CARD === */}
        {filteredPlans.length > 0 && (
          <div className="list-card">
            <h3>📅 Plans</h3>
            {filteredPlans.map((plan) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
