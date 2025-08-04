const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://mdtariquzzaman:M5yilzq1xv9BYZGx@board-games.cz6mu8j.mongodb.net/?retryWrites=true&w=majority&appName=board-games";

async function simpleTest() {
  console.log('Attempting to connect to MongoDB...');
  
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000
  });

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db("board-games");
    console.log('✅ Database accessed successfully!');
    
    // Test basic operations
    const collection = db.collection("test");
    const testDoc = { message: "Hello MongoDB!", timestamp: new Date() };
    
    const insertResult = await collection.insertOne(testDoc);
    console.log('✅ Insert successful:', insertResult.insertedId);
    
    const findResult = await collection.findOne({ message: "Hello MongoDB!" });
    console.log('✅ Find successful:', findResult);
    
    await collection.deleteOne({ message: "Hello MongoDB!" });
    console.log('✅ Delete successful!');
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

simpleTest(); 