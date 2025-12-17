import { NextResponse } from "next/server"
import type { Flashcard } from "@/lib/types"

const generateDemoFlashcards = (): Flashcard[] => {
  return Array.from({ length: 40 }, (_, i) => ({
    _id: `flashcard-${i + 1}`,
    question: `What is the definition of concept ${i + 1}?`,
    answer: `This is the answer to concept ${i + 1}, explaining key principles and applications.`,
    course: `Course ${(i % 5) + 1}`,
    difficulty: ["Easy", "Medium", "Hard"][i % 3] as any,
    tags: [`tag-${(i % 10) + 1}`],
    category: ["Programming", "Mathematics", "Science", "History"][i % 4],
    stats: {
      views: Math.floor(Math.random() * 1000) + 100,
      correct: Math.floor(Math.random() * 500) + 50,
      incorrect: Math.floor(Math.random() * 200) + 20,
      avgResponseTime: Math.floor(Math.random() * 30) + 5,
    },
    createdBy: "admin",
    status: ["active", "inactive"][i % 5] as any,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const difficulty = searchParams.get("difficulty") || "all"
  const status = searchParams.get("status") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let flashcards = generateDemoFlashcards()

  if (search) {
    flashcards = flashcards.filter((f) => f.question.toLowerCase().includes(search.toLowerCase()))
  }
  if (difficulty !== "all") {
    flashcards = flashcards.filter((f) => f.difficulty === difficulty)
  }
  if (status !== "all") {
    flashcards = flashcards.filter((f) => f.status === status)
  }

  const total = flashcards.length
  const paginatedFlashcards = flashcards.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    flashcards: paginatedFlashcards,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newFlashcard: Flashcard = {
    _id: `flashcard-${Date.now()}`,
    ...body,
    stats: { views: 0, correct: 0, incorrect: 0, avgResponseTime: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ flashcard: newFlashcard, message: "Flashcard created successfully" })
}
