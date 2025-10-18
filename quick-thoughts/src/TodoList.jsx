// src/TodoList.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTodo, removeTodo } from './redux/todosSlice';

const TodoList = ({ sortOrder = 'newest' }) => {
  const todos = useSelector((state) => state.todos);
  const plans = useSelector((state) => state.plans);
  const dispatch = useDispatch();

  // Filter out To-Dos already assigned to a plan
  const standaloneTodos = todos.filter((t) => !t.planId);

  // Sort by ID (timestamp) — newest first or oldest first
  const sortedTodos = [...standaloneTodos].sort((a, b) =>
    sortOrder === 'newest' ? b.id - a.id : a.id - b.id
  );

  if (todos.length === 0) return <p>No To-Do items yet!</p>;

  return (
    <div className="todo-list">
      <h2>📝 To-Do List</h2>
      {sortedTodos.length === 0 ? (
        <p>All To-Dos are assigned to plans!</p>
      ) : (
        sortedTodos.map((todo) => (
          <div
            key={todo.id}
            className={`todo-item ${todo.done ? 'completed' : ''}`}
          >
            <span
              onClick={() => dispatch(toggleTodo(todo.id))}
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {todo.text}
            </span>
            {todo.planId && (
              <span className="todo-tag">
                (Part of{' '}
                {plans.find((p) => p.id === todo.planId)?.title || 'Unknown Plan'}
                )
              </span>
            )}
            <button onClick={() => dispatch(removeTodo(todo.id))}>×</button>
          </div>
        ))
      )}
    </div>
  );
};

export default TodoList;
