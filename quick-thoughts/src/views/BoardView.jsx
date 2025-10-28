import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { addTodoToPlan, updateTodoStatus } from "../redux/plansSlice";
import toast from 'react-hot-toast';
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

  // Group todos safely by status
  const todosByStatus = useMemo(() => {
    if (!selectedPlan) return { todo: [], inprogress: [], done: [] };

    const withStatus = selectedPlan.todos.map((t) => ({
      ...t,
      status: t.status || "todo",
    }));

    return {
      todo: withStatus.filter((t) => t.status === "todo"),
      inprogress: withStatus.filter((t) => t.status === "inprogress"),
      done: withStatus.filter((t) => t.status === "done"),
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
    const newStatus = destination.droppableId;

    // Only show toast if status actually changed
    if (source.droppableId !== newStatus) {
      dispatch(
        updateTodoStatus({
          planId: selectedPlanId,
          todoId: draggableId,
          status: newStatus,
        })
      );

      if (newStatus === "done") {
        toast.success("✅ Task completed!");
      } else if (newStatus === "inprogress") {
        toast("🚧 Task moved to In Progress");
      }
    }
  };

  return (
    <div className="board-container">
      {/* Sidebar */}
      <aside className="board-sidebar">
        <h3>📅 My Plans</h3>
        {plans.length === 0 ? (
          <div style={{
            padding: "20px",
            textAlign: "center",
            color: "#888",
            background: "#f8f9fa",
            borderRadius: "8px",
            margin: "10px 0"
          }}>
            <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>📋</p>
            <p style={{ margin: 0, fontSize: "14px" }}>No plans yet</p>
          </div>
        ) : (
          plans.map((plan) => (
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
              {plan.title}
              
              {/* Tooltip for plan description */}
              {hoveredPlanId === plan.id && plan.description && (
                <div
                  style={{
                    position: "absolute",
                    left: "110%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#333",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    maxWidth: "200px",
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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
                      borderRight: "6px solid #333"
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </aside>

      {/* Main Board */}
      <main className="board-main">
        <h2>📋 Board View</h2>
        <p>Drag and drop your tasks between stages.</p>

        {selectedPlan ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <h3 className="plan-title" style={{ margin: 0 }}>{selectedPlan.title}</h3>
              {selectedPlan.description && (
                <span style={{
                  fontSize: "12px",
                  color: "#666",
                  fontStyle: "italic"
                }}>
                  — {selectedPlan.description}
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
              <button onClick={handleAddTask}>Add</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="board-columns">
                {["todo", "inprogress", "done"].map((status) => {
                  const list = todosByStatus[status] || [];

                  return (
                    <Droppable key={status} droppableId={status}>
                      {(provided, snapshot) => (
                        <div
                          className="board-column"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            background: snapshot.isDraggingOver ? "#f0f8ff" : "#f8f9fa"
                          }}
                        >
                          <h4>
                            {status === "todo"
                              ? `📝 To Do (${list.length})`
                              : status === "inprogress"
                              ? `🚧 In Progress (${list.length})`
                              : `✅ Done (${list.length})`}
                          </h4>

                          {list.length === 0 && (
                            <div style={{
                              padding: "20px",
                              textAlign: "center",
                              color: "#ccc",
                              fontSize: "14px",
                              border: "2px dashed #ddd",
                              borderRadius: "8px",
                              margin: "10px 0"
                            }}>
                              Drop tasks here
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
                                  className="task-card"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                    ...(status === "done" && {
                                      textDecoration: "line-through",
                                      opacity: 0.7,
                                      background: "#d4edda",
                                      color: "#155724",
                                      border: "2px solid #28a745"
                                    })
                                  }}
                                >
                                  {status === "done" && (
                                    <span style={{ marginRight: "8px", fontSize: "16px" }}>
                                      ✓
                                    </span>
                                  )}
                                  {todo.text}
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
            padding: "60px 40px",
            textAlign: "center",
            color: "#888",
            background: "#f8f9fa",
            borderRadius: "12px",
            margin: "20px 0"
          }}>
            <p style={{ fontSize: "48px", margin: "0 0 16px 0" }}>📋</p>
            <p style={{ fontWeight: "bold", fontSize: "20px", margin: "0 0 8px 0" }}>No plan selected</p>
            <p style={{ fontSize: "14px", color: "#666" }}>Create a plan from Overview or List View to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BoardView;