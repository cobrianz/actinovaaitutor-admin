require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');

async function fetchSamples() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        const collections = ['cardSets', 'tests', 'posts', 'contacts'];
        const samples = {};

        for (const collName of collections) {
            console.log(`Fetching sample from ${collName}...`);
            const docs = await db.collection(collName).find({}).limit(2).toArray();
            samples[collName] = docs;
        }

        fs.writeFileSync(
            'collection-samples.json',
            JSON.stringify(samples, null, 2)
        );
        console.log('✅ Samples saved to collection-samples.json');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

fetchSamples();
