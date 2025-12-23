const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function syncCounts() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        console.log("--- AUDITING POST COUNTS ---");
        const posts = await db.collection("posts").find({}).toArray();

        for (const post of posts) {
            const actualCount = await db.collection("comments").countDocuments({
                postId: { $in: [post._id.toString(), post._id] }
            });

            console.log(`Post: ${post.title}`);
            console.log(`  Stored Count: ${post.commentsCount || 0}`);
            console.log(`  Actual Count: ${actualCount}`);

            if ((post.commentsCount || 0) !== actualCount || (post.commentsCount || 0) < 0) {
                console.log(`  !!! SYNCING: Updating commentsCount to ${actualCount}`);
                await db.collection("posts").updateOne(
                    { _id: post._id },
                    { $set: { commentsCount: actualCount } }
                );
            }
        }

        console.log("\n--- AUDIT COMPLETE ---");
        process.exit(0);
    } catch (error) {
        console.error("Audit failed:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

syncCounts();
