import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { FaLightbulb, FaBrain, FaCheckCircle, FaCalendarAlt, FaStar, FaRegStar, FaTrash, FaEdit, FaSave, FaTimes, FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa';
import { MdDragIndicator } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { removeThought, convertThought, toggleStarThought, addThoughtWithTimeout } from "../redux/thoughtsSlice";
import { removeTodo, toggleTodo, addTodo, editTodo, reorderTodos, batchDeleteTodos, batchToggleTodos } from "../redux/todosSlice";
import { removePlan, addPlan, editPlan, batchDeletePlans } from "../redux/plansSlice";
import PlanDetailView from "./PlanDetailView";
import { getRelativeTime, searchItems, calculatePlanProgress, formatDate, getDueDateBadgeStyle } from "../utilities";
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
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle states for showing/hiding add forms
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [showAddRandomThought, setShowAddRandomThought] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);

  // Input states for each category
  const [newIdea, setNewIdea] = useState("");
  const [newRandomThought, setNewRandomThought] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanDesc, setNewPlanDesc] = useState("");
  const [newPlanDueDate, setNewPlanDueDate] = useState("");

  // Edit states
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");
  const [editTodoDueDate, setEditTodoDueDate] = useState("");
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editPlanTitle, setEditPlanTitle] = useState("");
  const [editPlanDesc, setEditPlanDesc] = useState("");
  const [editPlanDueDate, setEditPlanDueDate] = useState("");

  // Batch selection mode
  const [batchMode, setBatchMode] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);

  // Drag and drop state
  const [draggedTodoId, setDraggedTodoId] = useState(null);

  // Update filter when initialFilter changes
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  // Exit batch mode when changing filters
  useEffect(() => {
    setBatchMode(false);
    setSelectedTodos([]);
    setSelectedPlans([]);
  }, [filter, searchTerm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (batchMode) {
          setBatchMode(false);
          setSelectedTodos([]);
          setSelectedPlans([]);
        } else {
          setShowAddIdea(false);
          setShowAddRandomThought(false);
          setShowAddTodo(false);
          setShowAddPlan(false);
          handleCancelEditTodo();
          handleCancelEditPlan();
          setSearchTerm("");
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [batchMode]);

  // Compute To-Do progress
  const completedCount = todos.filter((t) => t.completed).length;
  const progress =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  // Apply filter logic and search
  const allIdeas = thoughts.filter((t) => t.category === "Idea" && !t.starred);
  const allStarredIdeas = thoughts.filter((t) => t.category === "Idea" && t.starred);
  const allRandomThoughts = thoughts.filter((t) => t.category === "Random Thought");
  
  const filteredIdeas = searchItems(
    filter === "All" || filter === "Ideas" ? allIdeas : [],
    searchTerm,
    'thoughts'
  );
  
  const filteredStarredIdeas = searchItems(
    filter === "All" || filter === "Ideas" || filter === "Starred Ideas" ? allStarredIdeas : [],
    searchTerm,
    'thoughts'
  );

  const filteredRandomThoughts = searchItems(
    filter === "All" || filter === "Random Thoughts" ? allRandomThoughts : [],
    searchTerm,
    'thoughts'
  );
  
  const filteredTodos = searchItems(
    filter === "All" || filter === "To-Dos" ? todos : [],
    searchTerm,
    'todos'
  );
  
  const filteredPlans = searchItems(
    filter === "All" || filter === "Plans" ? plans : [],
    searchTerm,
    'plans'
  );

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
      dispatch(addTodo({ 
        id: Date.now(), 
        text: newTodo, 
        completed: false,
        dueDate: newTodoDueDate || null
      }));
      setNewTodo("");
      setNewTodoDueDate("");
      setShowAddTodo(false);
      toast.success("✅ To-do added successfully!");
    }
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (newPlanTitle.trim()) {
      dispatch(addPlan(newPlanTitle, newPlanDesc, newPlanDueDate || null));
      setNewPlanTitle("");
      setNewPlanDesc("");
      setNewPlanDueDate("");
      setShowAddPlan(false);
      toast.success("📅 Plan created successfully!");
    }
  };

  // Edit handlers
  const handleEditTodo = (todo) => {
    setEditingTodoId(todo.id);
    setEditTodoText(todo.text);
    setEditTodoDueDate(todo.dueDate || "");
  };

  const handleSaveEditTodo = (id) => {
    if (editTodoText.trim()) {
      dispatch(editTodo({ 
        id, 
        text: editTodoText,
        dueDate: editTodoDueDate || null
      }));
      setEditingTodoId(null);
      setEditTodoText("");
      setEditTodoDueDate("");
      toast.success("✏️ To-do updated!");
    }
  };

  const handleCancelEditTodo = () => {
    setEditingTodoId(null);
    setEditTodoText("");
    setEditTodoDueDate("");
  };

  const handleEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setEditPlanTitle(plan.title);
    setEditPlanDesc(plan.description || "");
    setEditPlanDueDate(plan.dueDate || "");
  };

  const handleSaveEditPlan = (id) => {
    if (editPlanTitle.trim()) {
      dispatch(editPlan({ 
        id, 
        title: editPlanTitle, 
        description: editPlanDesc,
        dueDate: editPlanDueDate || null
      }));
      setEditingPlanId(null);
      setEditPlanTitle("");
      setEditPlanDesc("");
      setEditPlanDueDate("");
      toast.success("✏️ Plan updated!");
    }
  };

  const handleCancelEditPlan = () => {
    setEditingPlanId(null);
    setEditPlanTitle("");
    setEditPlanDesc("");
    setEditPlanDueDate("");
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

  // Batch selection handlers
  const toggleTodoSelection = (todoId) => {
    setSelectedTodos(prev => 
      prev.includes(todoId) 
        ? prev.filter(id => id !== todoId)
        : [...prev, todoId]
    );
  };

  const togglePlanSelection = (planId) => {
    setSelectedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const selectAllTodos = () => {
    setSelectedTodos(filteredTodos.map(t => t.id));
  };

  const selectAllPlans = () => {
    setSelectedPlans(filteredPlans.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedTodos([]);
    setSelectedPlans([]);
  };

  const handleBatchDelete = () => {
    if (selectedTodos.length === 0 && selectedPlans.length === 0) {
      toast.error("No items selected!");
      return;
    }

    const confirmMsg = `Delete ${selectedTodos.length} todo(s) and ${selectedPlans.length} plan(s)?`;
    if (window.confirm(confirmMsg)) {
      if (selectedTodos.length > 0) {
        dispatch(batchDeleteTodos(selectedTodos));
      }
      if (selectedPlans.length > 0) {
        dispatch(batchDeletePlans(selectedPlans));
      }
      toast.success(`🗑️ Deleted ${selectedTodos.length + selectedPlans.length} items!`);
      setSelectedTodos([]);
      setSelectedPlans([]);
      setBatchMode(false);
    }
  };

  const handleBatchToggle = () => {
    if (selectedTodos.length === 0) {
      toast.error("No todos selected!");
      return;
    }

    dispatch(batchToggleTodos(selectedTodos));
    toast.success(`✅ Toggled ${selectedTodos.length} todo(s)!`);
    setSelectedTodos([]);
  };

  // Drag and drop handlers
  const handleDragStart = (e, todoId) => {
    setDraggedTodoId(todoId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTodoId) => {
    e.preventDefault();
    
    if (draggedTodoId === targetTodoId) return;

    const draggedIndex = filteredTodos.findIndex(t => t.id === draggedTodoId);
    const targetIndex = filteredTodos.findIndex(t => t.id === targetTodoId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const reorderedTodos = [...todos];
    const [draggedTodo] = reorderedTodos.splice(draggedIndex, 1);
    reorderedTodos.splice(targetIndex, 0, draggedTodo);

    dispatch(reorderTodos(reorderedTodos));
    toast.success("📦 Todo reordered!");
    setDraggedTodoId(null);
  };

  const handleDragEnd = () => {
    setDraggedTodoId(null);
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
        className="back-btn"
      >
        <FaArrowLeft style={{ marginRight: '8px' }} />
        Back to Overview
      </button>

      <h2 className="listview-title">
        <FaFilter style={{ marginRight: '8px' }} />
        List View
      </h2>
      <p className="listview-subtitle">
        Your saved ideas, to-dos, and plans — neatly organized.
      </p>

      {/* Batch Mode Toggle */}
      {(filter === "All" || filter === "To-Dos" || filter === "Plans") && (
        <div className="batch-mode-controls">
          <button
            onClick={() => {
              setBatchMode(!batchMode);
              if (batchMode) {
                setSelectedTodos([]);
                setSelectedPlans([]);
              }
            }}
            style={{
              background: batchMode ? "#dc3545" : "#6366f1",
              color: "white",
            }}
          >
            {batchMode ? <><FaTimes style={{ marginRight: '6px' }} /> Exit Batch Mode</> : <>☑️ Batch Selection Mode</>}
          </button>

          {batchMode && (
            <>
              <span style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>
                Selected: {selectedTodos.length + selectedPlans.length} items
              </span>
              <button onClick={deselectAll} style={{ background: "#6c757d", color: "white" }}>
                Clear Selection
              </button>
              {selectedTodos.length > 0 && (
                <button onClick={handleBatchToggle} style={{ background: "#17a2b8", color: "white" }}>
                  <FaCheckCircle style={{ marginRight: '6px' }} />
                  Toggle Completed
                </button>
              )}
              <button onClick={handleBatchDelete} style={{ background: "#dc3545", color: "white" }}>
                <FaTrash style={{ marginRight: '6px' }} />
                Delete Selected
              </button>
            </>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative" }}>
          <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            type="text"
            placeholder="🔍 Search across all items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{
              width: "100%",
              padding: "12px 16px 12px 48px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "12px",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#6366f1"}
            onBlur={(e) => e.target.style.borderColor = "#ddd"}
          />
        </div>
        {searchTerm && (
          <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#666" }}>
              Found: {filteredIdeas.length + filteredStarredIdeas.length + filteredRandomThoughts.length + filteredTodos.length + filteredPlans.length} items
            </span>
            <button
              onClick={() => setSearchTerm("")}
              style={{
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 12px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      <div className="filter-container">
        <label>
          <FaFilter style={{ marginRight: '6px' }} />
          Filter by:
        </label>
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
        <div className="empty-state-card">
          <span className="empty-state-icon">
            {searchTerm ? <FaSearch /> : <HiSparkles />}
          </span>
          <p style={{ fontWeight: "bold", fontSize: "20px", margin: "0 0 8px 0" }}>
            {searchTerm ? "No results found" : "No items found"}
          </p>
          <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>
            {searchTerm 
              ? `No items match "${searchTerm}". Try a different search term.`
              : filter === "All" ? "Start by adding some ideas, thoughts, to-dos, or plans!"
              : `No ${filter.toLowerCase()} yet. Create one to get started!`
            }
          </p>
        </div>
      )}

      <div className="list-grid">
        {/* STARRED IDEAS CARD */}
        {(filter === "All" || filter === "Ideas" || filter === "Starred Ideas") && (
          <div className="list-card">
            <h3>
              <FaStar style={{ color: "#fbbf24" }} />
              Starred Ideas
            </h3>
            {filteredStarredIdeas.length === 0 ? (
              <div className="empty-state-card">
                <span className="empty-state-icon">
                  <FaStar style={{ color: "#fbbf24" }} />
                </span>
                <p>{searchTerm ? "No matching starred ideas" : "No starred ideas yet"}</p>
                <p style={{ fontSize: "12px", marginTop: "8px", color: "#999" }}>
                  Star your favorite ideas to see them here!
                </p>
              </div>
            ) : (
              filteredStarredIdeas.map((idea) => (
                <div key={idea.id} className="item-card">
                  <div>
                    <strong>{idea.text}</strong>
                    <div className="item-date">{getRelativeTime(idea.createdAt)}</div>
                  </div>
                  <div>
                    <button 
                      className="star-btn"
                      onClick={() => {
                        dispatch(toggleStarThought(idea.id));
                        toast.success("Idea unstarred!");
                      }}
                      style={{
                        background: '#fbbf24',
                        border: '2px solid #fbbf24',
                        color: '#fff',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}
                      title="Unstar"
                    >
                      <FaStar />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteWithConfirm("idea", idea.id, () => dispatch(removeThought(idea.id)))}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* IDEAS CARD */}
        {(filter === "All" || filter === "Ideas") && (
          <div className="list-card">
            <h3>
              <FaLightbulb style={{ color: "#fbbf24" }} />
              Ideas
            </h3>
            
            {!showAddIdea ? (
              <button
                onClick={() => setShowAddIdea(true)}
                style={{
                  width: "100%",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <FaLightbulb />
                Add Idea
              </button>
            ) : (
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
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <FaSave />
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
                      borderRadius: "8px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </form>
            )}

            {filteredIdeas.length === 0 ? (
              <div className="empty-state-card">
                <span className="empty-state-icon">
                  <FaLightbulb />
                </span>
                <p>{searchTerm ? "No matching ideas" : "No ideas yet"}</p>
              </div>
            ) : (
              filteredIdeas.map((idea) => (
                <div key={idea.id} className="item-card">
                  <div>
                    <strong>{idea.text}</strong>
                    <div className="item-date">{getRelativeTime(idea.createdAt)}</div>
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
                        border: '2px solid #d1d5db',
                        color: '#d1d5db',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}
                      title="Star this idea"
                    >
                      <FaRegStar />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteWithConfirm("idea", idea.id, () => dispatch(removeThought(idea.id)))}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* RANDOM THOUGHTS CARD */}
        {(filter === "All" || filter === "Random Thoughts") && (
          <div className="list-card">
            <h3>
              <FaBrain style={{ color: "#8b5cf6" }} />
              Random Thoughts
            </h3>
            
            {!showAddRandomThought ? (
              <button
                onClick={() => setShowAddRandomThought(true)}
                style={{
                  width: "100%",
                  background: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <FaBrain />
                Add Random Thought
              </button>
            ) : (
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
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    <FaSave />
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
                      borderRadius: "8px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </form>
            )}

            {filteredRandomThoughts.length === 0 ? (
              <div className="empty-state-card">
                <span className="empty-state-icon">
                  <FaBrain />
                </span>
                <p>{searchTerm ? "No matching thoughts" : "No random thoughts currently"}</p>
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

        {/* TO-DOS CARD */}
        {(filter === "All" || filter === "To-Dos") && (
          <div className="list-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0 }}>
                <FaCheckCircle style={{ color: "#10b981" }} />
                To-Dos
              </h3>
              {filteredTodos.length > 0 && (
                <div className="progress-badge">
                  {progress}% Complete
                </div>
              )}
            </div>
            
            {batchMode && (filter === "All" || filter === "To-Dos") && filteredTodos.length > 0 && (
              <button
                onClick={selectAllTodos}
                style={{
                  width: "100%",
                  background: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px",
                  cursor: "pointer",
                  marginBottom: "10px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                ☑️ Select All Todos
              </button>
            )}

            {!showAddTodo ? (
              <button
                onClick={() => setShowAddTodo(true)}
                style={{
                  width: "100%",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <FaCheckCircle />
                Add To-Do
              </button>
            ) : (
              <form onSubmit={handleAddTodo} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Add new to-do..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    autoFocus
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb"
                    }}
                  />
                  <input
                    type="date"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb"
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <FaSave /> Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddTodo(false);
                        setNewTodo("");
                        setNewTodoDueDate("");
                      }}
                      style={{
                        flex: 1,
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer"
                      }}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {filteredTodos.length === 0 ? (
              <div className="empty-state-card">
                <span className="empty-state-icon">
                  <FaCheckCircle />
                </span>
                <p>{searchTerm ? "No matching to-dos" : "No to-dos yet"}</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div 
                  key={todo.id} 
                  className="item-card"
                  draggable={!batchMode && !editingTodoId}
                  onDragStart={(e) => handleDragStart(e, todo.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, todo.id)}
                  onDragEnd={handleDragEnd}
                  style={{
                    opacity: draggedTodoId === todo.id ? 0.5 : 1,
                    cursor: !batchMode && !editingTodoId ? 'grab' : 'default',
                    border: selectedTodos.includes(todo.id) ? '2px solid #6366f1' : '2px solid transparent'
                  }}
                >
                  {batchMode && (
                    <input
                      type="checkbox"
                      checked={selectedTodos.includes(todo.id)}
                      onChange={() => toggleTodoSelection(todo.id)}
                      style={{ marginRight: "12px", cursor: "pointer", width: "18px", height: "18px" }}
                    />
                  )}

                  {editingTodoId === todo.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                      <input
                        type="text"
                        value={editTodoText}
                        onChange={(e) => setEditTodoText(e.target.value)}
                        autoFocus
                        style={{
                          padding: "8px",
                          borderRadius: "6px",
                          border: "2px solid #6366f1"
                        }}
                      />
                      <input
                        type="date"
                        value={editTodoDueDate}
                        onChange={(e) => setEditTodoDueDate(e.target.value)}
                        style={{
                          padding: "8px",
                          borderRadius: "6px",
                          border: "2px solid #6366f1"
                        }}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleSaveEditTodo(todo.id)}
                          style={{
                            flex: 1,
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          onClick={handleCancelEditTodo}
                          style={{
                            flex: 1,
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px",
                            cursor: "pointer"
                          }}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        {!batchMode && <MdDragIndicator style={{ color: "#9ca3af", marginRight: "8px", fontSize: "20px" }} />}
                        <label className="checkbox-wrapper">
                          <input 
                            type="checkbox" 
                            checked={todo.completed || false} 
                            onChange={() => {
                              if (!batchMode) {
                                dispatch(toggleTodo(todo.id));
                                if (!todo.completed) {
                                  toast.success("✅ To-do completed!");
                                }
                              }
                            }}
                            disabled={batchMode}
                          />
                          <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
                            {todo.text}
                          </span>
                        </label>
                        {todo.dueDate && (
                          <div className="due-date-badge" style={{ 
                            marginTop: "6px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            ...getDueDateBadgeStyle(todo.dueDate)
                          }}>
                            <FaCalendarAlt />
                            {formatDate(todo.dueDate)} - {getDueDateBadgeStyle(todo.dueDate)?.label}
                          </div>
                        )}
                      </div>
                      {!batchMode && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            onClick={() => handleEditTodo(todo)}
                            style={{
                              background: "#6366f1",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 10px",
                              cursor: "pointer",
                              fontSize: "14px"
                            }}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteWithConfirm("todo", todo.id, () => dispatch(removeTodo(todo.id)))}
                            style={{
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 10px",
                              cursor: "pointer"
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* PLANS CARD */}
        {(filter === "All" || filter === "Plans") && (
          <div className="list-card">
            <h3>
              <FaCalendarAlt style={{ color: "#6366f1" }} />
              Plans
            </h3>
            
            {batchMode && (filter === "All" || filter === "Plans") && filteredPlans.length > 0 && (
              <button
                onClick={selectAllPlans}
                style={{
                  width: "100%",
                  background: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px",
                  cursor: "pointer",
                  marginBottom: "10px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                ☑️ Select All Plans
              </button>
            )}

            {!showAddPlan ? (
              <button
                onClick={() => setShowAddPlan(true)}
                style={{
                  width: "100%",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <FaCalendarAlt />
                Add Plan
              </button>
            ) : (
              <form onSubmit={handleAddPlan} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Plan title..."
                    value={newPlanTitle}
                    onChange={(e) => setNewPlanTitle(e.target.value)}
                    autoFocus
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)..."
                    value={newPlanDesc}
                    onChange={(e) => setNewPlanDesc(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb"
                    }}
                  />
                  <input
                    type="date"
                    value={newPlanDueDate}
                    onChange={(e) => setNewPlanDueDate(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb"
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <FaSave /> Add Plan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddPlan(false);
                        setNewPlanTitle("");
                        setNewPlanDesc("");
                        setNewPlanDueDate("");
                      }}
                      style={{
                        flex: 1,
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer"
                      }}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {filteredPlans.length === 0 ? (
              <div className="empty-state-card">
                <span className="empty-state-icon">
                  <FaCalendarAlt />
                </span>
                <p>{searchTerm ? "No matching plans" : "No plans yet"}</p>
              </div>
            ) : (
              filteredPlans.map((plan) => {
                const planProgress = calculatePlanProgress(plan);
                const totalTasks = plan.todos?.length || 0;
                const completedTasks = plan.todos?.filter(t => t.completed).length || 0;
                
                return (
                  <div 
                    key={plan.id} 
                    className="item-card"
                    style={{
                      border: selectedPlans.includes(plan.id) ? '2px solid #6366f1' : '2px solid transparent'
                    }}
                  >
                    {batchMode && (
                      <input
                        type="checkbox"
                        checked={selectedPlans.includes(plan.id)}
                        onChange={() => togglePlanSelection(plan.id)}
                        style={{ marginRight: "12px", cursor: "pointer", width: "18px", height: "18px" }}
                      />
                    )}

                    {editingPlanId === plan.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                        <input
                          type="text"
                          value={editPlanTitle}
                          onChange={(e) => setEditPlanTitle(e.target.value)}
                          autoFocus
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "2px solid #6366f1"
                          }}
                        />
                        <input
                          type="text"
                          value={editPlanDesc}
                          onChange={(e) => setEditPlanDesc(e.target.value)}
                          placeholder="Description (optional)..."
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "2px solid #6366f1"
                          }}
                        />
                        <input
                          type="date"
                          value={editPlanDueDate}
                          onChange={(e) => setEditPlanDueDate(e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "2px solid #6366f1"
                          }}
                        />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleSaveEditPlan(plan.id)}
                            style={{
                              flex: 1,
                              background: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              padding: "8px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px"
                            }}
                          >
                            <FaSave /> Save
                          </button>
                          <button
                            onClick={handleCancelEditPlan}
                            style={{
                              flex: 1,
                              background: "#6c757d",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              padding: "8px",
                              cursor: "pointer"
                            }}
                          >
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <strong
                              className="clickable"
                              onClick={() => !batchMode && setSelectedPlan(plan.id)}
                              style={{ cursor: batchMode ? 'default' : 'pointer' }}
                            >
                              {plan.title}
                            </strong>
                            {totalTasks > 0 && (
                              <span style={{
                                background: planProgress === 100 ? "#10b981" : "#6366f1",
                                color: "white",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: "bold"
                              }}>
                                {completedTasks}/{totalTasks}
                              </span>
                            )}
                          </div>
                          <p className="item-desc" style={{ margin: "4px 0" }}>
                            {plan.description || "No description"}
                          </p>
                          {plan.dueDate && (
                            <div className="due-date-badge" style={{ 
                              marginTop: "6px",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              ...getDueDateBadgeStyle(plan.dueDate)
                            }}>
                              <FaCalendarAlt />
                              {formatDate(plan.dueDate)} - {getDueDateBadgeStyle(plan.dueDate)?.label}
                            </div>
                          )}
                          {totalTasks > 0 && (
                            <div style={{ marginTop: "10px" }}>
                              <div style={{
                                width: "100%",
                                height: "6px",
                                background: "#e5e7eb",
                                borderRadius: "3px",
                                overflow: "hidden"
                              }}>
                                <div style={{
                                  width: `${planProgress}%`,
                                  height: "100%",
                                  background: planProgress === 100 ? "#10b981" : "#6366f1",
                                  transition: "width 0.5s ease"
                                }} />
                              </div>
                              <div style={{
                                fontSize: "11px",
                                color: "#6b7280",
                                marginTop: "4px"
                              }}>
                                {planProgress}% complete
                              </div>
                            </div>
                          )}
                        </div>
                        {!batchMode && (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              onClick={() => handleEditPlan(plan)}
                              style={{
                                background: "#6366f1",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                cursor: "pointer",
                                fontSize: "14px"
                              }}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteWithConfirm("plan", plan.id, () => dispatch(removePlan(plan.id)))}
                              style={{
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                cursor: "pointer"
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
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
    <div className="item-card" style={{ position: "relative", overflow: "hidden" }}>
      {/* Timer Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "4px",
          width: `${progress}%`,
          background: timeLeft <= 5 ? "#ef4444" : "#8b5cf6",
          transition: "width 1s linear"
        }}
      />
      
      <div style={{ flex: 1 }}>
        <strong>{thought.text}</strong>
        <div style={{ 
          fontSize: "12px", 
          color: timeLeft <= 5 ? "#ef4444" : "#6b7280",
          marginTop: "4px",
          fontWeight: "600"
        }}>
          ⏱️ Expires in {timeLeft}s
        </div>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={() => {
            dispatch(convertThought({ id: thought.id, newCategory: "Idea" }));
            toast.success("💡 Converted to Idea!");
          }}
          title="Convert to Idea (Save it!)"
          style={{
            background: "#fbbf24",
            border: "none",
            borderRadius: "6px",
            padding: "6px 10px",
            cursor: "pointer",
            color: "white",
            fontSize: "14px"
          }}
        >
          <FaLightbulb />
        </button>
        <button
          onClick={() => {
            dispatch(removeThought(thought.id));
            toast.success("🗑️ Random thought deleted!");
          }}
          style={{
            background: "#ef4444",
            border: "none",
            borderRadius: "6px",
            padding: "6px 10px",
            cursor: "pointer",
            color: "white"
          }}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ListView;