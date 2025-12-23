import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()

        const now = new Date()
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1)

        // Get all users with their billing history
        const users = await db.collection("users").find({}).toArray()

        // Get all plans with pricing
        const plans = await db.collection("plans").find({}).toArray()
        const planPricing: Record<string, number> = {}
        plans.forEach(plan => {
            const planId = (plan.id || plan.name?.toLowerCase() || '').toLowerCase()
            planPricing[planId] = plan.price || 0
        })

        // Calculate current active subscriptions and revenue
        const planStats: Record<string, { subscribers: number; revenue: number }> = {}
        let totalActiveSubscriptions = 0

        users.forEach(user => {
            const planId = (user.subscription?.plan || "free").toLowerCase()
            const planName = planId.charAt(0).toUpperCase() + planId.slice(1)

            if (!planStats[planName]) {
                planStats[planName] = { subscribers: 0, revenue: 0 }
            }

            planStats[planName].subscribers++

            // Calculate monthly revenue for active subscriptions
            if (user.subscription?.status === "active") {
                totalActiveSubscriptions++
                const price = planPricing[planId] || 0
                planStats[planName].revenue += price
            }
        })

        // Process billing history for revenue trends
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthlyData: Record<string, { revenue: number; transactions: number; refunds: number; refundAmount: number }> = {}

        // Initialize last 12 months
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
            monthlyData[monthKey] = { revenue: 0, transactions: 0, refunds: 0, refundAmount: 0 }
        }

        // Aggregate from billing history
        let successfulPayments = 0
        let failedPayments = 0
        let pendingPayments = 0
        const recentTransactions: any[] = []

        users.forEach(user => {
            const billingHistory = user.billingHistory || []

            billingHistory.forEach((transaction: any) => {
                const txDate = transaction.date ? new Date(transaction.date) : null

                if (txDate && txDate >= oneYearAgo) {
                    const monthKey = `${monthNames[txDate.getMonth()]} ${txDate.getFullYear()}`

                    if (monthlyData[monthKey]) {
                        const amount = transaction.amount || 0

                        if (transaction.status === "success" || transaction.status === "completed") {
                            monthlyData[monthKey].revenue += amount
                            monthlyData[monthKey].transactions++
                            successfulPayments++
                        } else if (transaction.status === "failed") {
                            failedPayments++
                        } else if (transaction.status === "pending") {
                            pendingPayments++
                        } else if (transaction.status === "refunded") {
                            monthlyData[monthKey].refunds++
                            monthlyData[monthKey].refundAmount += amount
                        }
                    }
                }

                // Collect recent transactions
                recentTransactions.push({
                    date: transaction.date,
                    user: user.name || "Unknown User",
                    amount: transaction.amount || 0,
                    status: transaction.status || "unknown",
                    plan: transaction.plan || user.subscription?.plan || "Unknown",
                    timestamp: txDate ? txDate.getTime() : 0
                })
            })
        })

        // Sort and limit recent transactions
        const sortedTransactions = recentTransactions
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10)
            .map(tx => ({
                date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : 'N/A',
                user: tx.user,
                amount: tx.amount,
                status: tx.status,
                plan: tx.plan
            }))

        // Calculate quarterly summaries
        const quarters: Record<string, { revenue: number; refunds: number; net: number }> = {}
        const currentYear = now.getFullYear()

        for (let q = 1; q <= 4; q++) {
            const quarterKey = `Q${q} ${currentYear}`
            quarters[quarterKey] = { revenue: 0, refunds: 0, net: 0 }

            const quarterMonths = [(q - 1) * 3, (q - 1) * 3 + 1, (q - 1) * 3 + 2]

            quarterMonths.forEach(monthIndex => {
                const monthKey = `${monthNames[monthIndex]} ${currentYear}`
                if (monthlyData[monthKey]) {
                    quarters[quarterKey].revenue += monthlyData[monthKey].revenue
                    quarters[quarterKey].refunds += monthlyData[monthKey].refundAmount
                }
            })

            quarters[quarterKey].net = quarters[quarterKey].revenue - quarters[quarterKey].refunds
        }

        // Calculate totals
        const totalRevenue = Object.values(monthlyData).reduce((sum, month) => sum + month.revenue, 0)
        const totalRefunds = Object.values(monthlyData).reduce((sum, month) => sum + month.refundAmount, 0)
        const totalPayments = successfulPayments + failedPayments + pendingPayments || 1

        // If no billing history, estimate from current subscriptions
        const estimatedMonthlyRevenue = Object.values(planStats).reduce((sum, plan) => sum + plan.revenue, 0)
        const hasRealTransactions = totalRevenue > 0

        return NextResponse.json({
            summary: {
                totalRevenue: hasRealTransactions ? totalRevenue : estimatedMonthlyRevenue,
                totalRefunds,
                netRevenue: hasRealTransactions ? (totalRevenue - totalRefunds) : estimatedMonthlyRevenue,
                activeSubscriptions: totalActiveSubscriptions,
                hasRealData: hasRealTransactions
            },
            quarters: Object.entries(quarters).reverse().map(([period, data], index, arr) => {
                const prevNet = arr[index + 1]?.[1]?.net || data.net || 1
                const growth = prevNet > 0 ? (((data.net - prevNet) / prevNet) * 100).toFixed(1) : "0.0"

                return {
                    period,
                    revenue: data.revenue,
                    refunds: data.refunds,
                    net: data.net,
                    growth: parseFloat(growth)
                }
            }),
            monthlyRevenue: Object.entries(monthlyData).map(([month, data]) => ({
                month: month.split(' ')[0],
                actual: data.revenue,
                projected: null
            })),
            monthlyRefunds: Object.entries(monthlyData).map(([month, data]) => ({
                month: month.split(' ')[0],
                refunds: data.refunds,
                amount: data.refundAmount
            })),
            paymentSuccess: [
                {
                    name: "Successful",
                    value: (successfulPayments / totalPayments) * 100,
                    count: successfulPayments
                },
                {
                    name: "Failed",
                    value: (failedPayments / totalPayments) * 100,
                    count: failedPayments
                },
                {
                    name: "Pending",
                    value: (pendingPayments / totalPayments) * 100,
                    count: pendingPayments
                },
            ],
            planPerformance: Object.entries(planStats).map(([name, data]) => ({
                name,
                value: estimatedMonthlyRevenue > 0 ? (data.revenue / estimatedMonthlyRevenue) * 100 : 0,
                revenue: data.revenue,
                subscribers: data.subscribers
            })),
            recentTransactions: sortedTransactions.length > 0 ? sortedTransactions : [
                {
                    date: new Date().toISOString().split('T')[0],
                    user: "No transactions yet",
                    amount: 0,
                    status: "N/A",
                    plan: "N/A"
                }
            ]
        })
    } catch (error) {
        console.error("Failed to fetch financial reports:", error)
        return NextResponse.json({ error: "Failed to fetch financial reports" }, { status: 500 })
    }
}
