import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/blogs/[id]/comments - Get all comments for a post
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { db } = await connectToDatabase()
        const { id } = await params

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
        }

        const query: any = { postId: id }
        if (ObjectId.isValid(id)) {
            query.postId = { $in: [id, new ObjectId(id)] }
        }

        const comments = await db.collection("comments").aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $eq: ["$_id", "$$userId"] },
                                        { $eq: [{ $toString: "$_id" }, "$$userId"] }
                                    ]
                                }
                            }
                        },
                        { $project: { name: 1, full_name: 1, display_name: 1 } }
                    ],
                    as: "userDetails"
                }
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    userName: { $ifNull: ["$userDetails.name", { $ifNull: ["$userDetails.full_name", { $ifNull: ["$userDetails.display_name", "Anonymous"] }] }] }
                }
            },
            { $project: { userDetails: 0 } },
            { $sort: { createdAt: -1 } }
        ]).toArray()

        return NextResponse.json({ comments })
    } catch (error) {
        console.error("Error fetching comments:", error)
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
    }
}

// PUT /api/blogs/[id]/comments - Moderate a comment (status update)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { db } = await connectToDatabase()
        const { id: postId } = await params
        const body = await request.json()
        const { commentId, status } = body

        if (!ObjectId.isValid(commentId)) {
            return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
        }

        const result = await db.collection("comments").updateOne(
            { _id: new ObjectId(commentId) },
            { $set: { status, updatedAt: new Date().toISOString() } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Comment status updated" })
    } catch (error) {
        console.error("Error updating comment:", error)
        return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
    }
}

// DELETE /api/blogs/[id]/comments - Delete a comment
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { db } = await connectToDatabase()
        const { id: postId } = await params
        const { searchParams } = new URL(request.url)
        const commentId = searchParams.get("commentId")

        if (!commentId || !ObjectId.isValid(commentId)) {
            return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
        }

        const result = await db.collection("comments").deleteOne({
            _id: new ObjectId(commentId)
        })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 })
        }

        // Attempt to decrement commentsCount on post with safety check
        try {
            if (ObjectId.isValid(postId)) {
                await db.collection("posts").updateOne(
                    { _id: new ObjectId(postId) },
                    [
                        {
                            $set: {
                                commentsCount: {
                                    $max: [0, { $subtract: ["$commentsCount", 1] }]
                                }
                            }
                        }
                    ]
                )
            }
        } catch (e) {
            console.error("Failed to decrement comment count", e)
        }

        return NextResponse.json({ message: "Comment deleted successfully" })
    } catch (error) {
        console.error("Error deleting comment:", error)
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
    }
}
