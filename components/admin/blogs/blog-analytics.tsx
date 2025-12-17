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

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
}

const engagementTrends = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  views: Math.floor(Math.random() * 500) + 200,
  likes: Math.floor(Math.random() * 100) + 30,
}))

const categories = [
  { name: "Education", value: 35 },
  { name: "Technology", value: 28 },
  { name: "AI/ML", value: 22 },
  { name: "Study Tips", value: 15 },
]

const publishingFrequency = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  posts: Math.floor(Math.random() * 15) + 5,
}))

const readerDemographics = [
  { name: "Students", value: 45 },
  { name: "Educators", value: 30 },
  { name: "Professionals", value: 15 },
  { name: "Others", value: 10 },
]

export function BlogAnalytics() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
          <CardDescription>Views and likes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementTrends}>
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
              <Line type="monotone" dataKey="views" stroke={COLORS.primary} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="likes" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
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
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categories.map((entry, index) => (
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
          <CardTitle>Publishing Frequency</CardTitle>
          <CardDescription>Posts published per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={publishingFrequency}>
              <defs>
                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.tertiary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.tertiary} stopOpacity={0} />
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
              <Area type="monotone" dataKey="posts" stroke={COLORS.tertiary} fillOpacity={1} fill="url(#colorPosts)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Reader Demographics</CardTitle>
          <CardDescription>Audience composition</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={readerDemographics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {readerDemographics.map((entry, index) => (
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
    </div>
  )
}
