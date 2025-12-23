const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'test';

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const plans = [
    {
        id: "free",
        name: "Free",
        price: 0,
        billing: "forever",
        features: ["5 AI-generated courses", "50 flashcards", "Basic analytics", "Community support", "Mobile app access"],
        status: "active",
        color: "purple",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "premium",
        name: "Premium",
        price: 30,
        billing: "month",
        features: [
            "Unlimited AI courses",
            "Unlimited flashcards",
            "AI tutor chat",
            "Priority support",
            "Progress tracking",
        ],
        status: "active",
        color: "cyan",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 200,
        billing: "month",
        features: [
            "Everything in Premium",
            "Unlimited Access",
            "Custom integrations",
            "Dedicated support",
            "Team management",
            "SLA",
        ],
        status: "active",
        color: "blue",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

async function seedPlans() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(MONGODB_DB);
        const plansCollection = db.collection('plans');

        // Delete existing plans to avoid duplicates and ensure freshness
        await plansCollection.deleteMany({});
        console.log('Cleared existing plans.');

        // Insert new plans
        const result = await plansCollection.insertMany(plans);
        console.log(`Successfully seeded ${result.insertedCount} plans.`);

    } catch (error) {
        console.error('Error seeding plans:', error);
    } finally {
        await client.close();
    }
}

seedPlans();
