"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { demoUserGrowth, demoRevenueDistribution } from "@/lib/demo-data"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
  quinary: "var(--color-chart-5)",
}

const activityData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  users: Math.floor(Math.random() * 500) + 200,
}))

const completionFunnel = [
  { name: "Enrolled", value: 1000, fill: COLORS.primary },
  { name: "Started", value: 850, fill: COLORS.secondary },
  { name: "In Progress", value: 600, fill: COLORS.tertiary },
  { name: "Completed", value: 420, fill: COLORS.quaternary },
]

export function DashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* User Growth Chart */}
      <Card className="glass-blue border-border/50">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Daily new registrations over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demoUserGrowth}>
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
              <Line type="monotone" dataKey="users" stroke={COLORS.primary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Distribution Chart */}
      <Card className="glass-purple border-border/50">
        <CardHeader>
          <CardTitle>Revenue Distribution</CardTitle>
          <CardDescription>Revenue breakdown by subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demoRevenueDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill={COLORS.primary}
                dataKey="value"
              >
                {demoRevenueDistribution.map((entry, index) => (
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

      {/* Activity Heatmap */}
      <Card className="glass-blue border-border/50">
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
          <CardDescription>Daily active users by hour of day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
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
              <Area type="monotone" dataKey="users" stroke={COLORS.secondary} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Completion Funnel */}
      <Card className="glass-purple border-border/50">
        <CardHeader>
          <CardTitle>Course Completion Funnel</CardTitle>
          <CardDescription>Student progress through courses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionFunnel}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {completionFunnel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
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
