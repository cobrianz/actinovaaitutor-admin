const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function auditPost() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        const postIdStr = "694849e1abeb38ac9da26dd2";
        const postIdObj = new ObjectId(postIdStr);

        console.log(`--- AUDITING POST: ${postIdStr} ---`);

        const post = await db.collection("posts").findOne({ _id: postIdObj });
        console.log("Post Stored Count:", post ? post.commentsCount : "NOT FOUND");

        const compQueryString = { postId: postIdStr };
        const compQueryObj = { postId: postIdObj };

        const stringComments = await db.collection("comments").find(compQueryString).toArray();
        const objComments = await db.collection("comments").find(compQueryObj).toArray();

        console.log("Comments with String postId:", stringComments.length);
        console.log("Comments with ObjectId postId:", objComments.length);

        if (stringComments.length > 0) {
            console.log("Sample String Comment:", JSON.stringify(stringComments[0], null, 2));
        }
        if (objComments.length > 0) {
            console.log("Sample Obj Comment:", JSON.stringify(objComments[0], null, 2));
        }

        console.log("\n--- ANALYTICS DATA (INTERACTIONS) ---");
        const interactions = await db.collection("interactions").find({
            $or: [
                { postId: postIdStr },
                { postId: postIdObj }
            ]
        }).toArray();
        console.log("Total Interactions for Post:", interactions.length);
        if (interactions.length > 0) {
            console.log("Sample Interaction:", JSON.stringify(interactions[0], null, 2));
            console.log("Interaction postId type:", typeof interactions[0].postId);
        }

        process.exit(0);
    } catch (error) {
        console.error("Audit failed:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

auditPost();
