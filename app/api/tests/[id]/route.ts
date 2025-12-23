import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/tests/[id] - Get single test with all questions
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { db } = await connectToDatabase()
        const { id } = await params

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid test ID" }, { status: 400 })
        }

        const test = await db.collection("tests").findOne({ _id: new ObjectId(id) })

        if (!test) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 })
        }

        // Get user information
        let creator = "Unknown User"
        const userId = test.userId || test.createdBy
        if (userId) {
            const user = await db.collection("users").findOne({ _id: userId })
            creator = user?.name || user?.email || "Unknown User"
        }

        const formattedTest = {
            _id: test._id.toString(),
            title: test.title,
            course: test.course,
            difficulty: test.difficulty,
            questions: test.questions || [],
            questionCount: test.questions?.length || 0,
            totalPoints: test.questions?.reduce((sum: number, q: any) => sum + (q.points || 1), 0) || 0,
            creator,
            createdAt: test.createdAt,
        }

        return NextResponse.json({ test: formattedTest })
    } catch (error) {
        console.error("Error fetching test:", error)
        return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 })
    }
}

// PUT /api/tests/[id] - Update test
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { db } = await connectToDatabase()
        const { id } = await params
        const body = await request.json()

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid test ID" }, { status: 400 })
        }

        const updateData: any = {
            updatedAt: new Date().toISOString(),
        }

        // Only update fields that are provided
        if (body.title !== undefined) updateData.title = body.title
        if (body.course !== undefined) updateData.course = body.course
        if (body.difficulty !== undefined) updateData.difficulty = body.difficulty.toLowerCase()
        if (body.questions !== undefined) updateData.questions = body.questions

        const result = await db.collection("tests").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Test updated successfully",
            test: { _id: id, ...updateData },
        })
    } catch (error) {
        console.error("Error updating test:", error)
        return NextResponse.json({ error: "Failed to update test" }, { status: 500 })
    }
}

// PATCH - Alias for PUT
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    return PUT(request, { params })
}

// DELETE /api/tests/[id] - Delete test
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { db } = await connectToDatabase()
        const { id } = await params

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid test ID" }, { status: 400 })
        }

        const result = await db.collection("tests").deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Test deleted successfully" })
    } catch (error) {
        console.error("Error deleting test:", error)
        return NextResponse.json({ error: "Failed to delete test" }, { status: 500 })
    }
}
