"use client"

import { MetricsCards } from "@/components/admin/dashboard/metrics-cards"
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts"
import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table"
import { TopCoursesTable } from "@/components/admin/dashboard/top-courses-table"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Key Metrics - Self-contained with refresh */}
      <MetricsCards />

      {/* Charts - Self-contained with refresh */}
      <DashboardCharts />

      {/* Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentUsersTable />
        <TopCoursesTable />
      </div>
    </div>
  )
}
