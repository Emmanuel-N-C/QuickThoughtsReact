// src/App.jsx
import React from 'react';
import AddThoughtForm from './AddThoughtForm';
import ThoughtList from './Thought';
import TodoList from './TodoList';

const App = () => {
  return (
    <div className="app">
      <h1>💭 Quick Thoughts</h1>
      <AddThoughtForm />
      <ThoughtList />
      <TodoList />
    </div>
  );
};

export default App;
