import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodoToPlan, toggleTodoInPlan, removeTodoFromPlan } from "../redux/plansSlice";
import { removeTodo } from "../redux/todosSlice"; // ✅ Import removeTodo instead of assignTodoToPlan
import "./PlanDetailView.css";

const PlanDetailView = ({ planId, onBack }) => {
  const dispatch = useDispatch();
  const plan = useSelector((state) =>
    state.plans.find((p) => p.id === planId)
  );
  
  // Get all global todos that are not completed
  const globalTodos = useSelector((state) => state.todos);
  const availableTodos = globalTodos.filter((todo) => !todo.completed);

  const [newTask, setNewTask] = useState("");
  const [showExistingTodos, setShowExistingTodos] = useState(false);

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

  const handleAddExistingTodo = (todoId, todoText) => {
    // Add to plan's internal todos
    dispatch(addTodoToPlan({ planId, text: todoText }));
    // ✅ Remove from global todo list (since it's now in the plan)
    dispatch(removeTodo(todoId));
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

        {/* Add New Task Form */}
        <div className="add-task-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>Add New</button>
        </div>

        {/* Toggle to show existing todos */}
        {availableTodos.length > 0 && (
          <div style={{ marginTop: "10px", marginBottom: "15px" }}>
            <button
              onClick={() => setShowExistingTodos(!showExistingTodos)}
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                width: "100%"
              }}
            >
              {showExistingTodos ? "Hide" : "Add"} Existing To-Dos ({availableTodos.length})
            </button>
          </div>
        )}

        {/* Existing Todos Section */}
        {showExistingTodos && availableTodos.length > 0 && (
          <div
            style={{
              background: "#f0f8ff",
              border: "2px dashed #007bff",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px"
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#007bff" }}>
              Available To-Dos
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {availableTodos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px",
                    background: "white",
                    borderRadius: "4px",
                    marginBottom: "8px",
                    border: "1px solid #ddd"
                  }}
                >
                  <span>{todo.text}</span>
                  <button
                    onClick={() => handleAddExistingTodo(todo.id, todo.text)}
                    style={{
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 12px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    + Add to Plan
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Current Plan Todos */}
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