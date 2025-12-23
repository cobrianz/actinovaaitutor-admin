import { UserManagementTable } from "@/components/admin/users/user-management-table"
import { UserAnalyticsCharts } from "@/components/admin/users/user-analytics-charts"
import { UserMetrics } from "@/components/admin/users/user-metrics"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Management - Actinova Admin",
  description: "Manage users, subscriptions, and user analytics",
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">User Management</h1>
          <p className="text-foreground-muted mt-1">Manage users, subscriptions, and view user analytics</p>
        </div>
      </div>

      {/* User Metrics Cards */}
      <UserMetrics />

      {/* Analytics Charts */}
      <UserAnalyticsCharts />

      {/* User Management Table */}
      <UserManagementTable />
    </div>
  )
}
