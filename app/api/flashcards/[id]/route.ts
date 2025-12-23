import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/flashcards/[id] - Get single flashcard set with all cards
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid flashcard ID" }, { status: 400 })
    }

    const cardSet = await db.collection("cardSets").findOne({ _id: new ObjectId(id) })

    if (!cardSet) {
      return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 })
    }

    // Get user information
    let creator = "Unknown User"
    if (cardSet.userId) {
      const user = await db.collection("users").findOne({ _id: cardSet.userId })
      creator = user?.name || user?.email || "Unknown User"
    }

    const formattedCardSet = {
      _id: cardSet._id.toString(),
      title: cardSet.title,
      topic: cardSet.topic,
      originalTopic: cardSet.originalTopic,
      difficulty: cardSet.difficulty,
      totalCards: cardSet.totalCards || cardSet.cards?.length || 0,
      cards: cardSet.cards || [],
      creator,
      createdAt: cardSet.createdAt,
      lastAccessed: cardSet.lastAccessed,
      progress: cardSet.progress || 0,
      completed: cardSet.completed || false,
      isPremium: cardSet.isPremium || false,
      bookmarked: cardSet.bookmarked || false,
      ankiExportReady: cardSet.ankiExportReady || false,
    }

    return NextResponse.json({ flashcard: formattedCardSet })
  } catch (error) {
    console.error("Error fetching flashcard set:", error)
    return NextResponse.json({ error: "Failed to fetch flashcard set" }, { status: 500 })
  }
}

// PUT /api/flashcards/[id] - Update flashcard set
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid flashcard ID" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    // Only update fields that are provided
    if (body.title !== undefined) updateData.title = body.title
    if (body.topic !== undefined) updateData.topic = body.topic
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty.toLowerCase()
    if (body.cards !== undefined) {
      updateData.cards = body.cards
      updateData.totalCards = body.cards.length
    }
    if (body.isPremium !== undefined) updateData.isPremium = body.isPremium
    if (body.progress !== undefined) updateData.progress = body.progress
    if (body.completed !== undefined) updateData.completed = body.completed
    if (body.bookmarked !== undefined) updateData.bookmarked = body.bookmarked

    const result = await db.collection("cardSets").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Flashcard set updated successfully",
      flashcard: { _id: id, ...updateData },
    })
  } catch (error) {
    console.error("Error updating flashcard set:", error)
    return NextResponse.json({ error: "Failed to update flashcard set" }, { status: 500 })
  }
}

// PATCH - Alias for PUT
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return PUT(request, { params })
}

// DELETE /api/flashcards/[id] - Delete flashcard set
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid flashcard ID" }, { status: 400 })
    }

    const result = await db.collection("cardSets").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Flashcard set deleted successfully" })
  } catch (error) {
    console.error("Error deleting flashcard set:", error)
    return NextResponse.json({ error: "Failed to delete flashcard set" }, { status: 500 })
  }
}
