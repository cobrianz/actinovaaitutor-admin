import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        // 1. Get volume trends (last 30 days)
        const volumeTrendsRaw = await db.collection("contacts").aggregate([
            {
                $match: {
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

        // 2. Get category distribution
        const categoryData = await db.collection("contacts").aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]).toArray()

        // 3. Get resolution rates
        const resolutionData = await db.collection("contacts").aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]).toArray()

        // 4. Global Metrics
        const totalContacts = await db.collection("contacts").countDocuments()
        const newContacts = await db.collection("contacts").countDocuments({ status: "new" })
        const resolvedContactsRaw = await db.collection("contacts").find({ status: "resolved" }).toArray()
        const resolvedContactsCount = resolvedContactsRaw.length

        // Calculate average resolution time (hours)
        let avgResponseTime = 0
        if (resolvedContactsCount > 0) {
            const totalHours = resolvedContactsRaw.reduce((acc: number, contact: any) => {
                const created = new Date(contact.createdAt)
                const updated = new Date(contact.updatedAt)
                return acc + (updated.getTime() - created.getTime())
            }, 0)
            avgResponseTime = Number(((totalHours / resolvedContactsCount) / (1000 * 60 * 60)).toFixed(1))
        }

        // Format Trends for 30 days
        const volumeTrends = []
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            const dateStr = d.toISOString().split('T')[0]
            const displayStr = d.toLocaleDateString('default', { month: 'short', day: 'numeric' })

            const count = volumeTrendsRaw.find(v => v._id === dateStr)?.count || 0

            volumeTrends.push({
                date: displayStr,
                contacts: count
            })
        }

        return NextResponse.json({
            metrics: {
                total: totalContacts,
                new: newContacts,
                resolved: resolvedContactsCount,
                avgResponseTime
            },
            volumeTrends,
            categories: categoryData.map(c => ({
                name: (c._id || "general").charAt(0).toUpperCase() + (c._id || "general").slice(1),
                value: c.count
            })),
            resolutionRate: resolutionData.map(r => ({
                name: (r._id || "new").charAt(0).toUpperCase() + (r._id || "new").slice(1),
                value: r.count
            }))
        })
    } catch (error) {
        console.error("Contact analytics error:", error)
        return NextResponse.json({ error: "Failed to fetch contact analytics" }, { status: 500 })
    }
}
