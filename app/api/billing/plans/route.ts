import { NextResponse } from "next/server"

const plans = [
  {
    id: "1",
    name: "Free",
    price: 0,
    billing: "forever",
    features: ["5 AI-generated courses", "50 flashcards", "Basic analytics"],
    subscribers: 1250,
    status: "active",
  },
  // ... more plans
]

export async function GET() {
  return NextResponse.json({ plans })
}

export async function POST(request: Request) {
  const body = await request.json()

  const newPlan = {
    id: `${plans.length + 1}`,
    ...body,
    subscribers: 0,
    createdAt: new Date().toISOString(),
  }

  plans.push(newPlan)

  return NextResponse.json({ plan: newPlan }, { status: 201 })
}
