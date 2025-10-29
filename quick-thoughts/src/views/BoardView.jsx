import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaCalendarAlt, FaPlus, FaCheckCircle, FaClock, FaFire } from 'react-icons/fa';
import { MdDragIndicator } from 'react-icons/md';
import { addTodoToPlan, reorderTodosInPlan } from "../redux/plansSlice";
import toast from 'react-hot-toast';
import { calculatePlanProgress } from "../utilities";
import "./BoardView.css";

const BoardView = () => {
  const dispatch = useDispatch();
  const plans = useSelector((state) => state.plans);

  const [selectedPlanId, setSelectedPlanId] = useState(
    plans.length > 0 ? plans[0].id : null
  );
  const [newTask, setNewTask] = useState("");
  const [hoveredPlanId, setHoveredPlanId] = useState(null);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId),
    [plans, selectedPlanId]
  );

  // Group todos safely by status - SIMPLER VERSION
  const todosByStatus = useMemo(() => {
    if (!selectedPlan || !selectedPlan.todos) return { todo: [], inprogress: [], done: [] };

    return {
      todo: selectedPlan.todos.filter((t) => (t.status || "todo") === "todo"),
      inprogress: selectedPlan.todos.filter((t) => (t.status || "todo") === "inprogress"),
      done: selectedPlan.todos.filter((t) => (t.status || "todo") === "done"),
    };
  }, [selectedPlan]);

  const handleAddTask = () => {
    if (!newTask.trim() || !selectedPlanId) return;
    dispatch(addTodoToPlan({ planId: selectedPlanId, text: newTask }));
    setNewTask("");
    toast.success("✅ Task added to plan!");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination, source } = result;
    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    // Use the new reorderTodosInPlan action for both reordering and status changes
    dispatch(
      reorderTodosInPlan({
        planId: selectedPlanId,
        todoId: draggableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
        sourceStatus: sourceStatus,
        destinationStatus: destinationStatus,
      })
    );

    // Show appropriate toast based on the action
    if (sourceStatus !== destinationStatus) {
      if (destinationStatus === "done") {
        toast.success("✅ Task completed!");
      } else if (destinationStatus === "inprogress") {
        toast("🚧 Task moved to In Progress");
      } else if (destinationStatus === "todo") {
        toast("📝 Task moved to To Do");
      }
    } else {
      // Just reordered within the same column
      toast.success("📦 Task reordered!");
    }
  };

  return (
    <div className="board-container">
      {/* Sidebar */}
      <aside className="board-sidebar">
        <h3>
          <FaCalendarAlt style={{ marginRight: '8px', color: '#6366f1' }} />
          My Plans
        </h3>
        {plans.length === 0 ? (
          <div style={{
            padding: "30px 20px",
            textAlign: "center",
            color: "#9ca3af",
            background: "#f9fafb",
            borderRadius: "12px",
            margin: "10px 0",
            border: "2px dashed #e5e7eb"
          }}>
            <p style={{ fontSize: "48px", margin: "0 0 12px 0", opacity: 0.5 }}>
              <FaCalendarAlt />
            </p>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "500" }}>No plans yet</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
              Create a plan to get started
            </p>
          </div>
        ) : (
          plans.map((plan) => {
            const progress = calculatePlanProgress(plan);
            const totalTasks = plan.todos?.length || 0;
            const completedTasks = plan.todos?.filter(t => t.completed).length || 0;
            
            return (
              <div
                key={plan.id}
                className={`plan-item ${
                  selectedPlanId === plan.id ? "active" : ""
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
                onMouseEnter={() => setHoveredPlanId(plan.id)}
                onMouseLeave={() => setHoveredPlanId(null)}
                style={{ position: "relative" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", fontWeight: selectedPlanId === plan.id ? "600" : "500" }}>
                    {plan.title}
                  </span>
                  {totalTasks > 0 && (
                    <span style={{
                      background: progress === 100 ? "#10b981" : selectedPlanId === plan.id ? "rgba(255,255,255,0.3)" : "#6366f1",
                      color: "white",
                      padding: "3px 8px",
                      borderRadius: "10px",
                      fontSize: "10px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <FaCheckCircle style={{ fontSize: "8px" }} />
                      {completedTasks}/{totalTasks}
                    </span>
                  )}
                </div>
                
                {/* Progress bar */}
                {totalTasks > 0 && (
                  <div style={{
                    width: "100%",
                    height: "4px",
                    background: selectedPlanId === plan.id ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                    borderRadius: "2px",
                    marginTop: "8px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: selectedPlanId === plan.id ? "white" : progress === 100 ? "#10b981" : "#6366f1",
                      transition: "width 0.5s ease"
                    }} />
                  </div>
                )}
                
                {/* Tooltip for plan description */}
                {hoveredPlanId === plan.id && plan.description && (
                  <div
                    style={{
                      position: "absolute",
                      left: "110%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "#1f2937",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      maxWidth: "250px",
                      zIndex: 1000,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      pointerEvents: "none"
                    }}
                  >
                    {plan.description}
                    <div
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 0,
                        height: 0,
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                        borderRight: "6px solid #1f2937"
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </aside>

      {/* Main Board */}
      <main className="board-main">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <h2 style={{ margin: 0 }}>
            <MdDragIndicator style={{ marginRight: '8px', color: '#6366f1' }} />
            Board View
          </h2>
        </div>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Drag and drop your tasks between stages and reorder within columns.
        </p>

        {selectedPlan ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", padding: "16px", background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)", borderRadius: "12px" }}>
              <FaCalendarAlt style={{ fontSize: "24px", color: "#6366f1" }} />
              <div style={{ flex: 1 }}>
                <h3 className="plan-title" style={{ margin: "0 0 4px 0", fontSize: "1.4rem" }}>{selectedPlan.title}</h3>
                {selectedPlan.description && (
                  <span style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    fontStyle: "italic"
                  }}>
                    {selectedPlan.description}
                  </span>
                )}
              </div>
              {selectedPlan.todos && selectedPlan.todos.length > 0 && (
                <span style={{
                  background: calculatePlanProgress(selectedPlan) === 100 ? "#10b981" : "#6366f1",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                }}>
                  <FaCheckCircle />
                  {selectedPlan.todos.filter(t => t.completed).length}/{selectedPlan.todos.length} Complete
                </span>
              )}
            </div>

            <div className="add-task-board">
              <input
                type="text"
                placeholder="Add new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button onClick={handleAddTask}>
                <FaPlus style={{ marginRight: '6px' }} />
                Add Task
              </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="board-columns">
                {[
                  { id: "todo", label: "To Do", icon: <FaClock />, color: "#6366f1" },
                  { id: "inprogress", label: "In Progress", icon: <FaFire />, color: "#f59e0b" },
                  { id: "done", label: "Done", icon: <FaCheckCircle />, color: "#10b981" }
                ].map((column) => {
                  const list = todosByStatus[column.id] || [];

                  return (
                    <Droppable key={column.id} droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          className="board-column"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            background: snapshot.isDraggingOver 
                              ? "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)" 
                              : "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                            borderColor: snapshot.isDraggingOver ? "#c7d2fe" : "transparent"
                          }}
                        >
                          <h4 style={{ color: column.color }}>
                            {column.icon}
                            <span style={{ marginLeft: '8px' }}>{column.label}</span>
                            <span style={{ 
                              marginLeft: '8px',
                              background: column.color,
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}>
                              {list.length}
                            </span>
                          </h4>

                          {list.length === 0 && (
                            <div className="empty-column">
                              <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.3 }}>
                                {column.icon}
                              </div>
                              <p>Drop tasks here</p>
                            </div>
                          )}

                          {list.map((todo, index) => (
                            <Draggable
                              key={String(todo.id)}
                              draggableId={String(todo.id)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className={`task-card ${column.id === "done" ? "completed" : ""}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                    transform: snapshot.isDragging 
                                      ? `${provided.draggableProps.style?.transform} rotate(3deg)` 
                                      : provided.draggableProps.style?.transform,
                                    boxShadow: snapshot.isDragging 
                                      ? "0 12px 24px rgba(0,0,0,0.15)" 
                                      : "0 2px 8px rgba(0,0,0,0.08)"
                                  }}
                                  data-is-dragging={snapshot.isDragging}
                                >
                                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <MdDragIndicator style={{ 
                                      color: "#d1d5db", 
                                      fontSize: "20px",
                                      marginTop: "2px",
                                      cursor: "grab"
                                    }} />
                                    <div style={{ flex: 1 }}>
                                      {column.id === "done" && (
                                        <FaCheckCircle style={{ 
                                          marginRight: "8px", 
                                          fontSize: "14px",
                                          color: "#10b981"
                                        }} />
                                      )}
                                      <span style={{ 
                                        textDecoration: column.id === "done" ? "line-through" : "none",
                                        color: column.id === "done" ? "#6b7280" : "#1f2937",
                                        fontWeight: column.id === "done" ? "400" : "500"
                                      }}>
                                        {todo.text}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </DragDropContext>
          </>
        ) : (
          <div style={{
            padding: "80px 40px",
            textAlign: "center",
            color: "#9ca3af",
            background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
            borderRadius: "20px",
            margin: "40px 0",
            border: "2px dashed #e5e7eb"
          }}>
            <p style={{ fontSize: "64px", margin: "0 0 16px 0", opacity: 0.4 }}>
              <FaCalendarAlt />
            </p>
            <p style={{ fontWeight: "700", fontSize: "24px", margin: "0 0 8px 0", color: "#1f2937" }}>No plan selected</p>
            <p style={{ fontSize: "15px", color: "#6b7280" }}>
              Create a plan from Overview or List View to get started!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BoardView;