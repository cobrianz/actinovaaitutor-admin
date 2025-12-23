"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  Cell,
} from "recharts"
import { Loader2 } from "lucide-react"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
  quinary: "var(--color-chart-5)",
}

export function CourseAnalyticsCharts() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourseAnalytics() {
      try {
        const response = await fetch("/api/analytics")
        const json = await response.json()
        if (json.analytics?.charts) {
          setData(json.analytics.charts)
        }
      } catch (error) {
        console.error("Failed to fetch course analytics charts:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass border-border/50 h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Generation Trends */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Course Generation Trends</CardTitle>
          <CardDescription>New courses created per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.generationTrends || []}>
              <XAxis
                dataKey="month"
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
              <Line type="monotone" dataKey="courses" stroke={COLORS.primary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Difficulty Distribution */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
          <CardDescription>Courses by difficulty level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.difficultyDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {data.difficultyDistribution?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 5]} />
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
  )
}
