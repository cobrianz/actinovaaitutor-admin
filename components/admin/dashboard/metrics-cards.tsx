"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, MessageSquare, UserCheck, TrendingUp, Activity, FileText, TestTube, CreditCard, RefreshCw } from "lucide-react"

export function MetricsCards() {
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
      console.error("Failed to fetch dashboard analytics:", error)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Platform Overview</h2>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="animate-pulse border-border/50 bg-muted/20">
              <CardHeader className="h-20" />
              <CardContent className="h-20" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const metrics = data?.metrics || {}
  const trends = data?.trends || {}

  // Calculate growth percentages
  const userGrowthPercent = metrics.totalUsers > 0
    ? ((metrics.newUsersLast7Days / metrics.totalUsers) * 100).toFixed(1)
    : 0

  const subscriptionRate = metrics.totalUsers > 0
    ? ((metrics.activeSubscriptions / metrics.totalUsers) * 100).toFixed(1)
    : 0

  const metricCards = [
    {
      title: "Total Users",
      value: (metrics.totalUsers || 0).toLocaleString(),
      subtitle: `${metrics.newUsersLast7Days || 0} new this week`,
      icon: Users,
      trend: `+${userGrowthPercent}%`,
      color: "blue",
    },
    {
      title: "Active Subscriptions",
      value: (metrics.activeSubscriptions || 0).toLocaleString(),
      subtitle: `${subscriptionRate}% of users`,
      icon: UserCheck,
      trend: `${subscriptionRate}%`,
      color: "green",
    },
    {
      title: "Total Courses",
      value: (metrics.totalCourses || 0).toLocaleString(),
      subtitle: "Available courses",
      icon: BookOpen,
      trend: "Growing",
      color: "purple",
    },
    {
      title: "Blog Posts",
      value: (metrics.totalPosts || 0).toLocaleString(),
      subtitle: `${metrics.totalComments || 0} comments`,
      icon: FileText,
      trend: `${metrics.totalComments || 0} comments`,
      color: "blue",
    },
    {
      title: "Flashcard Sets",
      value: (metrics.totalFlashcards || 0).toLocaleString(),
      subtitle: "Study materials",
      icon: Activity,
      trend: "Active",
      color: "purple",
    },
    {
      title: "Tests Created",
      value: (metrics.totalTests || 0).toLocaleString(),
      subtitle: "Assessment library",
      icon: TestTube,
      trend: "Available",
      color: "green",
    },
    {
      title: "Total Interactions",
      value: (metrics.totalInteractions || 0).toLocaleString(),
      subtitle: "Likes & engagements",
      icon: TrendingUp,
      trend: "Engaged",
      color: "blue",
    },
    {
      title: "AI Chat Sessions",
      value: (metrics.totalChats || 0).toLocaleString(),
      subtitle: "Tutor interactions",
      icon: MessageSquare,
      trend: "Active",
      color: "purple",
    },
    {
      title: "Contact Submissions",
      value: (metrics.totalContacts || 0).toLocaleString(),
      subtitle: `${metrics.unresolvedContacts || 0} pending`,
      icon: CreditCard,
      trend: `${metrics.unresolvedContacts || 0} pending`,
      color: metrics.unresolvedContacts > 0 ? "red" : "green",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Overview</h2>
          <p className="text-sm text-foreground-muted">Real-time analytics and metrics</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchAnalytics(true)}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric, index) => (
          <Card
            key={index}
            className={`glass-card border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-foreground-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{metric.value}</div>
              <p className="text-xs text-foreground-muted mt-1">{metric.subtitle}</p>
              <p className="text-xs text-primary font-medium mt-2">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
