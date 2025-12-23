
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkUsers() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/actinovaaitutor";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        console.log("Checking users collection for billing data...");
        // Fetch a user with billing history or subscription if possible
        const userWithBilling = await db.collection("users").findOne({
            $or: [
                { "billingHistory": { $exists: true, $not: { $size: 0 } } },
                { "subscription": { $exists: true } },
                { "plan": { $exists: true } }
            ]
        });

        if (userWithBilling) {
            console.log("User with billing data found:");
            console.log(JSON.stringify(userWithBilling, null, 2));
        } else {
            console.log("No user with explicit billing history found. Dumping a random user:");
            const anyUser = await db.collection("users").findOne({});
            console.log(JSON.stringify(anyUser, null, 2));
        }

        // Check distinct plans
        const plans = await db.collection("users").distinct("plan");
        // or maybe it's in subscription.plan
        console.log("Distinct 'plan' values:", plans);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

checkUsers();
