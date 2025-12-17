import { NextResponse } from "next/server"

// Demo data
const transactions = [
  {
    id: "TXN-2024-001",
    user: "John Doe",
    email: "john@example.com",
    amount: 39.99,
    plan: "Pro",
    status: "completed",
    method: "Credit Card",
    date: "2024-01-15",
  },
  // ... more transactions
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""

  let filtered = transactions

  if (search) {
    filtered = filtered.filter(
      (t) =>
        t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (status) {
    filtered = filtered.filter((t) => t.status === status)
  }

  const total = filtered.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginated = filtered.slice(start, end)

  return NextResponse.json({
    transactions: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
