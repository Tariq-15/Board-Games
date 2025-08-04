const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://mdtariquzzaman:M5yilzq1xv9BYZGx@board-games.cz6mu8j.mongodb.net/?retryWrites=true&w=majority&appName=board-games";

async function testConnection() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    const db = client.db("board-games");
    console.log("✅ Database 'board-games' is accessible");
    
    // Test creating a collection
    const collection = db.collection("test");
    await collection.insertOne({ test: "connection", timestamp: new Date() });
    console.log("✅ Can write to database");
    
    const result = await collection.findOne({ test: "connection" });
    console.log("✅ Can read from database:", result);
    
    // Clean up
    await collection.deleteOne({ test: "connection" });
    console.log("✅ Can delete from database");
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    await client.close();
  }
}

testConnection(); 