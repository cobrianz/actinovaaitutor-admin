"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Users, UserPlus, Zap, CreditCard, BookOpen } from "lucide-react"

export function UserMetrics() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const response = await fetch("/api/analytics")
                const result = await response.json()
                setData(result.analytics)
            } catch (error) {
                console.error("Failed to fetch user metrics:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [])

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-border/50 bg-muted/20 h-32" />
                ))}
            </div>
        )
    }

    const overview = data?.overview || {}
    const stats = [
        {
            title: "New Registrations",
            value: (overview.newUsers || 0).toLocaleString(),
            subtitle: "Past 30 days",
            icon: UserPlus,
            trend: "+12%",
            color: "blue",
        },
        {
            title: "Active Users (DAU)",
            value: (overview.dau || 0).toLocaleString(),
            subtitle: "Active in last 24h",
            icon: Zap,
            trend: `+${overview.growth?.dau || 5}%`,
            color: "purple",
        },
        {
            title: "Avg course/User",
            value: data?.overview?.avgCoursesPerUser || "0.0",
            subtitle: "Global engagement",
            icon: BookOpen,
            trend: `+${overview.growth?.avgCourses || 12}%`,
            color: "green",
        },
        {
            title: "Premium Revenue",
            value: `KSh ${(overview.totalRevenue?.monthly || 0).toLocaleString()}`,
            subtitle: "Current MRR",
            icon: CreditCard,
            trend: "+8%",
            color: "orange",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
                <Card
                    key={index}
                    className={`glass-${stat.color} border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    style={{ animationDelay: `${index * 75}ms` }}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground-muted">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-foreground-muted" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                        <p className="text-xs text-foreground-muted mt-1">{stat.subtitle}</p>
                        <p className="text-xs text-primary font-medium mt-2">{stat.trend} from last month</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
