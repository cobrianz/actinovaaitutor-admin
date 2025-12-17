import { NextResponse } from "next/server"
import type { Contact } from "@/lib/types"

const generateDemoContacts = (): Contact[] => {
  return Array.from({ length: 40 }, (_, i) => ({
    _id: `contact-${i + 1}`,
    name: ["John Doe", "Jane Smith", "Alice Johnson", "Bob Wilson"][i % 4],
    email: `contact${i + 1}@example.com`,
    phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`,
    subject: ["Technical Support", "Course Inquiry", "Billing Question", "General Feedback", "Partnership Opportunity"][
      i % 5
    ],
    message: "This is a demo message from a user reaching out for assistance.",
    status: ["new", "in-progress", "resolved", "closed"][i % 4] as any,
    priority: ["low", "medium", "high", "urgent"][i % 4] as any,
    assignedTo: i % 3 === 0 ? "admin" : undefined,
    tags: [`tag-${(i % 5) + 1}`],
    source: ["website", "email", "phone", "chat"][i % 4] as any,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: i % 4 === 2 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "all"
  const priority = searchParams.get("priority") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let contacts = generateDemoContacts()

  if (search) {
    contacts = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
    )
  }
  if (status !== "all") {
    contacts = contacts.filter((c) => c.status === status)
  }
  if (priority !== "all") {
    contacts = contacts.filter((c) => c.priority === priority)
  }

  const total = contacts.length
  const paginatedContacts = contacts.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    contacts: paginatedContacts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newContact: Contact = {
    _id: `contact-${Date.now()}`,
    ...body,
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ contact: newContact, message: "Contact created successfully" })
}
