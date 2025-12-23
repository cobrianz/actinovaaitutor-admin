import { NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me"

async function verifyAdmin(request: NextRequest) {
    const token = request.cookies.get("adminToken")?.value
    if (!token) return null

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        return decoded
    } catch (error) {
        return null
    }
}

export async function GET(request: NextRequest) {
    const session = await verifyAdmin(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const adminsCollection = await getCollection("admins")
        const admin = await adminsCollection.findOne({ _id: new ObjectId(session.id) })

        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 })
        }

        // Return safe profile data
        const profile = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            location: admin.location,
            bio: admin.bio,
            emailNotifications: admin.emailNotifications,
            pushNotifications: admin.pushNotifications,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            // Add other fields as needed
        }

        return NextResponse.json({ profile })
    } catch (error) {
        console.error("Failed to fetch profile:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const session = await verifyAdmin(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { name, email, phone, location, bio, emailNotifications, pushNotifications } = body

        const adminsCollection = await getCollection("admins")

        await adminsCollection.updateOne(
            { _id: new ObjectId(session.id) },
            {
                $set: {
                    name,
                    email,
                    phone,
                    location,
                    bio,
                    emailNotifications, // Save boolean prefs
                    pushNotifications,
                    updatedAt: new Date().toISOString()
                }
            }
        )

        // Fetch updated
        const updatedAdmin = await adminsCollection.findOne({ _id: new ObjectId(session.id) })

        if (!updatedAdmin) return NextResponse.json({ error: "Update failed" }, { status: 500 })

        const profile = {
            id: updatedAdmin._id,
            name: updatedAdmin.name,
            email: updatedAdmin.email,
            phone: updatedAdmin.phone,
            role: updatedAdmin.role,
            location: updatedAdmin.location,
            bio: updatedAdmin.bio,
            emailNotifications: updatedAdmin.emailNotifications,
            pushNotifications: updatedAdmin.pushNotifications,
            createdAt: updatedAdmin.createdAt,
            updatedAt: updatedAdmin.updatedAt,
        }

        return NextResponse.json({ profile, message: "Profile updated successfully" })

    } catch (error) {
        console.error("Failed to update profile:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
