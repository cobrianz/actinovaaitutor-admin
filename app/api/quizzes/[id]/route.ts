import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quiz = {
    _id: id,
    title: "ML Fundamentals Quiz",
    description: "Test your understanding of machine learning basics",
    course: "ML Course",
    questions: [
      {
        id: "q1",
        question: "What is supervised learning?",
        type: "multiple-choice",
        options: ["Learning with labels", "Learning without labels", "Reinforcement", "None"],
        correctAnswer: 0,
        explanation: "Supervised learning uses labeled data",
        points: 10,
      },
    ],
    difficulty: "Medium",
    duration: 30,
    passingScore: 70,
    stats: { attempts: 345, avgScore: 75, completions: 289 },
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ quiz })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await request.json()
  return NextResponse.json({ quiz: { _id: id, ...updates }, message: "Quiz updated successfully" })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ message: "Quiz deleted successfully" })
}
