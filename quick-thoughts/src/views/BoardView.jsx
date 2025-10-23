import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { addTodoToPlan, updateTodoStatus } from "../redux/plansSlice";
import "./BoardView.css";

const BoardView = () => {
  const dispatch = useDispatch();
  const plans = useSelector((state) => state.plans);

  const [selectedPlanId, setSelectedPlanId] = useState(
    plans.length > 0 ? plans[0].id : null
  );
  const [newTask, setNewTask] = useState("");

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId),
    [plans, selectedPlanId]
  );

  // ✅ Group todos safely by status
  const todosByStatus = useMemo(() => {
    if (!selectedPlan) return { todo: [], inprogress: [], done: [] };

    const withStatus = selectedPlan.todos.map((t) => ({
      ...t,
      status: t.status || "todo", // fallback for old todos
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
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    dispatch(
      updateTodoStatus({
        planId: selectedPlanId,
        todoId: draggableId,
        status: newStatus,
      })
    );
  };

  return (
    <div className="board-container">
      {/* Sidebar */}
      <aside className="board-sidebar">
        <h3>📅 My Plans</h3>
        {plans.length === 0 && <p className="empty-plan">No plans yet</p>}
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-item ${
              selectedPlanId === plan.id ? "active" : ""
            }`}
            onClick={() => setSelectedPlanId(plan.id)}
          >
            {plan.title}
          </div>
        ))}
      </aside>

      {/* Main Board */}
      <main className="board-main">
        <h2>📋 Board View</h2>
        <p>Drag and drop your tasks between stages.</p>

        {selectedPlan ? (
          <>
            <h3 className="plan-title">{selectedPlan.title}</h3>

            <div className="add-task-board">
              <input
                type="text"
                placeholder="Add new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button onClick={handleAddTask}>Add</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="board-columns">
                {["todo", "inprogress", "done"].map((status) => {
                  const list = todosByStatus[status] || [];

                  return (
                    <Droppable key={status} droppableId={status}>
                      {(provided) => (
                        <div
                          className="board-column"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <h4>
                            {status === "todo"
                              ? `📝 To Do (${list.length})`
                              : status === "inprogress"
                              ? `🚧 In Progress (${list.length})`
                              : `✅ Done (${list.length})`}
                          </h4>

                          {list.map((todo, index) => (
                            <Draggable
                              key={String(todo.id)} // ✅ Always string
                              draggableId={String(todo.id)} // ✅ Always string
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="task-card"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
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
          <p className="empty-plan">Select a plan to get started!</p>
        )}
      </main>
    </div>
  );
};

export default BoardView;
