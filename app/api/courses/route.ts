import { NextResponse } from "next/server"
import type { Course } from "@/lib/types"

const generateDemoCourses = (): Course[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    _id: `course-${i + 1}`,
    title: [
      "Introduction to Machine Learning",
      "Advanced React Patterns",
      "Data Structures & Algorithms",
      "Cloud Architecture with AWS",
      "Full Stack Development",
      "Python for Data Science",
      "UI/UX Design Fundamentals",
      "Mobile App Development",
      "Cybersecurity Basics",
      "DevOps Engineering",
    ][i % 10],
    description: "Comprehensive course covering all essential topics",
    creator: ["AI Tutor", "John Doe", "Jane Smith", "Dr. Williams"][i % 4],
    difficulty: ["Beginner", "Intermediate", "Advanced"][i % 3] as any,
    category: ["Programming", "Design", "Business", "Data Science"][i % 4],
    tags: ["AI", "Web Development", "Cloud", "Mobile"][i % 4] ? [`Tag${(i % 4) + 1}`] : [],
    modules: [],
    thumbnail: `/placeholder.svg?height=200&width=300&query=course-${i}`,
    status: ["Published", "Draft", "Archived"][i % 3] as any,
    pricing: {
      isFree: i % 3 === 0,
      price: i % 3 === 0 ? undefined : Math.floor(Math.random() * 200) + 50,
    },
    stats: {
      enrollments: Math.floor(Math.random() * 2000) + 500,
      completions: Math.floor(Math.random() * 1000) + 200,
      avgRating: Number.parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      totalReviews: Math.floor(Math.random() * 500) + 50,
    },
    createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
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

  let courses = generateDemoCourses()

  if (search) {
    courses = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
  }
  if (difficulty !== "all") {
    courses = courses.filter((c) => c.difficulty === difficulty)
  }
  if (status !== "all") {
    courses = courses.filter((c) => c.status === status)
  }

  const total = courses.length
  const paginatedCourses = courses.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    courses: paginatedCourses,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newCourse: Course = {
    _id: `course-${Date.now()}`,
    ...body,
    stats: {
      enrollments: 0,
      completions: 0,
      avgRating: 0,
      totalReviews: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ course: newCourse, message: "Course created successfully" })
}
