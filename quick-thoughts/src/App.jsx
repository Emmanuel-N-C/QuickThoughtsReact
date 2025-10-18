// src/App.jsx
import React from 'react';
import AddThoughtForm from './AddThoughtForm';
import ThoughtList from './Thought';
import TodoList from './TodoList';
import PlanList from './PlanList';

const App = () => {
  return (
    <div className="app">
      <h1>💭 Quick Thoughts</h1>
      <AddThoughtForm />
      <ThoughtList />
      <TodoList />
      <PlanList />
    </div>
  );
};

export default App;
