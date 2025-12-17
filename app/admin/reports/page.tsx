import { FinancialReports } from "@/components/admin/reports/financial-reports"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reports - Actinova Admin",
  description: "Financial reports and revenue analytics",
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Financial Reports</h1>
          <p className="text-foreground-muted mt-1">Revenue, subscriptions, and financial projections</p>
        </div>
      </div>

      <FinancialReports />
    </div>
  )
}
