import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "monthly"

  const revenueReport = {
    summary: {
      totalRevenue: 548136,
      subscriptions: 356789,
      courses: 145890,
      other: 45457,
    },
    breakdown: Array.from({ length: 12 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      revenue: Math.floor(Math.random() * 50000) + 30000,
      subscriptions: Math.floor(Math.random() * 30000) + 20000,
      courses: Math.floor(Math.random() * 15000) + 8000,
    })),
  }

  return NextResponse.json({ report: revenueReport })
}
