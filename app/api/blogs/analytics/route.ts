import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        // 1. Get likes trend from interactions
        const likesTrend = await db.collection("interactions").aggregate([
            {
                $match: {
                    type: "like",
                    $or: [
                        { createdAt: { $gte: thirtyDaysAgo.toISOString() } },
                        { createdAt: { $gte: thirtyDaysAgo } }
                    ]
                }
            },
            {
                $group: {
                    _id: { $substr: ["$createdAt", 0, 10] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray()

        // 2. Get comments trend from comments
        const commentsTrend = await db.collection("comments").aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo.toISOString() }
                }
            },
            {
                $group: {
                    _id: { $substr: ["$createdAt", 0, 10] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray()

        // 3. Get category distribution
        const categoryData = await db.collection("posts").aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]).toArray()

        // 4. Get monthly publishing frequency
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)
        const publishingTrend = await db.collection("posts").aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo.toISOString() }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $substr: ["$createdAt", 0, 4] },
                        month: { $substr: ["$createdAt", 5, 2] }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]).toArray()

        // Format Trends for 30 days
        const labels = []
        const engagementTrends = []
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            const dateStr = d.toISOString().split('T')[0]
            const displayStr = d.toLocaleDateString('default', { month: 'short', day: 'numeric' })

            const likes = likesTrend.find(l => l._id === dateStr)?.count || 0
            const comments = commentsTrend.find(c => c._id === dateStr)?.count || 0

            engagementTrends.push({
                date: displayStr,
                likes,
                comments,
                // Views can still be a slight proxy based on interactions if we don't track them 
                // but let's just show real events
                activity: likes + comments
            })
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const publishingFrequency = []
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const year = d.getFullYear().toString()
            const month = (d.getMonth() + 1).toString().padStart(2, '0')
            const count = publishingTrend.find(p => p._id.year === year && p._id.month === month)?.count || 0

            publishingFrequency.push({
                month: months[d.getMonth()],
                posts: count
            })
        }

        return NextResponse.json({
            engagementTrends,
            publishingFrequency,
            categories: categoryData.map(c => ({ name: c._id || "Uncategorized", value: c.count }))
        })
    } catch (error) {
        console.error("Blog analytics error:", error)
        return NextResponse.json({ error: "Failed to fetch blog analytics" }, { status: 500 })
    }
}
