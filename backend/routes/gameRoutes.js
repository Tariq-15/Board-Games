const express = require('express');
const router = express.Router();
const {
  getAllGames,
  getGameById,
  getFilterOptions
} = require('../controllers/gameController');

// GET /api/games - Get all games with search and filters
router.get('/', getAllGames);

// GET /api/games/filters - Get filter options
router.get('/filters', getFilterOptions);

// GET /api/games/:id - Get specific game details
router.get('/:id', getGameById);

module.exports = router; 