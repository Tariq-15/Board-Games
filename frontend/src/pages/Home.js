import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import GameCard from '../components/GameCard';
import gameService from '../services/gameService';
import './Home.css';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    difficulty: 'all',
    minPlayers: '',
    maxPlayers: '',
    minPlayTime: '',
    maxPlayTime: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalGames: 0,
    gamesPerPage: 12
  });

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load games when filters change
  useEffect(() => {
    loadGames();
  }, [filters, pagination.currentPage]);

  const loadFilterOptions = async () => {
    try {
      const response = await gameService.getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.gamesPerPage,
        ...filters
      };

      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await gameService.getAllGames(params);
      setGames(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({
        search: '',
        category: 'all',
        difficulty: 'all',
        minPlayers: '',
        maxPlayers: '',
        minPlayTime: '',
        maxPlayTime: ''
      });
    } else {
      setFilters(prev => ({ ...prev, [filterType]: value }));
    }
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading && games.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="home-content">
        <div className="search-section">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="main-content">
          <aside className="sidebar">
            <Filter 
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={filterOptions}
            />
          </aside>

          <main className="games-section">
            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {games.length === 0 && !loading ? (
              <div className="no-games">
                <h3>No games found</h3>
                <p>Try adjusting your search or filters to find more games.</p>
              </div>
            ) : (
              <>
                <div className="games-header">
                  <h2>Board Games ({pagination.totalGames})</h2>
                  {filters.search && (
                    <p>Search results for: "{filters.search}"</p>
                  )}
                </div>

                <div className="games-grid">
                  {games.map(game => (
                    <GameCard key={game._id} game={game} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-secondary"
                      disabled={pagination.currentPage === 1}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                      Previous
                    </button>
                    
                    <span className="page-info">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                      className="btn btn-secondary"
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home; 