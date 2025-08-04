import React from 'react';
import './Filter.css';

const Filter = ({ filters, onFilterChange, filterOptions }) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const handleClearFilters = () => {
    onFilterChange('clear', null);
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3>Filters</h3>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={handleClearFilters}
        >
          Clear All
        </button>
      </div>

      <div className="filter-section">
        <label>Category</label>
        <select 
          className="form-control"
          value={filters.category || 'all'}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          {filterOptions?.categories?.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Difficulty</label>
        <select 
          className="form-control"
          value={filters.difficulty || 'all'}
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
        >
          <option value="all">All Difficulties</option>
          {filterOptions?.difficulties?.map(difficulty => (
            <option key={difficulty} value={difficulty}>{difficulty}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Players</label>
        <div className="range-inputs">
          <input
            type="number"
            className="form-control"
            placeholder="Min"
            min={filterOptions?.playerRange?.min || 1}
            max={filterOptions?.playerRange?.max || 10}
            value={filters.minPlayers || ''}
            onChange={(e) => handleFilterChange('minPlayers', e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            className="form-control"
            placeholder="Max"
            min={filterOptions?.playerRange?.min || 1}
            max={filterOptions?.playerRange?.max || 10}
            value={filters.maxPlayers || ''}
            onChange={(e) => handleFilterChange('maxPlayers', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-section">
        <label>Play Time (minutes)</label>
        <div className="range-inputs">
          <input
            type="number"
            className="form-control"
            placeholder="Min"
            min={filterOptions?.playTimeRange?.min || 15}
            max={filterOptions?.playTimeRange?.max || 180}
            value={filters.minPlayTime || ''}
            onChange={(e) => handleFilterChange('minPlayTime', e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            className="form-control"
            placeholder="Max"
            min={filterOptions?.playTimeRange?.min || 15}
            max={filterOptions?.playTimeRange?.max || 180}
            value={filters.maxPlayTime || ''}
            onChange={(e) => handleFilterChange('maxPlayTime', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter; 