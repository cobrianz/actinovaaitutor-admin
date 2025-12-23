import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()

        // Fetch notifications targeted for admin
        const notifications = await db.collection("notifications")
            .find({ target: "admin" })
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray()

        // If no notifications exist, you might optionally seed one or return empty
        // For now, we return empty or the found list

        // Map _id to id for frontend
        const mapped = notifications.map(n => ({
            ...n,
            id: n._id.toString(),
            timestamp: n.createdAt
        }))

        return NextResponse.json({ notifications: mapped })
    } catch (error) {
        console.error("Failed to fetch notifications:", error)
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { db } = await connectToDatabase()
        const { id } = await request.json()

        if (!id) {
            // Mark all as read
            await db.collection("notifications").updateMany(
                { target: "admin", read: false },
                { $set: { read: true } }
            )
        } else {
            // Mark specific as read
            await db.collection("notifications").updateOne(
                { _id: new ObjectId(id) },
                { $set: { read: true } }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to update notification:", error)
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        const { db } = await connectToDatabase()
        await db.collection("notifications").deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Failed to delete notification:", error)
        return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
    }
}
