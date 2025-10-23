import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodoToPlan, toggleTodoInPlan, removeTodoFromPlan } from "../redux/plansSlice";
import "./PlanDetailView.css";

const PlanDetailView = ({ planId, onBack }) => {
  const dispatch = useDispatch();
  const plan = useSelector((state) =>
    state.plans.find((p) => p.id === planId)
  );

  const [newTask, setNewTask] = useState("");

  if (!plan) {
    return (
      <div className="plan-detail-container">
        <p>⚠️ Plan not found.</p>
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
      </div>
    );
  }

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch(addTodoToPlan({ planId, text: newTask }));
      setNewTask("");
    }
  };

  return (
    <div className="plan-detail-container">
      <div className="plan-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h2>{plan.title}</h2>
      </div>

      <p className="plan-desc">{plan.description || "No description provided."}</p>

      <div className="plan-todo-section">
        <h3>📝 To-Do Items</h3>

        <div className="add-task-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        {plan.todos && plan.todos.length > 0 ? (
          <ul className="plan-todo-list">
            {plan.todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      dispatch(toggleTodoInPlan({ planId, todoId: todo.id }))
                    }
                  />
                  <span>{todo.text}</span>
                </label>
                <button
                  className="delete-btn"
                  onClick={() =>
                    dispatch(removeTodoFromPlan({ planId, todoId: todo.id }))
                  }
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">No tasks yet. Start by adding one!</p>
        )}
      </div>
    </div>
  );
};

export default PlanDetailView;
