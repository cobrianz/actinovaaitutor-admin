"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BookOpen, Zap, DollarSign, Star } from "lucide-react"

export function CourseMetrics() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCourseMetrics() {
            try {
                // Fetch all courses
                const response = await fetch("/api/courses?limit=1000")
                const result = await response.json()
                const courses = result.courses || []

                // Calculate metrics
                const totalCourses = courses.length

                // Courses in last 24 hours
                const now = new Date()
                const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                const coursesLast24h = courses.filter((course: any) => {
                    const createdDate = new Date(course.createdAt || course.createdDate)
                    return createdDate >= twentyFourHoursAgo
                }).length

                // Premium ratio (paid courses / total courses)
                const paidCourses = courses.filter((course: any) => !course.pricing?.isFree).length
                const premiumRatio = totalCourses > 0
                    ? `${Math.round((paidCourses / totalCourses) * 100)}%`
                    : "0%"

                // Average rating
                const coursesWithRatings = courses.filter((course: any) => course.stats?.avgRating > 0)
                const avgRating = coursesWithRatings.length > 0
                    ? (coursesWithRatings.reduce((sum: number, course: any) => sum + (course.stats?.avgRating || 0), 0) / coursesWithRatings.length).toFixed(1)
                    : "0.0"

                setData({
                    totalCourses,
                    coursesLast24h,
                    premiumRatio,
                    avgRating
                })
            } catch (error) {
                console.error("Failed to fetch course metrics:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourseMetrics()
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

    const stats = [
        {
            title: "Total Courses",
            value: (data?.totalCourses || 0).toLocaleString(),
            subtitle: "Across all sources",
            icon: BookOpen,
            color: "blue",
        },
        {
            title: "Courses last 24hrs",
            value: (data?.coursesLast24h || 0).toLocaleString(),
            subtitle: "Recent additions",
            icon: Zap,
            color: "blue",
        },
        {
            title: "Premium Ratio",
            value: data?.premiumRatio || "0%",
            subtitle: "Paid vs Free content",
            icon: DollarSign,
            color: "purple",
        },
        {
            title: "Avg. Rating",
            value: data?.avgRating || "0.0",
            subtitle: "Overall course quality",
            icon: Star,
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
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
