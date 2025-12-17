import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Demo course detail
  const course = {
    _id: id,
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning",
    creator: "AI Tutor",
    difficulty: "Intermediate",
    category: "Data Science",
    tags: ["AI", "ML", "Python"],
    modules: [
      {
        id: "mod-1",
        title: "Introduction to ML",
        order: 1,
        content: "Module content here",
        duration: 45,
        resources: [],
      },
    ],
    thumbnail: "/ml-course.jpg",
    status: "Published",
    pricing: { isFree: false, price: 99 },
    stats: { enrollments: 1234, completions: 678, avgRating: 4.8, totalReviews: 234 },
    createdDate: "2024-01-15",
    createdAt: "2024-01-15",
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ course })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await request.json()
  return NextResponse.json({ course: { _id: id, ...updates }, message: "Course updated successfully" })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ message: "Course deleted successfully" })
}
