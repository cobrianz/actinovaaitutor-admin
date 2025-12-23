"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts"
import { Loader2, Library, FileQuestion, GraduationCap, TrendingUp } from "lucide-react"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
  colors: [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57"
  ]
}

export function QuizAnalytics() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    avgQuestions: 0,
    courseCount: 0
  })
  const [charts, setCharts] = useState<{
    difficulty: any[],
    courses: any[],
    trends: any[]
  }>({
    difficulty: [],
    courses: [],
    trends: []
  })

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      try {
        setLoading(true)
        // Fetch up to 1000 tests to get a good representative sample for analytics
        const response = await fetch("/api/tests?limit=1000")
        const data = await response.json()

        if (data.tests) {
          analyzeData(data.tests)
        }
      } catch (error) {
        console.error("Failed to load test data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAndAnalyze()
  }, [])

  const analyzeData = (tests: any[]) => {
    // 1. Basic Metrics
    const totalQuizzes = tests.length
    const totalQuestions = tests.reduce((acc, t) => acc + (t.questionCount || 0), 0)
    const uniqueCourses = new Set(tests.map(t => t.course)).size

    setMetrics({
      totalQuizzes,
      totalQuestions,
      avgQuestions: totalQuizzes ? Math.round(totalQuestions / totalQuizzes) : 0,
      courseCount: uniqueCourses
    })

    // 2. Difficulty Distribution
    const diffMap: Record<string, number> = {}
    tests.forEach(t => {
      const d = t.difficulty || 'Unknown'
      diffMap[d] = (diffMap[d] || 0) + 1
    })
    const difficultyData = Object.entries(diffMap).map(([name, value]) => ({ name, value }))

    // 3. Course Distribution
    const courseMap: Record<string, number> = {}
    tests.forEach(t => {
      const c = t.course || 'General'
      courseMap[c] = (courseMap[c] || 0) + 1
    })
    // Top 7 courses
    const courseData = Object.entries(courseMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)

    // 4. Creation Trends (by Month)
    const trendMap: Record<string, number> = {}
    tests.forEach(t => {
      if (t.createdAt) {
        const date = new Date(t.createdAt)
        const key = date.toLocaleString('default', { month: 'short' })
        trendMap[key] = (trendMap[key] || 0) + 1
      }
    })
    // Simple sort by month index (assuming current year or rolling)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const trendData = months.map(m => ({
      month: m,
      quizzes: trendMap[m] || 0
    })).filter(d => {
      // Filter out future months if needed, or just keep all for consistency. 
      // For now, let's keep all 12 to show the timeline.
      return true
    })

    setCharts({
      difficulty: difficultyData,
      courses: courseData,
      trends: trendData
    })
  }

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Library className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">Active in library</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Across all quizzes</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Questions/Quiz</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgQuestions}</div>
            <p className="text-xs text-muted-foreground">Content density</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topic Coverage</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.courseCount}</div>
            <p className="text-xs text-muted-foreground">Unique courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Difficulty Distribution */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Difficulty Distribution</CardTitle>
            <CardDescription>Breakdown by difficulty level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={charts.difficulty}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.difficulty.map((entry, index) => (
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Distribution */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Top Courses</CardTitle>
            <CardDescription>Quizzes per subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.courses} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  cursor={{ fill: 'var(--color-accent)', opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} barSize={20}>
                  {charts.courses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.colors[index % COLORS.colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Creation Trends */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Creation Trends</CardTitle>
          <CardDescription>New quizzes added over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={charts.trends}>
              <defs>
                <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Area type="monotone" dataKey="quizzes" stroke="var(--color-chart-1)" fillOpacity={1} fill="url(#colorQuizzes)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
