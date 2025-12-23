"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, UserCheck, TrendingUp, Activity, Clock, Eye, Star } from "lucide-react"

interface MetricsCardsProps {
  data: any
  loading: boolean
}

export function MetricsCards({ data, loading }: MetricsCardsProps) {

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse border-border/50 bg-muted/20">
            <CardHeader className="h-20" />
            <CardContent className="h-20" />
          </Card>
        ))}
      </div>
    )
  }

  const overview = data?.overview || {}

  const metrics = [
    {
      title: "Total Users",
      value: (overview.totalUsers || 0).toLocaleString(),
      subtitle: `${(overview.activeUsers || 0).toLocaleString()} active, ${(overview.inactiveUsers || 0).toLocaleString()} inactive`,
      icon: Users,
      trend: `+${overview.growth?.users || 0}%`,
      color: "blue",
    },
    {
      title: "Total Courses",
      value: (overview.totalCourses || 0).toLocaleString(),
      subtitle: "Available courses",
      icon: BookOpen,
      trend: `+${overview.growth?.revenue || 0}%`,
      color: "purple",
    },
    {
      title: "Total Revenue",
      value: `KSh ${(overview.totalRevenue?.monthly || 0).toLocaleString()}`,
      subtitle: `KSh ${(overview.totalRevenue?.yearly || 0).toLocaleString()} projected yearly`,
      icon: DollarSign,
      trend: `+${overview.growth?.revenue || 0}%`,
      color: "green",
    },
    {
      title: "Active Subscriptions",
      value: (overview.activeSubscriptions || 0).toLocaleString(),
      subtitle: "Current subscribers",
      icon: UserCheck,
      trend: `+${overview.growth?.subscriptions || 0}%`,
      color: "blue",
    },
    {
      title: "DAU / MAU",
      value: `${(overview.dau || 0).toLocaleString()} / ${(overview.mau || 0).toLocaleString()}`,
      subtitle: "Daily / Monthly active",
      icon: Activity,
      trend: `+${overview.growth?.engagement || 0}%`,
      color: "purple",
    },
    {
      title: "Premium Ratio",
      value: overview.courseSection?.premiumRatio || "0%",
      subtitle: "Paid vs Free ratio",
      icon: TrendingUp,
      trend: "+2.4%",
      color: "green",
    },
    {
      title: "Avg. Rating",
      value: overview.courseSection?.avgRating || "4.5",
      subtitle: "Global content quality",
      icon: Star,
      trend: "Rising",
      color: "blue",
    },
    {
      title: "Total Visitors This Month",
      value: (overview.totalVisitorsThisMonth || 0).toLocaleString(),
      subtitle: "Website visitors",
      icon: Eye,
      trend: `+${overview.growth?.visitors || 0}%`,
      color: "purple",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className={`glass-${metric.color} border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500`}
          style={{ animationDelay: `${index * 75}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{metric.value}</div>
            <p className="text-xs text-foreground-muted mt-1">{metric.subtitle}</p>
            <p className="text-xs text-primary font-medium mt-2">{metric.trend} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
