import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET /api/contacts - Get all contacts with filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "all"
  const category = searchParams.get("category") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const { db } = await connectToDatabase()

    const query: any = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } }
      ]
    }
    if (status !== "all") {
      query.status = status.toLowerCase()
    }
    if (category !== "all") {
      query.category = category.toLowerCase()
    }

    const total = await db.collection("contacts").countDocuments(query)
    const rawContacts = await db.collection("contacts")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const contacts = rawContacts.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name || "Anonymous",
      email: doc.email || "No Email",
      subject: doc.subject || "No Subject",
      message: doc.message || "",
      category: doc.category || "general",
      status: doc.status || "new",
      adminNotes: doc.adminNotes || "",
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    }))

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
    })
  } catch (error) {
    console.error("Error fetching contacts from MongoDB:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

// POST /api/contacts - Create new contact/ticket
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const newDoc = {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      category: body.category || "general",
      status: body.status || "new",
      adminNotes: body.adminNotes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("contacts").insertOne(newDoc)

    return NextResponse.json({
      contact: { ...newDoc, _id: result.insertedId.toString() },
      message: "Contact created successfully"
    })
  } catch (error) {
    console.error("Error creating contact in MongoDB:", error)
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
