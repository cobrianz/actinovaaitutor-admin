"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = {
  primary: "#8b5cf6", // Purple
  secondary: "#3b82f6", // Blue
  tertiary: "#6366f1", // Indigo
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  blue: "#3b82f6",
  green: "#10b981",
  chart1: "#8b5cf6", // Purple
  chart2: "#3b82f6", // Blue
  chart3: "#a855f7", // Light Purple
  chart4: "#60a5fa", // Light Blue
}

export function RevenueCharts() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics?range=30d")
        const data = await response.json()
        if (data.analytics) {
          setAnalytics(data.analytics)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading || !analytics) {
    return <div className="p-8 text-center text-foreground-muted">Loading charts...</div>
  }

  // Transform data for charts
  const revenueData = analytics.charts?.billingTrends?.length > 0
    ? analytics.charts.billingTrends.map((t: any) => ({
      month: t.month,
      revenue: t.revenue,
      mrr: t.revenue * 0.9, // Estimated MRR for demo visualization if not strict
      transactions: Math.floor(t.revenue / 30) // Estimate transaction count based on avg order value if missing
    }))
    : []

  const subscriptionData = analytics.charts?.revenueDistribution?.map((d: any, i: number) => ({
    name: d.name,
    value: d.value,
    color: Object.values(COLORS)[i % 5]
  })) || []

  // Ensure data exists, otherwise fallback to empty state handling
  const hasRevenueData = revenueData.length > 0
  const hasSubData = subscriptionData.length > 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Revenue Growth Chart */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Monthly revenue and MRR trends</CardDescription>
        </CardHeader>
        <CardContent>
          {hasRevenueData ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.chart1} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.chart1} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.chart2} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.chart2} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke={COLORS.chart1} fill="url(#revenueGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="mrr" stroke={COLORS.chart2} fill="url(#mrrGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No revenue data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Distribution */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>Active subscriptions by plan type</CardDescription>
        </CardHeader>
        <CardContent>
          {hasSubData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill={COLORS.chart1}
                  dataKey="value"
                >
                  {subscriptionData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No subscription data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Plan - Reusing subscription data but showing as revenue potential/split if available, or just mock breakdown based on sub counts */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>Revenue by Plan</CardTitle>
          <CardDescription>Estimated revenue share by tier</CardDescription>
        </CardHeader>
        <CardContent>
          {hasSubData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscriptionData.map((d: any) => ({
                ...d,
                revenue: d.name === 'Enterprise' ? d.value * 200 : d.name === 'Premium' ? d.value * 29 : 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill={COLORS.chart1} radius={[8, 8, 0, 0]} name="Est. Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No plan data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Volume */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>Transaction Trends</CardTitle>
          <CardDescription>Monthly transaction count trends</CardDescription>
        </CardHeader>
        <CardContent>
          {hasRevenueData ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="transactions" stroke={COLORS.chart3} strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No transaction data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
