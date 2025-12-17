import { NextResponse } from "next/server"
import type { Quiz } from "@/lib/types"

const generateDemoQuizzes = (): Quiz[] => {
  return Array.from({ length: 25 }, (_, i) => ({
    _id: `quiz-${i + 1}`,
    title: `Quiz ${i + 1}: Test Your Knowledge`,
    description: `Comprehensive quiz covering topics from Course ${(i % 5) + 1}`,
    course: `Course ${(i % 5) + 1}`,
    questions: [
      {
        id: `q-${i}-1`,
        question: "Sample question 1?",
        type: "multiple-choice" as const,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: "Explanation here",
        points: 10,
      },
    ],
    difficulty: ["Easy", "Medium", "Hard"][i % 3] as any,
    duration: Math.floor(Math.random() * 45) + 15,
    passingScore: 70,
    stats: {
      attempts: Math.floor(Math.random() * 500) + 100,
      avgScore: Math.floor(Math.random() * 30) + 60,
      completions: Math.floor(Math.random() * 400) + 80,
    },
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

  let quizzes = generateDemoQuizzes()

  if (search) {
    quizzes = quizzes.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
  }
  if (difficulty !== "all") {
    quizzes = quizzes.filter((q) => q.difficulty === difficulty)
  }
  if (status !== "all") {
    quizzes = quizzes.filter((q) => q.status === status)
  }

  const total = quizzes.length
  const paginatedQuizzes = quizzes.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    quizzes: paginatedQuizzes,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newQuiz: Quiz = {
    _id: `quiz-${Date.now()}`,
    ...body,
    stats: { attempts: 0, avgScore: 0, completions: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ quiz: newQuiz, message: "Quiz created successfully" })
}
