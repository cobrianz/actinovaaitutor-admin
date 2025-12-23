const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function simulateApi() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        const id = "694849e1abeb38ac9da26dd2";

        console.log(`--- SIMULATING GET /api/blogs/${id}/comments ---`);

        const query = { postId: id };
        if (ObjectId.isValid(id)) {
            query.postId = { $in: [id, new ObjectId(id)] };
        }

        console.log("Query:", JSON.stringify(query, null, 2));

        const comments = await db.collection("comments").aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $eq: ["$_id", "$$userId"] },
                                        { $eq: [{ $toString: "$_id" }, "$$userId"] }
                                    ]
                                }
                            }
                        },
                        { $project: { name: 1, full_name: 1, display_name: 1 } }
                    ],
                    as: "userDetails"
                }
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    userName: { $ifNull: ["$userDetails.name", { $ifNull: ["$userDetails.full_name", { $ifNull: ["$userDetails.display_name", "Anonymous"] }] }] }
                }
            },
            { $project: { userDetails: 0 } },
            { $sort: { createdAt: -1 } }
        ]).toArray();

        console.log("API returned comments count:", comments.length);
        if (comments.length > 0) {
            console.log("First Comment:", JSON.stringify(comments[0], null, 2));
        } else {
            // Check if simple find finds them
            const simpleFind = await db.collection("comments").find(query).toArray();
            console.log("Simple find found:", simpleFind.length);
        }

        process.exit(0);
    } catch (error) {
        console.error("Simulation failed:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

simulateApi();
