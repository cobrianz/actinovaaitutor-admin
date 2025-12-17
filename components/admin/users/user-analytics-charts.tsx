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
import {
  demoRegistrationTrends,
  demoSubscriptionDistribution,
  demoGeographicDistribution,
  demoRetentionCurve,
} from "@/lib/demo-data"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
  quinary: "var(--color-chart-5)",
}

export function UserAnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Registration Trends */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Registration Trends</CardTitle>
          <CardDescription>Monthly user registrations over the past year</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={demoRegistrationTrends}>
              <defs>
                <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
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
              <Area
                type="monotone"
                dataKey="users"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorRegistrations)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subscription Distribution */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>Users across different subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demoSubscriptionDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {demoSubscriptionDistribution.map((entry, index) => (
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

      {/* Geographic Distribution */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>User distribution across regions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demoGeographicDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {demoGeographicDistribution.map((entry, index) => (
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

      {/* Retention Curve */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>User Retention Curve</CardTitle>
          <CardDescription>Retention rate over 12 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demoRetentionCurve}>
              <XAxis
                dataKey="week"
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
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value) => `${Number(value).toFixed(1)}%`}
              />
              <Line type="monotone" dataKey="retention" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
