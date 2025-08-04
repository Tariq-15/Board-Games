const { connectToDatabase, getDatabase } = require('./config/database');

async function setupDatabase() {
  try {
    // Connect to database
    await connectToDatabase();
    const db = getDatabase();
    
    console.log('Setting up database indexes...');
    
    // Create text index for search functionality
    await db.collection('games').createIndex({
      name: 'text',
      description: 'text',
      category: 'text',
      publisher: 'text'
    });
    
    console.log('Text index created successfully');
    
    // Create other useful indexes
    await db.collection('games').createIndex({ category: 1 });
    await db.collection('games').createIndex({ isActive: 1 });
    await db.collection('games').createIndex({ averageRating: -1 });
    await db.collection('games').createIndex({ createdAt: -1 });
    
    console.log('All indexes created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 