import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/users/:id - Get user by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection("users")

    let userIdObj: ObjectId
    try {
      userIdObj = new ObjectId(id)
    } catch {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const doc = await collection.findOne({ _id: userIdObj })

    if (!doc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = doc._id.toString()

    // Get activity counts
    const [chatCount, noteCount, cardsCount, testCount] = await Promise.all([
      db.collection("chats").countDocuments({
        $or: [{ userId: userIdObj }, { userId: userId }]
      }),
      db.collection("user_notes").countDocuments({
        $or: [{ userId: userIdObj }, { userId: userId }]
      }),
      Promise.resolve(doc.generatedCardSets?.length || 0),
      db.collection("user_tests").countDocuments({
        $or: [{ userId: userIdObj }, { userId: userId }]
      }),
    ])

    // Standardize plan name
    const rawPlan = doc.subscription?.plan?.toLowerCase() || "free"
    const standardizedPlan = ["pro", "premium", "enterprise", "pro plus"].includes(rawPlan) ? "Premium" : "Free"

    const user = {
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
        bio: doc.bio || "",
        country: doc.country || doc.profile?.country || "Kenya",
        gender: doc.gender || doc.profile?.gender || "Not specified",
        phone: doc.phone || doc.profile?.phone || "",
      },
      billingHistory: doc.billingHistory || [],
      courses: doc.courses || [],
      stats: {
        lastLogin: doc.lastLogin || doc.updatedAt || new Date().toISOString(),
        totalChats: chatCount,
        totalNotes: noteCount,
        totalFlashcards: cardsCount,
        totalTests: testCount,
        coursesEnrolled: doc.courses?.length || 0,
        coursesCompleted: doc.courses?.filter((c: any) => c.status === "completed").length || 0,
        totalStudyTime: doc.totalLearningTime || 0,
      },
      joinedDate: doc.createdAt || new Date().toISOString(),
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PATCH /api/users/:id - Update user
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await request.json()

  // In production: const user = await User.findByIdAndUpdate(id, updates, { new: true })
  return NextResponse.json({ user: { _id: id, ...updates }, message: "User updated successfully" })
}

// DELETE /api/users/:id - Delete user
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // In production: await User.findByIdAndDelete(id)
  return NextResponse.json({ message: "User deleted successfully" })
}
