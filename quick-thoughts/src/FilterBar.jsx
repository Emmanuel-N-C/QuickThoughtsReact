// src/FilterBar.jsx
import React from 'react';

const FilterBar = ({ activeFilter, setActiveFilter, sortOrder, setSortOrder }) => {
  const filters = ['All', 'Random', 'Idea', 'To-Do', 'Plan'];

  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? 'active' : ''}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="sort-control">
        <label>Sort:</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
