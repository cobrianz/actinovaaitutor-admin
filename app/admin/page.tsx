"use client"

import { useState, useEffect, useCallback } from "react"
import { MetricsCards } from "@/components/admin/dashboard/metrics-cards"
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts"
import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table"
import { TopCoursesTable } from "@/components/admin/dashboard/top-courses-table"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analytics")
      const result = await response.json()
      if (result.analytics) {
        setData(result.analytics)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const handleExport = useCallback(() => {
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `actinova-dashboard-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [data])

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex justify-end">
        <QuickActions onRefresh={fetchAnalytics} onExport={handleExport} />
      </div>

      {/* Key Metrics */}
      <MetricsCards data={data} loading={loading} />

      {/* Charts */}
      <DashboardCharts data={data?.charts} loading={loading} />

      {/* Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentUsersTable />
        <TopCoursesTable />
      </div>
    </div>
  )
}
