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
  Cell,
  ZAxis,
} from "recharts"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
}

const performanceDistribution = Array.from({ length: 20 }, (_, i) => ({
  score: (i + 1) * 5,
  attempts: Math.floor(Math.random() * 100) + 50,
  students: Math.floor(Math.random() * 50) + 20,
}))

const completionTrends = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  completions: Math.floor(Math.random() * 200) + 150,
}))

const scoreRanges = [
  { name: "0-50%", value: 15, count: 230 },
  { name: "51-70%", value: 25, count: 380 },
  { name: "71-85%", value: 35, count: 530 },
  { name: "86-100%", value: 25, count: 380 },
]

const difficultyHeatmap = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  difficulty: Math.random() * 5 + 3,
}))

export function QuizAnalytics() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>Score distribution across all quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <XAxis
                dataKey="score"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: "Score (%)", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                dataKey="attempts"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ZAxis range={[50, 400]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Scatter data={performanceDistribution} fill={COLORS.primary} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Score Ranges</CardTitle>
          <CardDescription>Distribution of quiz scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
              <PieChart>
              <Pie
                data={scoreRanges}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {scoreRanges.map((entry, index) => (
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

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Completion Trends</CardTitle>
          <CardDescription>Monthly quiz completions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={completionTrends}>
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
              <Line type="monotone" dataKey="completions" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Question Difficulty Heatmap</CardTitle>
          <CardDescription>Difficulty by time of day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={difficultyHeatmap}>
              <defs>
                <linearGradient id="colorDifficulty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.tertiary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.tertiary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
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
                dataKey="difficulty"
                stroke={COLORS.tertiary}
                fillOpacity={1}
                fill="url(#colorDifficulty)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
