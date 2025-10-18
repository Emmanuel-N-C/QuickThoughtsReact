// src/App.jsx
import React, { useState } from 'react';
import AddThoughtForm from './AddThoughtForm';
import ThoughtList from './Thought';
import TodoList from './TodoList';
import PlanList from './PlanList';
import FilterBar from './FilterBar';

const App = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  return (
    <div className="app">
      <h1>💭 Quick Thoughts</h1>
      <AddThoughtForm />

      {/* Filter + Sort Bar */}
      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Conditional Rendering Based on Filter */}
      {activeFilter === 'All' && (
        <>
          <ThoughtList sortOrder={sortOrder} />
          <TodoList sortOrder={sortOrder} />
          <PlanList />
        </>
      )}

      {activeFilter === 'Random' && <ThoughtList sortOrder={sortOrder} filterCategory="Random" />}
      {activeFilter === 'Idea' && <ThoughtList sortOrder={sortOrder} filterCategory="Idea" />}
      {activeFilter === 'To-Do' && <TodoList sortOrder={sortOrder} />}
      {activeFilter === 'Plan' && <PlanList />}
    </div>
  );
};

export default App;
