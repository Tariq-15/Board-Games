import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const gameService = {
  // Get all games with search and filters
  getAllGames: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/games`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch games');
    }
  },

  // Get specific game by ID
  getGameById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/games/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch game');
    }
  },

  // Get filter options
  getFilterOptions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/games/filters`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch filter options');
    }
  }
};

export default gameService; 