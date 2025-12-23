import { NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"
import { sendPasswordResetEmail } from "@/lib/mail"

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const adminsCollection = await getCollection("admins")
        const admin = await adminsCollection.findOne({ email })

        if (!admin) {
            // For security, don't reveal if email exists
            return NextResponse.json({ message: "If account exists, reset email sent" })
        }

        // Generate reset token
        const resetToken = Math.random().toString(36).substring(2, 15) // Simple token
        const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString() // 1 hour

        await adminsCollection.updateOne(
            { _id: admin._id },
            {
                $set: {
                    resetToken,
                    resetTokenExpires: resetExpires
                }
            }
        )

        // Send email
        await sendPasswordResetEmail(email, resetToken, request.nextUrl.origin)

        return NextResponse.json({ message: "If account exists, reset email sent" })

    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
