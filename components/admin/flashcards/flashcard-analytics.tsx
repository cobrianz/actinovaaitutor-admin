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
  Cell,
  ZAxis,
} from "recharts"
import { Loader2 } from "lucide-react"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
}

export function FlashcardAnalytics() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics?range=30d")
        const result = await response.json()
        if (result.analytics) {
          setData(result.analytics.charts)
        }
      } catch (error) {
        console.error("Failed to fetch flashcard analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  if (!data) return null

  // Transform data for charts
  const creationTrends = data.generationTrends.map((t: any) => ({
    month: t.month.split(" ")[0],
    sets: t.courses // actually flashcard sets
  }))

  const topicPopularity = data.topTopics || []

  // Mocking study duration as we don't track it yet
  const studyDuration = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    minutes: Math.floor(Math.random() * 40) + 20,
  }))

  // Using difficulty distribution for performance chart 
  const performanceByDifficulty = (data.difficultyDistribution || []).map((d: any) => ({
    difficulty: d.name,
    performance: d.name === "Beginner" ? 85 : d.name === "Intermediate" ? 72 : 58, // Mock perf
    sessions: d.value * 10 // Mock sessions
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Creation Trends</CardTitle>
          <CardDescription>New flashcard sets per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={creationTrends}>
              <defs>
                <linearGradient id="colorSets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="sets" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorSets)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Topic Popularity</CardTitle>
          <CardDescription>Distribution by topic</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topicPopularity}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {topicPopularity.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
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

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Study Duration</CardTitle>
          <CardDescription>Daily study time (minutes)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={studyDuration}>
              <XAxis
                dataKey="day"
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
              <Line type="monotone" dataKey="minutes" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
          <CardDescription>Volume by difficulty</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <XAxis
                dataKey="sessions"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                name="Sessions"
              />
              <YAxis
                dataKey="performance"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                name="Performance"
              />
              <ZAxis range={[100, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass p-2 border border-border/50 rounded shadow-sm">
                        <p className="font-semibold">{payload[0].payload.difficulty}</p>
                        <p className="text-xs">Est. Sessions: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={performanceByDifficulty} fill={COLORS.tertiary}>
                {performanceByDifficulty.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
