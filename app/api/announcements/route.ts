import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase()
        const body = await request.json()

        const {
            title,
            message,
            type,
            targetAudience,
            priority,
            scheduled,
            scheduleDate,
            scheduleTime,
            sendEmail,
            sendPush
        } = body

        // Validate required fields
        if (!title || !message) {
            return NextResponse.json({ error: "Title and message are required" }, { status: 400 })
        }

        const announcement = {
            title,
            message,
            type,
            targetAudience, // 'all', 'active', 'premium', etc.
            priority,
            scheduled,
            scheduleDate: scheduled ? scheduleDate : null,
            scheduleTime: scheduled ? scheduleTime : null,
            sendEmail,
            sendPush,
            target: "user", // Distinct from "admin" notifications
            createdAt: new Date(),
            read: false,
            sent: !scheduled // specific flag if using scheduler
        }

        await db.collection("notifications").insertOne(announcement)

        return NextResponse.json({ success: true, message: "Announcement created successfully" })

    } catch (error) {
        console.error("Failed to create announcement:", error)
        return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
    }
}
