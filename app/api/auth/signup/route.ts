import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getCollection } from "@/lib/mongodb"
import { sendVerificationEmail } from "@/lib/mail"

const ADMIN_SECRET_KEY_1 = process.env.ADMIN_SECRET_KEY_1 || "key1"
const ADMIN_SECRET_KEY_2 = process.env.ADMIN_SECRET_KEY_2 || "key2"

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, password, secretKey1, secretKey2 } = await request.json()

        // Validate required fields
        if (!name || !email || !password || !secretKey1 || !secretKey2) {
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
        }

        // Validate secret keys
        if (secretKey1 !== ADMIN_SECRET_KEY_1 || secretKey2 !== ADMIN_SECRET_KEY_2) {
            return NextResponse.json({ error: "Invalid secret keys" }, { status: 403 })
        }

        const adminsCollection = await getCollection("admins")

        // Check if exists
        const existingAdmin = await adminsCollection.findOne({
            $or: [{ email }, { phone }]
        })

        if (existingAdmin) {
            return NextResponse.json({ error: "Admin already exists with this email or phone" }, { status: 409 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Generate verification code (6 digits)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

        // Create admin
        await adminsCollection.insertOne({
            name,
            email,
            phone,
            password: hashedPassword,
            isVerified: false,
            isApproved: false,
            role: "admin",
            verificationCode,
            verificationExpires,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })


        // Send email
        await sendVerificationEmail(email, verificationCode)

        return NextResponse.json({ message: "Admin created successfully. Please verify your email." })

    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
