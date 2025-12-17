"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 28500, mrr: 32000, transactions: 420 },
  { month: "Feb", revenue: 32000, mrr: 35000, transactions: 485 },
  { month: "Mar", revenue: 35500, mrr: 38000, transactions: 520 },
  { month: "Apr", revenue: 38000, mrr: 40500, transactions: 550 },
  { month: "May", revenue: 42000, mrr: 43000, transactions: 590 },
  { month: "Jun", revenue: 45280, mrr: 45280, transactions: 625 },
]

const subscriptionData = [
  { name: "Free", value: 1250, color: "var(--color-chart-1)" },
  { name: "Basic", value: 890, color: "var(--color-chart-2)" },
  { name: "Pro", value: 580, color: "var(--color-chart-3)" },
  { name: "Enterprise", value: 125, color: "var(--color-chart-4)" },
]

const revenueByPlan = [
  { plan: "Free", revenue: 0 },
  { plan: "Basic", revenue: 17800 },
  { plan: "Pro", revenue: 23200 },
  { plan: "Enterprise", revenue: 4280 },
]

export function RevenueCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Revenue Growth Chart */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Monthly revenue and MRR trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" fill="url(#revenueGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="mrr" stroke="var(--color-chart-2)" fill="url(#mrrGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subscription Distribution */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>Active subscriptions by plan type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="var(--color-chart-1)"
                dataKey="value"
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Plan */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>Revenue by Plan</CardTitle>
          <CardDescription>Monthly revenue breakdown by subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="plan" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transaction Volume */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>Transaction Volume</CardTitle>
          <CardDescription>Monthly transaction count trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="transactions" stroke="var(--color-chart-3)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
