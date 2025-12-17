import { PlatformAnalytics } from "@/components/admin/analytics/platform-analytics"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics - Actinova Admin",
  description: "Platform-wide analytics and insights",
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Platform Analytics</h1>
          <p className="text-foreground-muted mt-1">Comprehensive platform insights and metrics</p>
        </div>
      </div>

      <PlatformAnalytics />
    </div>
  )
}
