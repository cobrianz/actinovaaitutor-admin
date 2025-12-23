import { BillingOverview } from "@/components/admin/billing/billing-overview"
import { SubscriptionPlans } from "@/components/admin/billing/subscription-plans"
import { TransactionHistory } from "@/components/admin/billing/transaction-history"
import { RevenueCharts } from "@/components/admin/billing/revenue-charts"
import { InvoiceManagement } from "@/components/admin/billing/invoice-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Billing & Revenue - Actinova Admin",
  description: "Manage subscriptions, transactions, and revenue analytics",
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Billing & Revenue</h1>
        <p className="text-foreground-muted mt-1">Manage subscriptions, payments, and financial analytics</p>
      </div>

      {/* Overview Metrics */}
      <BillingOverview />

      {/* Revenue Charts */}
      <RevenueCharts />

      {/* Subscription Plans */}
      <SubscriptionPlans />

      {/* Transaction History */}
      <div>
        <TransactionHistory />
      </div>
    </div>
  )
}
