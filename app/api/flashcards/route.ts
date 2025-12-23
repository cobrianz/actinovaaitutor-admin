import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/flashcards - Get all flashcard sets
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const difficulty = searchParams.get("difficulty") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const { db } = await connectToDatabase()

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
      ]
    }

    if (difficulty !== "all") {
      query.difficulty = difficulty.toLowerCase()
    }

    // Get total count
    const total = await db.collection("cardSets").countDocuments(query)

    // Get paginated results
    const cardSets = await db.collection("cardSets")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Get user information for creators
    const userIds = Array.from(new Set(cardSets.map(set => set.userId).filter(Boolean)))
    const usersMap: Record<string, string> = {}

    if (userIds.length > 0) {
      const users = await db.collection("users").find({ _id: { $in: userIds } }).toArray()
      users.forEach(u => {
        usersMap[u._id.toString()] = u.name || u.email || "Unknown User"
      })
    }

    // Format response
    const formattedCardSets = cardSets.map(set => ({
      _id: set._id.toString(),
      title: set.title,
      topic: set.topic,
      difficulty: set.difficulty?.charAt(0).toUpperCase() + set.difficulty?.slice(1) || "Beginner",
      totalCards: set.totalCards || set.cards?.length || 0,
      creator: usersMap[set.userId?.toString()] || "Unknown User",
      createdAt: set.createdAt,
      lastAccessed: set.lastAccessed,
      progress: set.progress || 0,
      completed: set.completed || false,
      isPremium: set.isPremium || false,
      bookmarked: set.bookmarked || false,
    }))

    return NextResponse.json({
      flashcards: formattedCardSets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching flashcard sets:", error)
    return NextResponse.json({ error: "Failed to fetch flashcard sets" }, { status: 500 })
  }
}

// POST /api/flashcards - Create new flashcard set
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const newCardSet = {
      userId: body.userId ? new ObjectId(body.userId) : null,
      title: body.title,
      topic: body.topic,
      originalTopic: body.originalTopic || body.topic,
      difficulty: body.difficulty?.toLowerCase() || "beginner",
      totalCards: body.cards?.length || 0,
      cards: body.cards || [],
      isPremium: body.isPremium || false,
      progress: 0,
      completed: false,
      bookmarked: false,
      ankiExportReady: false,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      monthlyGenerationUsed: false,
    }

    const result = await db.collection("cardSets").insertOne(newCardSet)

    return NextResponse.json({
      flashcard: { ...newCardSet, _id: result.insertedId.toString() },
      message: "Flashcard set created successfully",
    })
  } catch (error) {
    console.error("Error creating flashcard set:", error)
    return NextResponse.json({ error: "Failed to create flashcard set" }, { status: 500 })
  }
}
