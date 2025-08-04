const Game = require('../models/Game');

// Get all games with search and filter functionality
const getAllGames = async (req, res) => {
  try {
    const {
      search,
      category,
      minPlayers,
      maxPlayers,
      minPlayTime,
      maxPlayTime,
      difficulty,
      page = 1,
      limit = 12,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Player count filter
    if (minPlayers || maxPlayers) {
      filter.$and = [];
      if (minPlayers) {
        filter.$and.push({ maxPlayers: { $gte: parseInt(minPlayers) } });
      }
      if (maxPlayers) {
        filter.$and.push({ minPlayers: { $lte: parseInt(maxPlayers) } });
      }
    }

    // Play time filter
    if (minPlayTime || maxPlayTime) {
      if (!filter.averagePlayTime) filter.averagePlayTime = {};
      if (minPlayTime) filter.averagePlayTime.$gte = parseInt(minPlayTime);
      if (maxPlayTime) filter.averagePlayTime.$lte = parseInt(maxPlayTime);
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const games = await Game.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Game.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: games,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalGames: total,
        gamesPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching games',
      error: error.message
    });
  }
};

// Get single game by ID
const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const game = await Game.findById(id).select('-__v');
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game',
      error: error.message
    });
  }
};

// Create new game (admin only)
const createGame = async (req, res) => {
  try {
    const gameData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'minPlayers', 'maxPlayers', 'averagePlayTime'];
    for (const field of requiredFields) {
      if (!gameData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    const game = new Game(gameData);
    await game.save();

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating game',
      error: error.message
    });
  }
};

// Update game (admin only)
const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const game = await Game.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      data: game
    });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating game',
      error: error.message
    });
  }
};

// Delete game (admin only)
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting game',
      error: error.message
    });
  }
};

// Get game categories for filter options
const getGameCategories = async (req, res) => {
  try {
    const categories = await Game.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get filter options
const getFilterOptions = async (req, res) => {
  try {
    const [categories, difficulties] = await Promise.all([
      Game.distinct('category'),
      Game.distinct('difficulty')
    ]);

    // Get min/max values for numeric filters
    const stats = await Game.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPlayers: { $min: '$minPlayers' },
          maxPlayers: { $max: '$maxPlayers' },
          minPlayTime: { $min: '$averagePlayTime' },
          maxPlayTime: { $max: '$averagePlayTime' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        categories,
        difficulties,
        playerRange: stats[0] ? {
          min: stats[0].minPlayers,
          max: stats[0].maxPlayers
        } : { min: 1, max: 10 },
        playTimeRange: stats[0] ? {
          min: stats[0].minPlayTime,
          max: stats[0].maxPlayTime
        } : { min: 15, max: 180 }
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getGameCategories,
  getFilterOptions
};