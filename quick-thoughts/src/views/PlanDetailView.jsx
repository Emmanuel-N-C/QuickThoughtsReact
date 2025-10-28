import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { addTodoToPlan, toggleTodoInPlan, removeTodoFromPlan, editTodoInPlan } from "../redux/plansSlice";
import { removeTodo } from "../redux/todosSlice";
import { getPlanStats } from "../utilities";
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
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");

  // Keyboard shortcuts
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCancelEditTodo();
        setShowExistingTodos(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

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

  const stats = getPlanStats(plan);

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch(addTodoToPlan({ planId, text: newTask }));
      setNewTask("");
      toast.success("✅ Task added to plan!");
    }
  };

  const handleAddExistingTodo = (todoId, todoText) => {
    // Add to plan's internal todos
    dispatch(addTodoToPlan({ planId, text: todoText }));
    // Remove from global todo list (since it's now in the plan)
    dispatch(removeTodo(todoId));
    toast.success("✅ To-do moved to plan!");
  };

  const handleEditTodo = (todo) => {
    setEditingTodoId(todo.id);
    setEditTodoText(todo.text);
  };

  const handleSaveEditTodo = (todoId) => {
    if (editTodoText.trim()) {
      dispatch(editTodoInPlan({ planId, todoId, text: editTodoText }));
      setEditingTodoId(null);
      setEditTodoText("");
      toast.success("✏️ Task updated!");
    }
  };

  const handleCancelEditTodo = () => {
    setEditingTodoId(null);
    setEditTodoText("");
  };

  const handleDeleteWithConfirm = (todoId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(removeTodoFromPlan({ planId, todoId }));
      toast.success("🗑️ Task deleted!");
    }
  };

  return (
    <div className="plan-detail-container">
      <div className="plan-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>{plan.title}</h2>
          {stats.total > 0 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "8px"
            }}>
              <div style={{
                flex: 1,
                maxWidth: "300px",
                height: "8px",
                background: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${stats.percentage}%`,
                  height: "100%",
                  background: stats.percentage === 100 ? "#28a745" : "#007bff",
                  transition: "width 0.3s ease"
                }} />
              </div>
              <span style={{
                background: stats.percentage === 100 ? "#28a745" : "#007bff",
                color: "white",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                {stats.completed}/{stats.total} Complete ({stats.percentage}%)
              </span>
            </div>
          )}
        </div>
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
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
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
                {/* Edit mode or normal mode */}
                {editingTodoId === todo.id ? (
                  // EDIT MODE
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flex: 1 }}>
                    <input
                      type="text"
                      value={editTodoText}
                      onChange={(e) => setEditTodoText(e.target.value)}
                      autoFocus
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "4px",
                        border: "2px solid #007bff"
                      }}
                    />
                    <button
                      onClick={() => handleSaveEditTodo(todo.id)}
                      style={{
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer"
                      }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEditTodo}
                      style={{
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer"
                      }}
                    >
                      ✖
                    </button>
                  </div>
                ) : (
                  // NORMAL MODE
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => {
                          dispatch(toggleTodoInPlan({ planId, todoId: todo.id }));
                          if (!todo.completed) {
                            toast.success("✅ Task completed!");
                          }
                        }}
                      />
                      <span>{todo.text}</span>
                    </label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => handleEditTodo(todo)}
                        style={{
                          background: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteWithConfirm(todo.id)}
                      >
                        ✖
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "#888",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "2px dashed #ddd"
          }}>
            <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>📝</p>
            <p style={{ margin: 0 }}>No tasks yet</p>
            <p style={{ fontSize: "12px", marginTop: "8px", color: "#999" }}>
              Start by adding a new task or importing from your to-do list!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetailView;