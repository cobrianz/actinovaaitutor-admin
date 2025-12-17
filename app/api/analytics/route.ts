import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get("range") || "30d"

  const analytics = {
    overview: {
      totalUsers: 15234,
      activeUsers: 12456,
      newUsers: 1234,
      totalRevenue: 548136,
      growth: {
        users: 12.5,
        revenue: 18.3,
        engagement: 8.7,
      },
    },
    engagement: {
      avgSessionDuration: 42.5,
      avgPagesPerSession: 5.8,
      bounceRate: 32.4,
      returnRate: 67.6,
    },
    topContent: [
      { title: "Introduction to ML", views: 5234, engagement: 78 },
      { title: "React Patterns", views: 4567, engagement: 82 },
    ],
    traffic: {
      direct: 35,
      search: 30,
      social: 20,
      referral: 15,
    },
  }

  return NextResponse.json({ analytics })
}
