"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { Loader2, RefreshCw } from "lucide-react"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
  colors: ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
}

export function BlogAnalytics() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>({
    engagementTrends: [],
    categories: [],
    publishingFrequency: [],
  })

  const fetchAnalytics = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      // 1. Fetch real-time trends and distributions
      const analyticsRes = await fetch("/api/blogs/analytics", { cache: "no-store" })
      const analyticsData = await analyticsRes.json()

      // 2. Fetch all blogs for global totals (views, likes, comments)
      const blogRes = await fetch("/api/blogs?limit=100", { cache: "no-store" })
      const blogData = await blogRes.json()
      const blogs = blogData.blogs || []

      // 3. Global Metrics
      const totalViews = blogs.reduce((acc: number, b: any) => acc + (b.stats?.views || 0), 0)
      const totalLikes = blogs.reduce((acc: number, b: any) => acc + (b.stats?.likes || 0), 0)
      const totalComments = blogs.reduce((acc: number, b: any) => acc + (b.stats?.comments || 0), 0)
      const avgEngagement = totalViews ? ((totalLikes / totalViews) * 100).toFixed(1) : 0

      setData({
        categories: analyticsData.categories || [],
        engagementTrends: analyticsData.engagementTrends || [],
        publishingFrequency: analyticsData.publishingFrequency || [],
        totalViews,
        totalLikes,
        totalComments,
        avgEngagement,
        postCount: blogs.length
      })
    } catch (error) {
      console.error("Failed to fetch blog analytics:", error)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-primary">{data.totalViews || 0}</p>
            <p className="text-sm text-foreground-muted">Total Views</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-secondary">{data.totalLikes || 0}</p>
            <p className="text-sm text-foreground-muted">Total Likes</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-tertiary">{data.avgEngagement || 0}%</p>
            <p className="text-sm text-foreground-muted">Engagement Rate</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-quaternary">{data.totalComments || 0}</p>
            <p className="text-sm text-foreground-muted">Comments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
            <CardDescription>Real-time likes and comments activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.engagementTrends}>
                <XAxis
                  dataKey="date"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line type="monotone" name="Likes" dataKey="likes" stroke={COLORS.primary} strokeWidth={2} dot={false} />
                <Line type="monotone" name="Comments" dataKey="comments" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Post distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.categories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS.colors[index % COLORS.colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
