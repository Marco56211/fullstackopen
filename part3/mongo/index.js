// --- 1. Import the native MongoDB driver ---
const { MongoClient } = require('mongodb');

// --- 2. Argument Check and Password Extraction ---
if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

// --- 3. Construct MongoDB URL ---
// The URL structure remains largely the same for the native driver
const url = `mongodb+srv://fulstack:${password}@cluster0.rl8qyp8.mongodb.net/noteapp?retryWrites=true&w=majority&appName=Cluster0`;

// --- 4. Main asynchronous function to handle connection and operation ---
async function main() {
  // Create a new MongoClient instance
  // The options for timeouts are passed directly to the MongoClient constructor
  const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 30000, // 30 seconds for initial server discovery and connection
    socketTimeoutMS: 45000, // 45 seconds for operations after connection is established
    // No 'strictQuery' option here; it's a Mongoose-specific setting
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`MongoDB URL: ${url.substring(0, 60)}... (truncated for security)`);

    // Connect to the MongoDB cluster
    await client.connect();
    console.log('--- MongoDB Connection SUCCESSFUL! ---');

    // Get a reference to the database
    // 'noteapp' should match the database name in your URL
    const db = client.db('noteapp');

    // Get a reference to the collection
    // 'notes' is the collection name (Mongoose would pluralize 'Note' to 'notes')
    const collection = db.collection('notes');

    console.log('Now attempting to insert the note...');

    // --- 5. Prepare the document (plain JavaScript object) ---
    const noteDocument = {
      content: 'HTML is easy',
      important: true,
      // You might want to add a 'date' field manually if needed, as Mongoose does this sometimes
      // date: new Date(),
    };

    // --- 6. Insert the document ---
    const result = await collection.insertOne(noteDocument);

    console.log('Note saved successfully!');
    // The result from insertOne contains insertedId, acknowledged, etc.
    console.log('Inserted document ID:', result.insertedId);
    console.log('Full insert result:', result);

  } catch (error) {
    console.error('--- ERROR during MongoDB operation! ---');
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    // The native driver's error objects can be more detailed
    if (error.code) {
        console.error(`MongoDB error code: ${error.code}`);
    }
    if (error.reason) {
        console.error(`Error reason: ${JSON.stringify(error.reason)}`);
    }
    console.error('Full error object:', error);

  } finally {
    // --- 7. Close the connection ---
    console.log('Closing MongoDB connection...');
    await client.close(); // Ensure client.close() is awaited
    console.log('MongoDB connection closed.');
  }
}

// --- Run the main function ---
main().catch(console.error); // Catch any unhandled promise rejectionsnpm install mongodb