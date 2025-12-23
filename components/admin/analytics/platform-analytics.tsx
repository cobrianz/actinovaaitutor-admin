"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, TrendingUp, Users, DollarSign, Activity } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
}

const platformGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  users: Math.floor(Math.random() * 2000) + 10000 + i * 500,
  revenue: Math.floor(Math.random() * 5000) + 30000 + i * 1000,
}))

const revenueBreakdown = [
  { name: "Subscriptions", value: 60, amount: 180000 },
  { name: "Course Sales", value: 25, amount: 75000 },
  { name: "Premium Content", value: 10, amount: 30000 },
  { name: "Other", value: 5, amount: 15000 },
]

const featureUsage = Array.from({ length: 10 }, (_, i) => ({
  feature: [
    "AI Tutor",
    "Flashcards",
    "Quizzes",
    "Courses",
    "Forums",
    "Live Sessions",
    "Study Plans",
    "Progress Tracking",
    "Notes",
    "Certifications",
  ][i],
  usage: Math.floor(Math.random() * 5000) + 1000,
  growth: (Math.random() * 30).toFixed(1),
}))

const userBehaviorClusters = [
  { segment: "Power Users", engagement: 85, count: 2500 },
  { segment: "Regular Users", engagement: 55, count: 6000 },
  { segment: "Casual Users", engagement: 25, count: 4500 },
  { segment: "New Users", engagement: 15, count: 2200 },
]

const summaryMetrics = [
  { metric: "Total Users", current: "15,234", previous: "13,890", change: "+9.7%" },
  { metric: "Active Subscriptions", current: "8,934", previous: "8,120", change: "+10.0%" },
  { metric: "Monthly Revenue", current: "$45,678", previous: "$41,230", change: "+10.8%" },
  { metric: "Course Completions", current: "2,456", previous: "2,180", change: "+12.7%" },
]

const deviceUsage = [
  { device: "Mobile", users: 8500, percentage: 55.8 },
  { device: "Desktop", users: 5200, percentage: 34.1 },
  { device: "Tablet", users: 1534, percentage: 10.1 },
]

const geographicData = Array.from({ length: 10 }, (_, i) => ({
  country: ["United States", "India", "United Kingdom", "Canada", "Australia", "Germany", "France", "Brazil", "Japan", "South Korea"][i],
  users: Math.floor(Math.random() * 2000) + 500,
  revenue: Math.floor(Math.random() * 10000) + 2000,
}))

const retentionData = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  cohort1: Math.max(100 - i * 8, 20),
  cohort2: Math.max(100 - (i + 2) * 8, 15),
  cohort3: Math.max(100 - (i + 4) * 8, 10),
}))

const conversionFunnel = [
  { stage: "Visitors", count: 50000, percentage: 100 },
  { stage: "Sign-ups", count: 15000, percentage: 30 },
  { stage: "Active Users", count: 12000, percentage: 24 },
  { stage: "Premium Users", count: 2500, percentage: 5 },
]

export function PlatformAnalytics() {
  const [timeRange, setTimeRange] = useState("12months")
  const [metricType, setMetricType] = useState("users")

  const handleExportReport = () => {
    toast.success("Analytics report exported successfully")
  }

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Platform Summary</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] glass border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              className="glass border-border/50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Previous</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryMetrics.map((item) => (
                <TableRow key={item.metric}>
                  <TableCell className="font-medium">{item.metric}</TableCell>
                  <TableCell className="text-right font-semibold">{item.current}</TableCell>
                  <TableCell className="text-right text-foreground-muted">{item.previous}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">{item.change}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Total Users</span>
            </div>
            <p className="text-2xl font-bold">15,234</p>
            <p className="text-xs text-green-500">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Revenue</span>
            </div>
            <p className="text-2xl font-bold">$45.6K</p>
            <p className="text-xs text-green-500">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Engagement</span>
            </div>
            <p className="text-2xl font-bold">67.8%</p>
            <p className="text-xs text-green-500">+4.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Growth Rate</span>
            </div>
            <p className="text-2xl font-bold">23.1%</p>
            <p className="text-xs text-green-500">+2.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>Users and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={platformGrowth}>
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
                <Line type="monotone" dataKey="users" stroke={COLORS.primary} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="revenue" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Revenue sources distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  dataKey="value"
                >
                  {revenueBreakdown.map((entry, index) => (
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
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>User device preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="users"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {deviceUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>User journey stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-foreground-muted">{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                    <div
                      className="h-full gradient-primary"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-foreground-muted text-right">{stage.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
