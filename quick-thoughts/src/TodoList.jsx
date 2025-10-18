// src/TodoList.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTodo, removeTodo } from './redux/todosSlice';

const TodoList = () => {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  if (todos.length === 0) return <p>No To-Do items yet!</p>;

  return (
    <div className="todo-list">
      <h2>📝 To-Do List</h2>
      {todos.map((todo) => (
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
          <button onClick={() => dispatch(removeTodo(todo.id))}>×</button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
