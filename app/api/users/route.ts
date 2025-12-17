import { NextResponse } from "next/server"
import type { User } from "@/lib/types"

// Demo data (replace with MongoDB queries)
const generateDemoUsers = (): User[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    _id: `user-${i + 1}`,
    name: [
      "Alice Johnson",
      "Bob Smith",
      "Carol Williams",
      "David Brown",
      "Emma Davis",
      "Frank Miller",
      "Grace Wilson",
      "Henry Moore",
      "Iris Taylor",
      "Jack Anderson",
    ][i % 10],
    email: `user${i + 1}@example.com`,
    status: ["active", "inactive", "pending", "suspended"][i % 4] as any,
    subscription: {
      plan: ["Free", "Basic", "Pro", "Enterprise"][i % 4] as any,
      startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: ["active", "cancelled", "expired"][i % 3] as any,
    },
    profile: {
      avatar: `/placeholder.svg?height=40&width=40&query=avatar-${i}`,
      bio: "Demo user bio",
      country: ["USA", "UK", "Canada", "Australia", "Germany"][i % 5],
      timezone: "UTC",
      language: "en",
    },
    stats: {
      coursesEnrolled: Math.floor(Math.random() * 10) + 1,
      coursesCompleted: Math.floor(Math.random() * 5),
      totalStudyTime: Math.floor(Math.random() * 5000) + 100,
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

// GET /api/users - Get all users with filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "all"
  const subscription = searchParams.get("subscription") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  // In production: const users = await User.find(filters).skip((page - 1) * limit).limit(limit)
  let users = generateDemoUsers()

  // Apply filters
  if (search) {
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
    )
  }
  if (status !== "all") {
    users = users.filter((u) => u.status === status)
  }
  if (subscription !== "all") {
    users = users.filter((u) => u.subscription.plan === subscription)
  }

  const total = users.length
  const paginatedUsers = users.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    users: paginatedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

// POST /api/users - Create new user
export async function POST(request: Request) {
  const body = await request.json()

  // In production: const user = await User.create(body)
  const newUser: User = {
    _id: `user-${Date.now()}`,
    ...body,
    stats: {
      coursesEnrolled: 0,
      coursesCompleted: 0,
      totalStudyTime: 0,
      lastLogin: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ user: newUser, message: "User created successfully" })
}
