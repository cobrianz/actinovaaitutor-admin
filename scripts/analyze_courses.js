const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const fs = require('fs');

async function analyze() {
    const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
    const uri = envConfig.MONGODB_URI;
    const dbName = envConfig.MONGODB_DB || 'test';

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        let output = `Connected to database: ${dbName}\n`;

        const collections = ['library', 'explore_category_courses', 'explore_trending'];

        for (const colName of collections) {
            output += `\n--- Analyzing Collection: ${colName} ---\n`;
            const doc = await db.collection(colName).findOne({});
            if (doc) {
                output += JSON.stringify(doc, null, 2) + '\n';
            } else {
                output += 'No documents found.\n';
            }
        }

        fs.writeFileSync('scripts/analysis_output.json', output, 'utf8');
        console.log('Analysis complete. Results written to scripts/analysis_output.json');

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

analyze();
