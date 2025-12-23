require('dotenv').config({ path: '.env.local' })
const { MongoClient } = require('mongodb')

async function checkData() {
    const uri = process.env.MONGODB_URI
    const dbName = process.env.MONGODB_DB

    console.log('Connecting to database...')
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const db = client.db(dbName)

        // Check users with subscriptions
        console.log('\n=== USERS WITH SUBSCRIPTIONS ===')
        const activeUsers = await db.collection('users').find({
            'subscription.status': 'active'
        }).limit(2).toArray()

        console.log(`Found ${activeUsers.length} active subscription users`)
        if (activeUsers.length > 0) {
            console.log('\nSample subscription:', JSON.stringify(activeUsers[0].subscription, null, 2))
        }

        // Check all users count
        const totalUsers = await db.collection('users').countDocuments()
        const usersWithSub = await db.collection('users').countDocuments({ subscription: { $exists: true } })
        console.log(`\nTotal users: ${totalUsers}`)
        console.log(`Users with subscription field: ${usersWithSub}`)

        // Check plans
        console.log('\n=== PLANS ===')
        const plans = await db.collection('plans').find({}).toArray()
        console.log(`Found ${plans.length} plans`)
        plans.forEach(plan => {
            console.log(`- ${plan.name}: ${plan.price} (id: ${plan.id})`)
        })

        // Sample a user to see structure
        console.log('\n=== SAMPLE USER STRUCTURE ===')
        const sampleUser = await db.collection('users').findOne({})
        if (sampleUser) {
            console.log('User fields:', Object.keys(sampleUser))
            if (sampleUser.subscription) {
                console.log('Subscription fields:', Object.keys(sampleUser.subscription))
                console.log('Full subscription:', JSON.stringify(sampleUser.subscription, null, 2))
            }
        }

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await client.close()
    }
}

checkData()
