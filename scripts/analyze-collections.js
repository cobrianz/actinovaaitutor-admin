const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'test';

async function analyzeCollections() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(MONGODB_DB);

        // Get all collections
        const collections = await db.listCollections().toArray();

        console.log('\n=== DATABASE COLLECTIONS ANALYSIS ===\n');

        for (const collInfo of collections) {
            const collName = collInfo.name;
            const coll = db.collection(collName);

            // Get count
            const count = await coll.countDocuments();

            // Get sample document
            const sample = await coll.findOne();

            console.log(`\n📊 Collection: ${collName}`);
            console.log(`   Documents: ${count}`);

            if (sample) {
                console.log(`   Sample Fields:`, Object.keys(sample).join(', '));
                console.log(`   Sample Doc:`, JSON.stringify(sample, null, 2).substring(0, 500));
            }

            console.log('   ---');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

analyzeCollections();
