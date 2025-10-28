import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { removeThought, convertThought, toggleStarThought, addThoughtWithTimeout } from "../redux/thoughtsSlice";
import { removeTodo, toggleTodo, addTodo, editTodo } from "../redux/todosSlice";
import { removePlan, addPlan, editPlan } from "../redux/plansSlice";
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

  // Toggle states for showing/hiding add forms
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [showAddRandomThought, setShowAddRandomThought] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);

  // Input states for each category
  const [newIdea, setNewIdea] = useState("");
  const [newRandomThought, setNewRandomThought] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanDesc, setNewPlanDesc] = useState("");

  // Edit states
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editPlanTitle, setEditPlanTitle] = useState("");
  const [editPlanDesc, setEditPlanDesc] = useState("");

  // Update filter when initialFilter changes
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // Close all forms
        setShowAddIdea(false);
        setShowAddRandomThought(false);
        setShowAddTodo(false);
        setShowAddPlan(false);
        // Cancel all edits
        handleCancelEditTodo();
        handleCancelEditPlan();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Compute To-Do progress
  const completedCount = todos.filter((t) => t.completed).length;
  const progress =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  // Apply filter logic
  const filteredIdeas =
    filter === "All" || filter === "Ideas"
      ? thoughts.filter((t) => t.category === "Idea" && !t.starred)
      : [];
  
  const filteredStarredIdeas =
    filter === "All" || filter === "Ideas" || filter === "Starred Ideas"
      ? thoughts.filter((t) => t.category === "Idea" && t.starred)
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
    filteredStarredIdeas.length === 0 &&
    filteredRandomThoughts.length === 0 &&
    filteredTodos.length === 0 &&
    filteredPlans.length === 0;

  // Handler functions for adding items
  const handleAddIdea = (e) => {
    e.preventDefault();
    if (newIdea.trim()) {
      dispatch(addThoughtWithTimeout(newIdea, "Idea"));
      setNewIdea("");
      setShowAddIdea(false);
      toast.success("💡 Idea added successfully!");
    }
  };

  const handleAddRandomThought = (e) => {
    e.preventDefault();
    if (newRandomThought.trim()) {
      dispatch(addThoughtWithTimeout(newRandomThought, "Random Thought"));
      setNewRandomThought("");
      setShowAddRandomThought(false);
      toast.success("💭 Random thought added! (Disappears in 15s)");
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo({ id: Date.now(), text: newTodo, completed: false }));
      setNewTodo("");
      setShowAddTodo(false);
      toast.success("✅ To-do added successfully!");
    }
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (newPlanTitle.trim()) {
      dispatch(addPlan(newPlanTitle, newPlanDesc));
      setNewPlanTitle("");
      setNewPlanDesc("");
      setShowAddPlan(false);
      toast.success("📅 Plan created successfully!");
    }
  };

  // Edit handlers
  const handleEditTodo = (todo) => {
    setEditingTodoId(todo.id);
    setEditTodoText(todo.text);
  };

  const handleSaveEditTodo = (id) => {
    if (editTodoText.trim()) {
      dispatch(editTodo({ id, text: editTodoText }));
      setEditingTodoId(null);
      setEditTodoText("");
      toast.success("✏️ To-do updated!");
    }
  };

  const handleCancelEditTodo = () => {
    setEditingTodoId(null);
    setEditTodoText("");
  };

  const handleEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setEditPlanTitle(plan.title);
    setEditPlanDesc(plan.description || "");
  };

  const handleSaveEditPlan = (id) => {
    if (editPlanTitle.trim()) {
      dispatch(editPlan({ id, title: editPlanTitle, description: editPlanDesc }));
      setEditingPlanId(null);
      setEditPlanTitle("");
      setEditPlanDesc("");
      toast.success("✏️ Plan updated!");
    }
  };

  const handleCancelEditPlan = () => {
    setEditingPlanId(null);
    setEditPlanTitle("");
    setEditPlanDesc("");
  };

  // Delete confirmation handler
  const handleDeleteWithConfirm = (type, id, dispatchAction) => {
    const confirmMessage = type === "plan" 
      ? "Are you sure you want to delete this plan? All its tasks will be removed."
      : `Are you sure you want to delete this ${type}?`;
      
    if (window.confirm(confirmMessage)) {
      dispatchAction();
      toast.success(`🗑️ ${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`);
    }
  };

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
          <option value="Starred Ideas">⭐ Starred Ideas</option>
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
          padding: "60px 40px",
          color: "#888",
          fontSize: "18px",
          background: "#f8f9fa",
          borderRadius: "12px",
          margin: "20px 0"
        }}>
          <p style={{ fontSize: "48px", margin: "0 0 16px 0" }}>📭</p>
          <p style={{ fontWeight: "bold", fontSize: "20px", margin: "0 0 8px 0" }}>No items found</p>
          <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>
            {filter === "All" && "Start by adding some ideas, thoughts, to-dos, or plans using the buttons below!"}
            {filter === "Starred Ideas" && "No starred ideas yet. Star an idea to see it here!"}
            {filter === "Ideas" && "No ideas yet. Click the '+ Add Idea' button below to get started!"}
            {filter === "Random Thoughts" && "No random thoughts currently. They auto-delete after 15 seconds!"}
            {filter === "To-Dos" && "No to-dos yet. Click the '+ Add To-Do' button below to create your first task!"}
            {filter === "Plans" && "No plans yet. Click the '+ Add Plan' button below to create your first plan!"}
          </p>
        </div>
      )}

      <div className="list-grid">
        {/* === STARRED IDEAS CARD === */}
        {(filter === "All" || filter === "Ideas" || filter === "Starred Ideas") && (
          <div className="list-card">
            <h3>⭐ Starred Ideas</h3>
            {filteredStarredIdeas.length === 0 ? (
              <div style={{ 
                padding: "40px 20px", 
                textAlign: "center", 
                color: "#888",
                background: "#fffbf0",
                borderRadius: "8px",
                border: "2px dashed #ffd700"
              }}>
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>⭐</p>
                <p style={{ margin: 0 }}>No starred ideas yet</p>
                <p style={{ fontSize: "12px", marginTop: "8px", color: "#999" }}>
                  Star your favorite ideas to see them here!
                </p>
              </div>
            ) : (
              filteredStarredIdeas.map((idea) => (
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
                    <button 
                      className="star-btn"
                      onClick={() => {
                        dispatch(toggleStarThought(idea.id));
                        toast.success("⭐ Idea unstarred!");
                      }}
                      style={{
                        background: '#ffd700',
                        border: '2px solid #ffd700',
                        color: '#fff',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                      title="Unstar"
                    >
                      ⭐
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteWithConfirm("idea", idea.id, () => dispatch(removeThought(idea.id)))}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* === IDEAS CARD === */}
        {(filter === "All" || filter === "Ideas") && (
          <div className="list-card">
            <h3>💡 Ideas</h3>
            
            {/* Toggle Button */}
            {!showAddIdea ? (
              <button
                onClick={() => setShowAddIdea(true)}
                style={{
                  width: "100%",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                + Add Idea
              </button>
            ) : (
              /* Add Idea Form */
              <form onSubmit={handleAddIdea} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Add new idea..."
                    value={newIdea}
                    onChange={(e) => setNewIdea(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddIdea(false);
                      setNewIdea("");
                    }}
                    style={{
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {filteredIdeas.length === 0 ? (
              <div style={{ 
                padding: "40px 20px", 
                textAlign: "center", 
                color: "#888",
                background: "#f0f8ff",
                borderRadius: "8px",
                border: "2px dashed #007bff"
              }}>
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>💡</p>
                <p style={{ margin: 0 }}>No ideas yet</p>
                <p style={{ fontSize: "12px", marginTop: "8px", color: "#999" }}>
                  Click "+ Add Idea" to capture your brilliant thoughts!
                </p>
              </div>
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
                    <button 
                      className="star-btn"
                      onClick={() => {
                        dispatch(toggleStarThought(idea.id));
                        toast.success("⭐ Idea starred!");
                      }}
                      style={{
                        background: 'transparent',
                        border: '2px solid #ccc',
                        color: '#ccc',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                      title="Star this idea"
                    >
                      ☆
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteWithConfirm("idea", idea.id, () => dispatch(removeThought(idea.id)))}
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
            
            {/* Toggle Button */}
            {!showAddRandomThought ? (
              <button
                onClick={() => setShowAddRandomThought(true)}
                style={{
                  width: "100%",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                + Add Random Thought
              </button>
            ) : (
              /* Add Random Thought Form */
              <form onSubmit={handleAddRandomThought} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Add random thought..."
                    value={newRandomThought}
                    onChange={(e) => setNewRandomThought(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddRandomThought(false);
                      setNewRandomThought("");
                    }}
                    style={{
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {filteredRandomThoughts.length === 0 ? (
              <div style={{ 
                padding: "40px 20px", 
                textAlign: "center", 
                color: "#888",
                background: "#f5f5f5",
                borderRadius: "8px",
                border: "2px dashed #6c757d"
              }}>
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>💭</p>
                <p style={{ margin: 0 }}>No random thoughts currently</p>
                <p style={{ fontSize: "12px", marginTop: "8px", color: "#999" }}>
                  These fleeting thoughts disappear after 15 seconds!
                </p>
              </div>
            ) : (
              filteredRandomThoughts.map((thought) => (
                <RandomThoughtItem
                  key={thought.id}
                  thought={thought}
                  dispatch={dispatch}
                  convertThought={convertThought}
                  removeThought={removeThought}
                />
              ))
            )}
          </div>
        )}

        {/* === TO-DOS CARD === */}
        {(filter === "All" || filter === "To-Dos") && (
          <div className="list-card">
            <h3>📝 To-Dos</h3>
            
            {/* Toggle Button */}
            {!showAddTodo ? (
              <button
                onClick={() => setShowAddTodo(true)}
                style={{
                  width: "100%",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                + Add To-Do
              </button>
            ) : (
              /* Add Todo Form */
              <form onSubmit={handleAddTodo} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Add new to-do..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTodo(false);
                      setNewTodo("");
                    }}
                    style={{
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {filteredTodos.length === 0 ? (
              <div style={{ 
                padding: "40px 20px", 
                textAlign: "center", 
                color: "#888",
                background: "#f0fff4",
                borderRadius: "8px",
                border: "2px dashed #28a745"
              }}>
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>✅</p>
                <p style={{ margin: 0 }}>No to-dos yet</p>
                <p style={{ fontSize: "12px", marginTop: "8px", color: "#999" }}>
                  Click "+ Add To-Do" to create your first task!
                </p>
              </div>
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
                    {/* Edit mode or normal mode */}
                    {editingTodoId === todo.id ? (
                      // EDIT MODE
                      <div style={{ display: "flex", gap: "8px", flex: 1, alignItems: "center" }}>
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
                            padding: "4px 12px",
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
                            padding: "4px 12px",
                            cursor: "pointer"
                          }}
                        >
                          ✖
                        </button>
                      </div>
                    ) : (
                      // NORMAL MODE
                      <>
                        <label className="checkbox-wrapper">
                          <input 
                            type="checkbox" 
                            checked={todo.completed || false} 
                            onChange={() => {
                              dispatch(toggleTodo(todo.id));
                              if (!todo.completed) {
                                toast.success("✅ To-do completed!");
                              }
                            }}
                          />
                          <span
                            className={`todo-text ${
                              todo.completed ? "completed" : ""
                            }`}
                          >
                            {todo.text}
                          </span>
                        </label>
                        <div>
                          <button
                            onClick={() => handleEditTodo(todo)}
                            style={{
                              background: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              cursor: "pointer",
                              marginRight: "4px",
                              fontSize: "14px"
                            }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteWithConfirm("todo", todo.id, () => dispatch(removeTodo(todo.id)))}
                          >
                            ✖
                          </button>
                        </div>
                      </>
                    )}
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
            
            {/* Toggle Button */}
            {!showAddPlan ? (
              <button
                onClick={() => setShowAddPlan(true)}
                style={{
                  width: "100%",
                  background: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                + Add Plan
              </button>
            ) : (
              /* Add Plan Form */
              <form onSubmit={handleAddPlan} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Plan title..."
                    value={newPlanTitle}
                    onChange={(e) => setNewPlanTitle(e.target.value)}
                    autoFocus
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)..."
                    value={newPlanDesc}
                    onChange={(e) => setNewPlanDesc(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        cursor: "pointer"
                      }}
                    >
                      Add Plan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddPlan(false);
                        setNewPlanTitle("");
                        setNewPlanDesc("");
                      }}
                      style={{
                        flex: 1,
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {filteredPlans.length === 0 ? (
              <div style={{ 
                padding: "40px 20px", 
                textAlign: "center", 
                color: "#888",
                background: "#f0f9ff",
                borderRadius: "8px",
                border: "2px dashed #17a2b8"
              }}>
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>📅</p>
                <p style={{ margin: 0 }}>No plans yet</p>
                <p style={{ fontSize: "12px", marginTop: "8px", color: "#999" }}>
                  Click "+ Add Plan" to create your first plan!
                </p>
              </div>
            ) : (
              filteredPlans.map((plan) => (
                <div key={plan.id} className="item-card">
                  {/* Edit mode or normal mode */}
                  {editingPlanId === plan.id ? (
                    // EDIT MODE
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                      <input
                        type="text"
                        value={editPlanTitle}
                        onChange={(e) => setEditPlanTitle(e.target.value)}
                        autoFocus
                        style={{
                          padding: "6px",
                          borderRadius: "4px",
                          border: "2px solid #007bff"
                        }}
                      />
                      <input
                        type="text"
                        value={editPlanDesc}
                        onChange={(e) => setEditPlanDesc(e.target.value)}
                        placeholder="Description (optional)..."
                        style={{
                          padding: "6px",
                          borderRadius: "4px",
                          border: "2px solid #007bff"
                        }}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleSaveEditPlan(plan.id)}
                          style={{
                            flex: 1,
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            cursor: "pointer"
                          }}
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={handleCancelEditPlan}
                          style={{
                            flex: 1,
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            cursor: "pointer"
                          }}
                        >
                          ✖ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // NORMAL MODE
                    <>
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
                          onClick={() => handleEditPlan(plan)}
                          style={{
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            cursor: "pointer",
                            marginRight: "4px",
                            fontSize: "14px"
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteWithConfirm("plan", plan.id, () => dispatch(removePlan(plan.id)))}
                        >
                          ✖
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Random Thought Item with Timer Component
const RandomThoughtItem = ({ thought, dispatch, convertThought, removeThought }) => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const createdTime = new Date(thought.createdAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - createdTime) / 1000);
    const remaining = Math.max(0, 15 - elapsed);
    
    setTimeLeft(remaining);

    if (remaining > 0) {
      const timer = setInterval(() => {
        const newElapsed = Math.floor((Date.now() - createdTime) / 1000);
        const newRemaining = Math.max(0, 15 - newElapsed);
        setTimeLeft(newRemaining);
        
        if (newRemaining === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [thought.createdAt]);

  const progress = (timeLeft / 15) * 100;

  return (
    <div key={thought.id} className="item-card" style={{ position: "relative", overflow: "hidden" }}>
      {/* Timer Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "4px",
          width: `${progress}%`,
          background: timeLeft <= 5 ? "#ff4444" : "#ffd700",
          transition: "width 1s linear"
        }}
      />
      
      <div style={{ flex: 1 }}>
        <strong>{thought.text}</strong>
        <div style={{ 
          fontSize: "12px", 
          color: timeLeft <= 5 ? "#ff4444" : "#666",
          marginTop: "4px",
          fontWeight: "bold"
        }}>
          ⏱️ Expires in {timeLeft}s
        </div>
      </div>
      <div>
        <button
          className="convert-btn"
          onClick={() => {
            dispatch(convertThought({ id: thought.id, newCategory: "Idea" }));
            toast.success("💡 Converted to Idea!");
          }}
          title="Convert to Idea (Save it!)"
          style={{
            background: "#ffd700",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            marginRight: "4px",
            fontSize: "16px"
          }}
        >
          💡
        </button>
        <button
          className="delete-btn"
          onClick={() => {
            dispatch(removeThought(thought.id));
            toast.success("🗑️ Random thought deleted!");
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default ListView;