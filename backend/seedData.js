const mongoose = require('mongoose');
const Game = require('./models/Game');
require('dotenv').config();

const sampleGames = [
  {
    name: "Catan",
    description: "A strategy board game where players collect resources and build settlements, cities, and roads to become the dominant force on Catan.",
    category: "Strategy",
    minPlayers: 3,
    maxPlayers: 4,
    averagePlayTime: 90,
    difficulty: "Medium",
    ageRange: { min: 10, max: 99 },
    images: ["https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tutorialUrl: "https://www.catan.com/game-rules",
    components: [
      { name: "Game Board", quantity: 1 },
      { name: "Resource Cards", quantity: 95 },
      { name: "Development Cards", quantity: 25 },
      { name: "Settlement Pieces", quantity: 20 },
      { name: "City Pieces", quantity: 16 },
      { name: "Road Pieces", quantity: 60 },
      { name: "Robber", quantity: 1 },
      { name: "Dice", quantity: 2 }
    ],
    price: 49.99,
    publisher: "Catan Studio",
    releaseYear: 1995,
    averageRating: 4.5,
    totalRatings: 1250
  },
  {
    name: "Ticket to Ride",
    description: "A railway-themed board game where players collect train cards to claim railway routes on a map.",
    category: "Strategy",
    minPlayers: 2,
    maxPlayers: 5,
    averagePlayTime: 60,
    difficulty: "Easy",
    ageRange: { min: 8, max: 99 },
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tutorialUrl: "https://www.daysofwonder.com/tickettoride/en/",
    components: [
      { name: "Game Board", quantity: 1 },
      { name: "Train Cards", quantity: 110 },
      { name: "Destination Tickets", quantity: 30 },
      { name: "Train Pieces", quantity: 225 },
      { name: "Score Markers", quantity: 5 }
    ],
    price: 39.99,
    publisher: "Days of Wonder",
    releaseYear: 2004,
    averageRating: 4.3,
    totalRatings: 890
  },
  {
    name: "Pandemic",
    description: "A cooperative board game where players work together to stop the spread of diseases and find cures.",
    category: "Strategy",
    minPlayers: 2,
    maxPlayers: 4,
    averagePlayTime: 45,
    difficulty: "Medium",
    ageRange: { min: 13, max: 99 },
    images: ["https://images.unsplash.com/photo-1584556819299-4b0b2b0b0b0b?w=400"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tutorialUrl: "https://www.zmangames.com/pandemic/",
    components: [
      { name: "Game Board", quantity: 1 },
      { name: "Player Cards", quantity: 48 },
      { name: "Infection Cards", quantity: 48 },
      { name: "Player Pawns", quantity: 4 },
      { name: "Disease Cubes", quantity: 96 },
      { name: "Research Stations", quantity: 6 }
    ],
    price: 44.99,
    publisher: "Z-Man Games",
    releaseYear: 2008,
    averageRating: 4.7,
    totalRatings: 1560
  },
  {
    name: "Codenames",
    description: "A social word game where players give one-word clues to help their teammates identify secret agents.",
    category: "Party",
    minPlayers: 4,
    maxPlayers: 8,
    averagePlayTime: 15,
    difficulty: "Easy",
    ageRange: { min: 14, max: 99 },
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tutorialUrl: "https://czechgames.com/en/codenames/",
    components: [
      { name: "Word Cards", quantity: 200 },
      { name: "Key Card", quantity: 1 },
      { name: "Timer", quantity: 1 },
      { name: "Score Cards", quantity: 8 }
    ],
    price: 19.99,
    publisher: "Czech Games",
    releaseYear: 2015,
    averageRating: 4.2,
    totalRatings: 720
  },
  {
    name: "Settlers of Catan",
    description: "A classic strategy game where players build settlements, trade resources, and compete for victory points.",
    category: "Strategy",
    minPlayers: 3,
    maxPlayers: 4,
    averagePlayTime: 120,
    difficulty: "Medium",
    ageRange: { min: 10, max: 99 },
    images: ["https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tutorialUrl: "https://www.catan.com/game-rules",
    components: [
      { name: "Game Board", quantity: 1 },
      { name: "Resource Cards", quantity: 95 },
      { name: "Development Cards", quantity: 25 },
      { name: "Settlement Pieces", quantity: 20 },
      { name: "City Pieces", quantity: 16 },
      { name: "Road Pieces", quantity: 60 }
    ],
    price: 54.99,
    publisher: "Catan Studio",
    releaseYear: 1995,
    averageRating: 4.6,
    totalRatings: 2100
  },
  {
    name: "Monopoly",
    description: "The classic real estate trading game where players buy, sell, and trade properties to become the wealthiest player.",
    category: "Family",
    minPlayers: 2,
    maxPlayers: 8,
    averagePlayTime: 180,
    difficulty: "Easy",
    ageRange: { min: 8, max: 99 },
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tutorialUrl: "https://www.hasbro.com/monopoly/",
    components: [
      { name: "Game Board", quantity: 1 },
      { name: "Property Cards", quantity: 28 },
      { name: "Money", quantity: 1 },
      { name: "Player Tokens", quantity: 8 },
      { name: "Dice", quantity: 2 },
      { name: "Houses", quantity: 32 },
      { name: "Hotels", quantity: 12 }
    ],
    price: 29.99,
    publisher: "Hasbro",
    releaseYear: 1935,
    averageRating: 3.8,
    totalRatings: 3400
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/board-game-marketplace', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Game.deleteMany({});
    console.log('Cleared existing games');

    // Insert sample games
    const insertedGames = await Game.insertMany(sampleGames);
    console.log(`Inserted ${insertedGames.length} games`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 