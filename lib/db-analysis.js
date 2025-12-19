require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'actinova-ai-tutor';

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

async function analyzeDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);

    console.log(`Connected to database: ${MONGODB_DB}\n`);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);

      console.log(`\n=== Collection: ${collectionName} ===`);

      // Count documents
      const count = await collection.countDocuments();
      console.log(`Total documents: ${count}`);

      if (count > 0) {
        // Get one sample document
        const sample = await collection.findOne({});
        console.log('Sample document:');
        console.log(JSON.stringify(sample, null, 2));

        // Analyze structure
        console.log('Field analysis:');
        analyzeObject(sample, '');
      } else {
        console.log('No documents in collection');
      }
    }

  } catch (error) {
    console.error('Error analyzing database:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

function analyzeObject(obj, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const type = Array.isArray(value) ? 'Array' : typeof value;

    if (type === 'object' && value !== null && !Array.isArray(value)) {
      console.log(`${fullKey}: Object`);
      analyzeObject(value, fullKey);
    } else {
      console.log(`${fullKey}: ${type}`);
      if (Array.isArray(value) && value.length > 0) {
        console.log(`  ${fullKey}[0]: ${typeof value[0]}`);
      }
    }
  }
}

// Run the analysis
analyzeDatabase().catch(console.error);