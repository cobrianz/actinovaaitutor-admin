import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/tests - Get all tests
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
                { course: { $regex: search, $options: "i" } },
            ]
        }

        if (difficulty !== "all") {
            query.difficulty = difficulty.toLowerCase()
        }

        // Get total count
        const total = await db.collection("tests").countDocuments(query)

        // Get paginated results
        const tests = await db.collection("tests")
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray()

        // Get user information for creators
        const userIds = Array.from(new Set(tests.map(test => test.userId || test.createdBy).filter(Boolean)))
        const usersMap: Record<string, string> = {}

        if (userIds.length > 0) {
            const users = await db.collection("users").find({ _id: { $in: userIds } }).toArray()
            users.forEach(u => {
                usersMap[u._id.toString()] = u.name || u.email || "Unknown User"
            })
        }

        // Format response
        const formattedTests = tests.map(test => ({
            _id: test._id.toString(),
            title: test.title,
            course: test.course,
            difficulty: test.difficulty?.charAt(0).toUpperCase() + test.difficulty?.slice(1) || "Beginner",
            questionCount: test.questions?.length || 0,
            totalPoints: test.questions?.reduce((sum: number, q: any) => sum + (q.points || 1), 0) || 0,
            creator: usersMap[test.userId?.toString() || test.createdBy?.toString()] || "Unknown User",
            createdAt: test.createdAt,
        }))

        return NextResponse.json({
            tests: formattedTests,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching tests:", error)
        return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 })
    }
}

// POST /api/tests - Create new test
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { db } = await connectToDatabase()

        const newTest = {
            userId: body.userId ? new ObjectId(body.userId) : null,
            title: body.title,
            course: body.course,
            difficulty: body.difficulty?.toLowerCase() || "beginner",
            questions: body.questions || [],
            createdAt: new Date().toISOString(),
        }

        const result = await db.collection("tests").insertOne(newTest)

        return NextResponse.json({
            test: { ...newTest, _id: result.insertedId.toString() },
            message: "Test created successfully",
        })
    } catch (error) {
        console.error("Error creating test:", error)
        return NextResponse.json({ error: "Failed to create test" }, { status: 500 })
    }
}
