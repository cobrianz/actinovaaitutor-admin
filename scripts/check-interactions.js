
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkInteractions() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/actinovaaitutor";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        console.log("Checking interactions collection...");
        const doc = await db.collection("interactions").findOne({});
        console.log("Sample interaction:", doc);

        const count = await db.collection("interactions").countDocuments();
        console.log("Total interactions:", count);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

checkInteractions();
