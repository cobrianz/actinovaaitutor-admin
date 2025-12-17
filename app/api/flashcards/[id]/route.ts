import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const flashcard = {
    _id: id,
    question: "What is Machine Learning?",
    answer: "Machine Learning is a subset of AI that enables systems to learn from data.",
    course: "ML Basics",
    difficulty: "Medium",
    tags: ["AI", "ML"],
    category: "Programming",
    stats: { views: 456, correct: 234, incorrect: 56, avgResponseTime: 12 },
    createdBy: "admin",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ flashcard })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await request.json()
  return NextResponse.json({ flashcard: { _id: id, ...updates }, message: "Flashcard updated successfully" })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ message: "Flashcard deleted successfully" })
}
