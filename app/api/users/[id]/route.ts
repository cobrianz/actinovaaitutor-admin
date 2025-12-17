import { NextResponse } from "next/server"

// GET /api/users/:id - Get user by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // In production: const user = await User.findById(id)
  const demoUser = {
    _id: id,
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "active",
    subscription: {
      plan: "Pro",
      startDate: "2024-01-15",
      status: "active",
    },
    profile: {
      avatar: "/user-avatar.jpg",
      bio: "Passionate learner and technology enthusiast",
      country: "USA",
      timezone: "America/New_York",
      language: "en",
    },
    stats: {
      coursesEnrolled: 8,
      coursesCompleted: 5,
      totalStudyTime: 2340,
      lastLogin: new Date().toISOString(),
    },
    joinedDate: "2024-01-15",
    createdAt: "2024-01-15",
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ user: demoUser })
}

// PATCH /api/users/:id - Update user
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await request.json()

  // In production: const user = await User.findByIdAndUpdate(id, updates, { new: true })
  return NextResponse.json({ user: { _id: id, ...updates }, message: "User updated successfully" })
}

// DELETE /api/users/:id - Delete user
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // In production: await User.findByIdAndDelete(id)
  return NextResponse.json({ message: "User deleted successfully" })
}
