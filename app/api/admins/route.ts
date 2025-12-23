import { NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { sendApprovalEmail } from "@/lib/mail"

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
    const user = await verifyAdmin(request)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const adminsCollection = await getCollection("admins")
        const admins = await adminsCollection.find({}).sort({ createdAt: -1 }).toArray()

        const mappedAdmins = admins.map(admin => ({
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            isVerified: admin.isVerified,
            isApproved: admin.isApproved,
            createdAt: admin.createdAt,
            lastLogin: admin.updatedAt
        }))

        return NextResponse.json({ admins: mappedAdmins })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const user = await verifyAdmin(request)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id, isApproved } = await request.json()

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        const adminsCollection = await getCollection("admins")

        // Fetch existing logic to check status change
        const currentAdmin = await adminsCollection.findOne({ _id: new ObjectId(id) })

        if (!currentAdmin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 })
        }

        // Prevent self-approval change
        const currentUserId = String(user.id)
        const targetId = String(id)

        console.log(`[Admin API] Self-Approval Check - Current: ${currentUserId}, Target: ${targetId}`)

        if (currentUserId === targetId) {
            return NextResponse.json({ error: "Cannot change your own approval status" }, { status: 400 })
        }

        await adminsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isApproved } }
        )

        // Send email if approving
        if (isApproved && !currentAdmin.isApproved) {
            await sendApprovalEmail(currentAdmin.email, currentAdmin.name, request.nextUrl.origin)
        }

        return NextResponse.json({ message: "Admin updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update admin" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const user = await verifyAdmin(request)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    // Prevent self-deletion
    const currentUserId = String(user.id)
    const targetId = String(id)

    console.log(`[Admin API] Self-Deletion Check - Current: ${currentUserId}, Target: ${targetId}`)

    if (currentUserId === targetId) {
        return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
    }


    try {
        const adminsCollection = await getCollection("admins")
        await adminsCollection.deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ message: "Admin deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 })
    }
}
