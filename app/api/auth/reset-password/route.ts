import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getCollection } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
    try {
        const { token, password, confirmPassword } = await request.json()

        if (!token || !password || !confirmPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
        }

        const adminsCollection = await getCollection("admins")

        // Find admin with valid reset token and check expiry
        const admin = await adminsCollection.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: new Date().toISOString() }
        })

        if (!admin) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update password and clear reset fields
        await adminsCollection.updateOne(
            { _id: admin._id },
            {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date().toISOString()
                },
                $unset: {
                    resetToken: "",
                    resetTokenExpires: ""
                }
            }
        )

        return NextResponse.json({ message: "Password reset successfully" })

    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
