"use client"

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
import {
  demoGenerationTrends,
  demoDifficultyDistribution,
  demoEnrollmentAnalytics,
  demoCompletionVsDifficulty,
} from "@/lib/demo-data"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
  quinary: "var(--color-chart-5)",
}

export function CourseAnalyticsCharts() {
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
            <LineChart data={demoGenerationTrends}>
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
                data={demoDifficultyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {demoDifficultyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
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

      {/* Enrollment Analytics */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Enrollment Analytics</CardTitle>
          <CardDescription>Daily course enrollments over the past month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={demoEnrollmentAnalytics}>
              <defs>
                <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="enrollments"
                stroke={COLORS.secondary}
                fillOpacity={1}
                fill="url(#colorEnrollments)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Completion vs Difficulty */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Completion vs Difficulty</CardTitle>
          <CardDescription>Course completion rates by difficulty level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <XAxis
                dataKey="enrollments"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                name="Enrollments"
              />
              <YAxis
                dataKey="completion"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                name="Completion %"
              />
              <ZAxis range={[100, 400]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter data={demoCompletionVsDifficulty} fill={COLORS.tertiary}>
                {demoCompletionVsDifficulty.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
