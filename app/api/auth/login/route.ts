import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getCollection } from "@/lib/mongodb"

const ADMIN_SECRET_KEY_1 = process.env.ADMIN_SECRET_KEY_1!
const ADMIN_SECRET_KEY_2 = process.env.ADMIN_SECRET_KEY_2!
const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: NextRequest) {
    try {
        const { emailOrPhone, password, secretKey1, secretKey2 } = await request.json()

        // Validate required fields
        if (!emailOrPhone || !password || !secretKey1 || !secretKey2) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        // Validate secret keys
        if (secretKey1 !== ADMIN_SECRET_KEY_1 || secretKey2 !== ADMIN_SECRET_KEY_2) {
            return NextResponse.json({ error: "Invalid secret keys" }, { status: 400 })
        }

        // Find admin by email or phone
        const adminsCollection = await getCollection("admins")
        const admin = await adminsCollection.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        })

        if (!admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Check if admin is verified
        if (!admin.isVerified) {
            return NextResponse.json({ error: "Account not verified. Please verify your email first." }, { status: 401 })
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: "admin"
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        )

        // Update last login
        await adminsCollection.updateOne(
            { _id: admin._id },
            { $set: { updatedAt: new Date().toISOString() } }
        )

        return NextResponse.json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
