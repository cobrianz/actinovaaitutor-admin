"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Users, DollarSign, Activity, TrendingUp, MessageSquare, BookOpen, FileText, TestTube, CreditCard } from "lucide-react"
import { toast } from "sonner"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
  ComposedChart,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"]

export function PlatformAnalytics() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const response = await fetch("/api/dashboard/analytics", { cache: "no-store" })
      const result = await response.json()
      if (result) {
        setData(result)
      }
    } catch (error) {
      console.error("Failed to fetch platform analytics:", error)
      toast.error("Failed to load analytics data")
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleExportReport = () => {
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `actinova-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Analytics report exported successfully")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="glass-card border-border/50 animate-pulse">
              <CardContent className="pt-6 h-24" />
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-card border-border/50 animate-pulse h-[350px]" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-muted">No analytics data available</p>
      </div>
    )
  }

  const metrics = data.metrics || {}
  const trends = data.trends || {}
  const distributions = data.distributions || {}
  const topPerformers = data.topPerformers || {}

  // Calculate growth percentages
  const userGrowthPercent = metrics.totalUsers > 0
    ? ((metrics.newUsersLast7Days / metrics.totalUsers) * 100).toFixed(1)
    : 0

  const subscriptionRate = metrics.totalUsers > 0
    ? ((metrics.activeSubscriptions / metrics.totalUsers) * 100).toFixed(1)
    : 0

  const contactResolutionRate = metrics.totalContacts > 0
    ? (((metrics.totalContacts - metrics.unresolvedContacts) / metrics.totalContacts) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchAnalytics(true)}
          className="glass-card border-border/50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportReport}
          className="glass-card border-border/50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{(metrics.totalUsers || 0).toLocaleString()}</p>
            <p className="text-xs text-green-500">+{userGrowthPercent}% this week</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Active Subscriptions</span>
            </div>
            <p className="text-2xl font-bold">{(metrics.activeSubscriptions || 0).toLocaleString()}</p>
            <p className="text-xs text-foreground-muted">{subscriptionRate}% of users</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Total Content</span>
            </div>
            <p className="text-2xl font-bold">
              {((metrics.totalPosts || 0) + (metrics.totalCourses || 0) + (metrics.totalFlashcards || 0) + (metrics.totalTests || 0)).toLocaleString()}
            </p>
            <p className="text-xs text-foreground-muted">
              {metrics.totalPosts || 0} posts, {metrics.totalCourses || 0} courses
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Engagement</span>
            </div>
            <p className="text-2xl font-bold">{(metrics.totalInteractions || 0).toLocaleString()}</p>
            <p className="text-xs text-foreground-muted">
              {metrics.totalComments || 0} comments
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">AI Chat Sessions</span>
            </div>
            <p className="text-2xl font-bold">{(metrics.totalChats || 0).toLocaleString()}</p>
            <p className="text-xs text-green-500">{metrics.chatSessionsLast30Days || 0} this month</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Flashcard Sets</span>
            </div>
            <p className="text-2xl font-bold">{(metrics.totalFlashcards || 0).toLocaleString()}</p>
            <p className="text-xs text-foreground-muted">Study materials</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <TestTube className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Tests Created</span>
            </div>
            <p className="text-2xl font-bold">{(metrics.totalTests || 0).toLocaleString()}</p>
            <p className="text-xs text-foreground-muted">Assessment library</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Contact Submissions</span>
            </div>
            <p className="text-2xl font-bold">{(metrics.totalContacts || 0).toLocaleString()}</p>
            <p className="text-xs text-green-500">{contactResolutionRate}% resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Growth Chart (90 days) */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>User Growth (90 Days)</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends.userGrowth || []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Users by subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trends.subscriptionDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(trends.subscriptionDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content by Category */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Content by Category</CardTitle>
            <CardDescription>Blog post distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributions.contentByCategory || []}>
                <XAxis
                  dataKey="category"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Multi-line Engagement Trends */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Engagement Trends (30 Days)</CardTitle>
            <CardDescription>Interactions, comments, and chats</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={
                (trends.engagement || []).map((item: any, index: number) => ({
                  date: item.date,
                  interactions: item.count,
                  comments: (trends.comments || [])[index]?.count || 0,
                  chats: (trends.chats || [])[index]?.count || 0,
                }))
              }>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="interactions" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" stroke="#06b6d4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="chats" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Creation Trend */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Content Creation (30 Days)</CardTitle>
            <CardDescription>Blog posts published over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends.contentCreation || []}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="posts" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Row 3 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Flashcards by Subject */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Flashcards by Subject</CardTitle>
            <CardDescription>Top 10 subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributions.flashcardsBySubject || []} layout="vertical">
                <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="subject"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tests by Difficulty */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Tests by Difficulty</CardTitle>
            <CardDescription>Distribution of test difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributions.testsByDifficulty || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ difficulty, percent }) => `${difficulty}: ${(percent * 100).toFixed(0)}%`}
                >
                  {(distributions.testsByDifficulty || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contact Status */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Contact Status</CardTitle>
            <CardDescription>Support ticket distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributions.contactStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="count"
                >
                  {(distributions.contactStatus || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Top Active Users</CardTitle>
          <CardDescription>Most engaged users by interaction count</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Interactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(topPerformers.activeUsers || []).slice(0, 10).map((user: any, index: number) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-foreground-muted">{user.email}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">{user.interactions.toLocaleString()}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
