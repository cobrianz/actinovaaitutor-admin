import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI!
const MONGODB_DB = process.env.MONGODB_DB || 'actinova-ai-tutor'

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb }
    }

    const client = new MongoClient(MONGODB_URI)

    try {
        await client.connect()
        const db = client.db(MONGODB_DB)

        cachedClient = client
        cachedDb = db

        return { client, db }
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        throw error
    }
}

export async function getCollection(collectionName: string) {
    const { db } = await connectToDatabase()
    return db.collection(collectionName)
}