const { getDatabase } = require('../config/database');

class Game {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.minPlayers = data.minPlayers;
    this.maxPlayers = data.maxPlayers;
    this.averagePlayTime = data.averagePlayTime;
    this.difficulty = data.difficulty || 'Medium';
    this.ageRange = data.ageRange;
    this.images = data.images || [];
    this.videoUrl = data.videoUrl;
    this.tutorialUrl = data.tutorialUrl;
    this.components = data.components || [];
    this.price = data.price;
    this.publisher = data.publisher;
    this.releaseYear = data.releaseYear;
    this.averageRating = data.averageRating || 0;
    this.totalRatings = data.totalRatings || 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation methods
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Game name is required');
    } else if (this.name.length > 100) {
      errors.push('Game name cannot exceed 100 characters');
    }

    if (!this.description || this.description.trim().length === 0) {
      errors.push('Game description is required');
    } else if (this.description.length > 2000) {
      errors.push('Description cannot exceed 2000 characters');
    }

    const validCategories = ['Strategy', 'Family', 'Party', 'Adventure', 'Puzzle', 'Educational', 'Other'];
    if (!this.category || !validCategories.includes(this.category)) {
      errors.push('Game category is required and must be valid');
    }

    if (!this.minPlayers || this.minPlayers < 1 || this.minPlayers > 20) {
      errors.push('Minimum players must be between 1 and 20');
    }

    if (!this.maxPlayers || this.maxPlayers < 1 || this.maxPlayers > 20) {
      errors.push('Maximum players must be between 1 and 20');
    }

    if (this.minPlayers > this.maxPlayers) {
      errors.push('Minimum players cannot be greater than maximum players');
    }

    if (!this.averagePlayTime || this.averagePlayTime < 5 || this.averagePlayTime > 480) {
      errors.push('Average play time must be between 5 and 480 minutes');
    }

    const validDifficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
    if (this.difficulty && !validDifficulties.includes(this.difficulty)) {
      errors.push('Difficulty must be valid');
    }

    if (!this.ageRange || !this.ageRange.min || !this.ageRange.max) {
      errors.push('Age range is required');
    } else {
      if (this.ageRange.min < 0 || this.ageRange.min > 18) {
        errors.push('Minimum age must be between 0 and 18');
      }
      if (this.ageRange.max < 0 || this.ageRange.max > 99) {
        errors.push('Maximum age must be between 0 and 99');
      }
      if (this.ageRange.min > this.ageRange.max) {
        errors.push('Minimum age cannot be greater than maximum age');
      }
    }

    if (this.price !== undefined && (this.price < 0 || this.price > 1000)) {
      errors.push('Price must be between 0 and 1000');
    }

    if (this.releaseYear && (this.releaseYear < 1900 || this.releaseYear > new Date().getFullYear() + 1)) {
      errors.push('Release year must be valid');
    }

    if (this.averageRating < 0 || this.averageRating > 5) {
      errors.push('Average rating must be between 0 and 5');
    }

    if (this.totalRatings < 0) {
      errors.push('Total ratings cannot be negative');
    }

    return errors;
  }

  // Static methods for database operations
  static async create(gameData) {
    const game = new Game(gameData);
    const errors = game.validate();
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const db = getDatabase();
    const result = await db.collection('games').insertOne(game);
    return { ...game, _id: result.insertedId };
  }

  static async findById(id) {
    const db = getDatabase();
    const game = await db.collection('games').findOne({ _id: id });
    return game ? new Game(game) : null;
  }

  static async findByIdString(id) {
    const db = getDatabase();
    const { ObjectId } = require('mongodb');
    
    try {
      const objectId = new ObjectId(id);
      const game = await db.collection('games').findOne({ _id: objectId });
      return game ? new Game(game) : null;
    } catch (error) {
      return null;
    }
  }

  static async findAll(query = {}, sort = {}) {
    const db = getDatabase();
    const games = await db.collection('games').find(query).sort(sort).toArray();
    return games.map(game => new Game(game));
  }

  static async findActive(query = {}) {
    const db = getDatabase();
    const games = await db.collection('games').find({ ...query, isActive: true }).toArray();
    return games.map(game => new Game(game));
  }

  static async search(text) {
    const db = getDatabase();
    const games = await db.collection('games').find({
      $text: { $search: text },
      isActive: true
    }).toArray();
    return games.map(game => new Game(game));
  }

  static async updateById(id, updateData) {
    const db = getDatabase();
    const { ObjectId } = require('mongodb');
    
    try {
      const objectId = new ObjectId(id);
      const game = new Game({ ...updateData, updatedAt: new Date() });
      const errors = game.validate();
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const result = await db.collection('games').updateOne(
        { _id: objectId },
        { $set: updateData }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteById(id) {
    const db = getDatabase();
    const { ObjectId } = require('mongodb');
    
    try {
      const objectId = new ObjectId(id);
      const result = await db.collection('games').deleteOne({ _id: objectId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  static async softDeleteById(id) {
    return await this.updateById(id, { isActive: false });
  }

  // Instance methods
  async save() {
    if (this._id) {
      // Update existing game
      const result = await Game.updateById(this._id, this);
      return result;
    } else {
      // Create new game
      const newGame = await Game.create(this);
      this._id = newGame._id;
      return newGame;
    }
  }

  // Virtual properties (computed)
  get playerRange() {
    if (this.minPlayers === this.maxPlayers) {
      return `${this.minPlayers} player`;
    }
    return `${this.minPlayers}-${this.maxPlayers} players`;
  }

  get ageRangeText() {
    if (this.ageRange.min === this.ageRange.max) {
      return `${this.ageRange.min}+`;
    }
    return `${this.ageRange.min}-${this.ageRange.max}`;
  }
}

module.exports = Game; 