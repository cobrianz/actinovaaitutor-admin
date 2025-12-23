
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const statusFilter = searchParams.get("status") || ""

    const { db } = await connectToDatabase()

    const skip = (page - 1) * limit

    const pipeline: any[] = [
      { $match: { "billingHistory": { $exists: true, $ne: [] } } },
      { $unwind: "$billingHistory" },
      {
        $project: {
          id: { $ifNull: ["$billingHistory.id", "$billingHistory.invoiceId", "TXN-UNKNOWN"] },
          user: "$name",
          email: "$email",
          userId: "$_id",
          amount: "$billingHistory.amount",
          plan: { $ifNull: ["$billingHistory.plan", "$subscription.plan", "Premium"] }, // Fallback to current plan or default
          status: "$billingHistory.status",
          method: { $ifNull: ["$billingHistory.method", "Credit Card"] },
          date: "$billingHistory.date",
        }
      }
    ]

    // Apply strict filters after projection/unwind
    const matchStage: any = {}

    if (search) {
      matchStage.$or = [
        { user: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
      ]
    }

    if (statusFilter && statusFilter !== "all") {
      matchStage.status = statusFilter
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage })
    }

    pipeline.push({ $sort: { date: -1 } })

    // Count total before pagination
    const countPipeline = [...pipeline, { $count: "total" }]
    const countResult = await db.collection("users").aggregate(countPipeline).toArray()
    const total = countResult.length > 0 ? countResult[0].total : 0

    // Pagination
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    const transactions = await db.collection("users").aggregate(pipeline).toArray()

    return NextResponse.json({
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })

  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
