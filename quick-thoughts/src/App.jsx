// src/App.jsx
import React, { useState } from 'react';
import AddThoughtForm from './AddThoughtForm';
import ThoughtList from './Thought';
import TodoList from './TodoList';
import PlanList from './PlanList';
import FilterBar from './FilterBar';
import { clearState } from './redux/localStorage';

const App = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  const handleClearData = () => {
    if (confirm('🧹 Are you sure you want to clear all saved data?')) {
      clearState();
      window.location.reload(); // refresh to reset Redux store
    }
  };

  return (
    <div className="app">
      <h1>💭 Quick Thoughts</h1>

      {/* Input form */}
      <AddThoughtForm />

      {/* Filter / Sort bar */}
      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Conditional rendering based on selected filter */}
      {activeFilter === 'All' && (
        <>
          <ThoughtList sortOrder={sortOrder} />
          <TodoList sortOrder={sortOrder} />
          <PlanList />
        </>
      )}

      {activeFilter === 'Random' && (
        <ThoughtList sortOrder={sortOrder} filterCategory="Random" />
      )}

      {activeFilter === 'Idea' && (
        <ThoughtList sortOrder={sortOrder} filterCategory="Idea" />
      )}

      {activeFilter === 'To-Do' && <TodoList sortOrder={sortOrder} />}

      {activeFilter === 'Plan' && <PlanList />}

      {/* Clear all data button */}
      <div className="clear-data-section">
        <button onClick={handleClearData} className="clear-btn">
          🧹 Clear All Data
        </button>
      </div>
    </div>
  );
};

export default App;
