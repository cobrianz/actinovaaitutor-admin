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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

interface DashboardChartsProps {
  data: any
  loading: boolean
}

export function DashboardCharts({ data, loading }: DashboardChartsProps) {

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
      {/* User Growth Chart */}
      <Card className="glass-blue border-border/50">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Daily new registrations over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {data.userGrowth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.userGrowth}>
                <XAxis
                  dataKey="date"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.split("-").slice(1).join("/")}
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No user growth data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Distribution Chart */}
      <Card className="glass-purple border-border/50">
        <CardHeader>
          <CardTitle>Revenue Distribution</CardTitle>
          <CardDescription>Revenue breakdown by subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          {data.revenueDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.revenueDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill={COLORS.primary}
                  dataKey="value"
                >
                  {data.revenueDistribution.map((entry: any, index: number) => (
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No revenue data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <Card className="glass-blue border-border/50">
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
          <CardDescription>Daily active users by hour of day</CardDescription>
        </CardHeader>
        <CardContent>
          {data.activityData && data.activityData.some((d: any) => d.users > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.activityData}>
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No activity data available for today
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Generation Trends */}
      <Card className="glass-purple border-border/50">
        <CardHeader>
          <CardTitle>Content Generation</CardTitle>
          <CardDescription>AI-generated courses and library additions</CardDescription>
        </CardHeader>
        <CardContent>
          {data.generationTrends?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.generationTrends}>
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
                <Line type="monotone" dataKey="courses" stroke={COLORS.tertiary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No content generation data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
