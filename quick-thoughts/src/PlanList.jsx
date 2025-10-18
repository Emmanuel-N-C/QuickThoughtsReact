// src/PlanList.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addPlan,
  removePlan,
  addTodoToPlan,
  togglePlanTodo,
  removePlanTodo,
} from './redux/plansSlice';
import { assignTodoToPlan } from './redux/todosSlice';

const PlanList = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todoText, setTodoText] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = useSelector((state) => state.plans);
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addPlan({ id: Date.now(), title, description }));
    setTitle('');
    setDescription('');
  };

  const handleAddTodoToPlan = (e) => {
    e.preventDefault();
    if (!todoText.trim() || !selectedPlan) return;
    dispatch(
      addTodoToPlan({
        planId: selectedPlan,
        todo: { id: Date.now(), text: todoText, done: false },
      })
    );
    setTodoText('');
  };

  const handleAttachExistingTodo = (planId, todoId) => {
    const todo = todos.find((t) => t.id === Number(todoId));
    if (!todo) return;
    dispatch(assignTodoToPlan({ todoId: todo.id, planId }));
    dispatch(addTodoToPlan({ planId, todo }));
  };

  return (
    <div className="plan-section">
      <h2>📅 Plans</h2>

      {/* Add a new plan */}
      <form onSubmit={handleAddPlan} className="add-plan-form">
        <input
          type="text"
          value={title}
          placeholder="Plan title..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={description}
          placeholder="Short description (optional)"
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Plan</button>
      </form>

      {/* List plans */}
      {plans.length === 0 ? (
        <p>No plans yet!</p>
      ) : (
        plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>
              {plan.title}{' '}
              <button onClick={() => dispatch(removePlan(plan.id))}>×</button>
            </h3>
            <p>{plan.description}</p>

            {/* Attach existing To-Dos */}
            {(() => {
              const availableTodos = todos.filter((t) => !t.planId);
              return availableTodos.length > 0 ? (
                <div>
                  <label>Add existing To-Do:</label>
                  <select
                    onChange={(e) =>
                      handleAttachExistingTodo(plan.id, e.target.value)
                    }
                    defaultValue=""
                  >
                    <option value="">Select task...</option>
                    {availableTodos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.text}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null;
            })()}

            {/* To-Dos within the plan */}
            <ul>
              {plan.todos.map((t) => (
                <li key={t.id}>
                  <span
                    style={{
                      textDecoration: t.done ? 'line-through' : 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      dispatch(togglePlanTodo({ planId: plan.id, todoId: t.id }))
                    }
                  >
                    {t.text}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(removePlanTodo({ planId: plan.id, todoId: t.id }))
                    }
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            {/* Add new To-Do */}
            {selectedPlan === plan.id ? (
              <form onSubmit={handleAddTodoToPlan}>
                <input
                  type="text"
                  value={todoText}
                  placeholder="Add new task..."
                  onChange={(e) => setTodoText(e.target.value)}
                />
                <button type="submit">Add</button>
              </form>
            ) : (
              <button onClick={() => setSelectedPlan(plan.id)}>
                ➕ Add To-Do
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PlanList;
