const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Game name is required'],
    trim: true,
    maxlength: [100, 'Game name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Game category is required'],
    enum: ['Strategy', 'Family', 'Party', 'Adventure', 'Puzzle', 'Educational', 'Other'],
    default: 'Other'
  },
  minPlayers: {
    type: Number,
    required: [true, 'Minimum players is required'],
    min: [1, 'Minimum players must be at least 1'],
    max: [20, 'Maximum players cannot exceed 20']
  },
  maxPlayers: {
    type: Number,
    required: [true, 'Maximum players is required'],
    min: [1, 'Maximum players must be at least 1'],
    max: [20, 'Maximum players cannot exceed 20']
  },
  averagePlayTime: {
    type: Number,
    required: [true, 'Average play time is required'],
    min: [5, 'Play time must be at least 5 minutes'],
    max: [480, 'Play time cannot exceed 8 hours']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    default: 'Medium'
  },
  ageRange: {
    min: {
      type: Number,
      required: [true, 'Minimum age is required'],
      min: [0, 'Minimum age must be at least 0'],
      max: [18, 'Minimum age cannot exceed 18']
    },
    max: {
      type: Number,
      required: [true, 'Maximum age is required'],
      min: [0, 'Maximum age must be at least 0'],
      max: [99, 'Maximum age cannot exceed 99']
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v) || /^\/uploads\/.+/.test(v);
      },
      message: 'Image must be a valid URL or file path'
    }
  }],
  videoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
      },
      message: 'Video URL must be a valid YouTube URL'
    }
  },
  tutorialUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^https?:\/.+/.test(v);
      },
      message: 'Tutorial URL must be a valid URL'
    }
  },
  components: [{
    name: {
      type: String,
      required: [true, 'Component name is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Component quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    description: {
      type: String,
      maxlength: [200, 'Component description cannot exceed 200 characters']
    }
  }],
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    max: [1000, 'Price cannot exceed $1000']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  releaseYear: {
    type: Number,
    min: [1900, 'Release year must be at least 1900'],
    max: [new Date().getFullYear() + 1, 'Release year cannot be in the future']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: [0, 'Total ratings cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for player range
gameSchema.virtual('playerRange').get(function() {
  if (this.minPlayers === this.maxPlayers) {
    return `${this.minPlayers} player`;
  }
  return `${this.minPlayers}-${this.maxPlayers} players`;
});

// Virtual for age range
gameSchema.virtual('ageRangeText').get(function() {
  if (this.ageRange.min === this.ageRange.max) {
    return `${this.ageRange.min}+`;
  }
  return `${this.ageRange.min}-${this.ageRange.max}`;
});

// Index for search functionality
gameSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  publisher: 'text'
});

// Pre-save middleware to validate player counts
gameSchema.pre('save', function(next) {
  if (this.minPlayers > this.maxPlayers) {
    next(new Error('Minimum players cannot be greater than maximum players'));
  }
  if (this.ageRange.min > this.ageRange.max) {
    next(new Error('Minimum age cannot be greater than maximum age'));
  }
  next();
});

module.exports = mongoose.model('Game', gameSchema);