"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, CreditCard, Users, Percent } from "lucide-react"

export function BillingOverview() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$284,560",
      change: "+18.2%",
      icon: DollarSign,
      trend: "up",
      description: "vs last month",
    },
    {
      title: "Monthly Recurring Revenue",
      value: "$45,280",
      change: "+12.5%",
      icon: TrendingUp,
      trend: "up",
      description: "MRR this month",
    },
    {
      title: "Active Subscriptions",
      value: "2,845",
      change: "+8.3%",
      icon: Users,
      trend: "up",
      description: "vs last month",
    },
    {
      title: "Successful Transactions",
      value: "3,924",
      change: "+15.1%",
      icon: CreditCard,
      trend: "up",
      description: "this month",
    },
    {
      title: "Churn Rate",
      value: "2.4%",
      change: "-0.8%",
      icon: Percent,
      trend: "down",
      description: "vs last month",
    },
    {
      title: "Avg Revenue Per User",
      value: "$158.90",
      change: "+5.2%",
      icon: DollarSign,
      trend: "up",
      description: "ARPU",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const isPositive = metric.trend === "up"

        return (
          <Card key={metric.title} className="glass-card border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-foreground-muted">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
