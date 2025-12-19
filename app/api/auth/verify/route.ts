import { NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json()

        if (!email || !code) {
            return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 })
        }

        // Find admin by email
        const adminsCollection = await getCollection("admins")
        const admin = await adminsCollection.findOne({ email })

        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 })
        }

        // Check if already verified
        if (admin.isVerified) {
            return NextResponse.json({ error: "Account already verified" }, { status: 400 })
        }

        // Check verification code
        if (admin.verificationCode !== code) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
        }

        // Check if code is expired
        if (admin.verificationExpires && new Date(admin.verificationExpires) < new Date()) {
            return NextResponse.json({ error: "Verification code expired" }, { status: 400 })
        }

        // Update admin as verified
        await adminsCollection.updateOne(
            { _id: admin._id },
            {
                $set: {
                    isVerified: true,
                    verificationCode: null,
                    verificationExpires: null,
                    updatedAt: new Date().toISOString()
                }
            }
        )

        return NextResponse.json({ message: "Account verified successfully" })
    } catch (error) {
        console.error("Verification error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
