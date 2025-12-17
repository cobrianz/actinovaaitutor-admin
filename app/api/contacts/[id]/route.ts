import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = {
    _id: id,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-1234",
    subject: "Technical Support",
    message: "I need help with course access issues.",
    status: "in-progress",
    priority: "high",
    assignedTo: "admin",
    tags: ["support", "urgent"],
    source: "website",
    createdAt: "2024-12-10",
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ contact })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await request.json()
  return NextResponse.json({ contact: { _id: id, ...updates }, message: "Contact updated successfully" })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ message: "Contact deleted successfully" })
}
