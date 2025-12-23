import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/contacts/[id] - Get single contact
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
    }

    const contact = await db.collection("contacts").findOne({ _id: new ObjectId(id) })

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    const formattedContact = {
      _id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      category: contact.category,
      status: contact.status,
      adminNotes: contact.adminNotes || "",
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }

    return NextResponse.json({ contact: formattedContact })
  } catch (error) {
    console.error("Error fetching contact:", error)
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 })
  }
}

// PUT /api/contacts/[id] - Update contact
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    // Only update fields that are provided
    if (body.status !== undefined) updateData.status = body.status
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes
    if (body.category !== undefined) updateData.category = body.category

    const result = await db.collection("contacts").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Contact updated successfully",
      contact: { _id: id, ...updateData },
    })
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}

// PATCH - Alias for PUT
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return PUT(request, { params })
}

// DELETE /api/contacts/[id] - Delete contact
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
    }

    const result = await db.collection("contacts").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 })
  }
}
