import { NextResponse } from "next/server"
import type { User } from "@/lib/types"
import { getCollection, connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/users - Get all users with filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "all"
  const subscription = searchParams.get("subscription") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection("users")

    // Build query
    const query: any = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }
    if (status !== "all") {
      query.status = status
    }
    if (subscription !== "all") {
      query["subscription.plan"] = subscription.toLowerCase()
    }

    const total = await collection.countDocuments(query)
    const rawUsers = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Map MongoDB documents to User interface with activity counts
    const users = await Promise.all(rawUsers.map(async (doc: any) => {
      const userId = doc._id.toString()

      // Get activity counts - handle both ObjectId and string if necessary
      const [chatCount, noteCount, cardsCount] = await Promise.all([
        db.collection("chats").countDocuments({
          $or: [{ userId: doc._id }, { userId: userId }]
        }),
        db.collection("user_notes").countDocuments({
          $or: [{ userId: doc._id }, { userId: userId }]
        }),
        Promise.resolve(doc.generatedCardSets?.length || 0)
      ])

      // Standardize plan name
      const rawPlan = doc.subscription?.plan?.toLowerCase() || "free"
      const standardizedPlan = ["pro", "premium", "enterprise", "pro plus"].includes(rawPlan) ? "Premium" : "Free"

      return {
        _id: userId,
        name: doc.name || "Unknown",
        email: doc.email || "No Email",
        status: doc.status || "active",
        role: doc.role || "student",
        subscription: {
          plan: standardizedPlan,
          startDate: doc.subscription?.startDate || doc.createdAt || new Date().toISOString(),
          status: doc.subscription?.status || "active",
        },
        profile: {
          avatar: doc.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`,
          gender: doc.gender || "Not specified",
        },
        billingHistory: doc.billingHistory || [],
        courses: doc.courses || [],
        stats: {
          lastLogin: doc.lastLogin || doc.updatedAt || new Date().toISOString(),
          totalChats: chatCount,
          totalNotes: noteCount,
          totalFlashcards: cardsCount,
        },
        joinedDate: doc.createdAt || new Date().toISOString(),
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: doc.updatedAt || new Date().toISOString(),
      }
    }))

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users from MongoDB:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST /api/users - Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const collection = await getCollection("users")

    const newUserDoc = {
      ...body,
      role: body.role || "student",
      status: body.status || "active",
      monthlyUsage: 0,
      streak: 0,
      totalLearningTime: 0,
      achievements: [],
      courses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingCompleted: false,
    }

    const result = await collection.insertOne(newUserDoc)

    const newUser: User = {
      _id: result.insertedId.toString(),
      ...body,
      stats: {
        lastLogin: new Date().toISOString(),
      },
      createdAt: newUserDoc.createdAt,
      updatedAt: newUserDoc.updatedAt,
    }

    return NextResponse.json({ user: newUser, message: "User created successfully" })
  } catch (error) {
    console.error("Error creating user in MongoDB:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

// PATCH /api/users - Update user(s)
export async function PATCH(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { id, ids, ...updates } = await request.json()
    const collection = db.collection("users")

    if (ids && Array.isArray(ids)) {
      // Bulk update
      const objectIds = ids.map(id => new ObjectId(id))
      await collection.updateMany(
        { _id: { $in: objectIds } },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      )
      return NextResponse.json({ message: `Updated ${ids.length} users successfully` })
    } else if (id) {
      // Single update
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      )
      return NextResponse.json({ message: "User updated successfully" })
    }

    return NextResponse.json({ error: "No user ID provided" }, { status: 400 })
  } catch (error) {
    console.error("Error updating user(s) in MongoDB:", error)
    return NextResponse.json({ error: "Failed to update user(s)" }, { status: 500 })
  }
}

// DELETE /api/users - Delete user(s)
export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { id, ids } = await request.json()
    const collection = db.collection("users")

    if (ids && Array.isArray(ids)) {
      // Bulk delete
      const objectIds = ids.map(id => new ObjectId(id))
      await collection.deleteMany({ _id: { $in: objectIds } })
      return NextResponse.json({ message: `Deleted ${ids.length} users successfully` })
    } else if (id) {
      // Single delete
      await collection.deleteOne({ _id: new ObjectId(id) })
      return NextResponse.json({ message: "User deleted successfully" })
    }

    return NextResponse.json({ error: "No user ID provided" }, { status: 400 })
  } catch (error) {
    console.error("Error deleting user(s) from MongoDB:", error)
    return NextResponse.json({ error: "Failed to delete user(s)" }, { status: 500 })
  }
}
