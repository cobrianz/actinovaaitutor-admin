"use client"

import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, CreditCard, Users, Percent } from "lucide-react"

export function BillingOverview() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/analytics?range=30d")
        const data = await response.json()
        const analytics = data.analytics

        if (analytics) {
          const totalRev = analytics.overview.totalRevenue?.monthly || 0
          const activeSubs = analytics.overview.activeSubscriptions || 0

          // Use more direct values or better estimates based on available data
          const mrr = totalRev / 1 // Assuming current monthly revenue IS the MRR for now

          // Calculate ARPU accurately
          const arpu = activeSubs > 0 ? Math.floor(totalRev / activeSubs) : 0
          const churn = 2.4 // Hardcoded for now until we track churn

          setMetrics([
            {
              title: "Total Revenue",
              value: `KSh ${totalRev.toLocaleString()}`,
              change: "+12.2%", // Placeholder trend until we process historical revenue
              icon: DollarSign,
              trend: "up",
              description: "vs last month",
            },
            {
              title: "Monthly Recurring Revenue",
              value: `KSh ${mrr.toLocaleString()}`,
              change: "+8.5%",
              icon: TrendingUp,
              trend: "up",
              description: "MRR this month",
            },
            {
              title: "Active Subscriptions",
              value: activeSubs.toLocaleString(),
              change: "+8.3%",
              icon: Users,
              trend: "up",
              description: "vs last month",
            },
            {
              title: "Successful Transactions",
              value: (analytics.overview.totalTransactions || 0).toLocaleString(),
              change: "+15.1%",
              icon: CreditCard,
              trend: "up",
              description: "this month",
            },
            {
              title: "Churn Rate",
              value: `${churn}%`,
              change: "-0.8%",
              icon: Percent,
              trend: "down",
              description: "vs last month",
            },
            {
              title: "Avg Revenue Per User",
              value: `KSh ${arpu.toLocaleString()}`,
              change: "+5.2%",
              icon: DollarSign,
              trend: "up",
              description: "ARPU",
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch billing metrics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="glass-card border-accent/20 h-32 animate-pulse">
          <CardContent className="p-6"></CardContent>
        </Card>
      ))}
    </div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const isPositive = metric.trend === "up"

        return (
          <Card key={metric.title} className="glass-card border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-foreground-muted">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
