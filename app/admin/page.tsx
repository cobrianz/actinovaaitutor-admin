import { MetricsCards } from "@/components/admin/dashboard/metrics-cards"
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts"
import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table"
import { TopCoursesTable } from "@/components/admin/dashboard/top-courses-table"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingUp, Users, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard Overview - Actinova Admin",
  description: "Admin dashboard overview with key metrics and insights",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex justify-end">
        <QuickActions />
      </div>

      {/* Key Metrics */}
      <MetricsCards />

      {/* Charts */}
      <DashboardCharts />

      {/* Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentUsersTable />
        <TopCoursesTable />
      </div>
    </div>
  )
}
