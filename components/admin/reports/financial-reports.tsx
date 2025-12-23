"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
}

const revenueProjections = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  actual: i < 6 ? Math.floor(Math.random() * 5000) + 40000 : null,
  projected: i >= 6 ? Math.floor(Math.random() * 5000) + 45000 + (i - 6) * 1000 : null,
}))

const paymentSuccess = [
  { name: "Successful", value: 92, count: 8280 },
  { name: "Failed", value: 5, count: 450 },
  { name: "Pending", value: 3, count: 270 },
]

const refundTrends = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  refunds: Math.floor(Math.random() * 50) + 20,
  amount: Math.floor(Math.random() * 5000) + 2000,
}))

const planPerformance = [
  { name: "Basic", value: 30, revenue: 90000, subscribers: 4560 },
  { name: "Pro", value: 45, revenue: 202500, subscribers: 3800 },
  { name: "Enterprise", value: 25, revenue: 187500, subscribers: 1520 },
]

const financialSummary = [
  { period: "Q4 2024", revenue: "KSh 17,604,600", refunds: "KSh 549,900", net: "KSh 17,054,700", growth: "+12.3%" },
  { period: "Q3 2024", revenue: "KSh 16,684,200", refunds: "KSh 505,700", net: "KSh 16,178,500", growth: "+9.8%" },
  { period: "Q2 2024", revenue: "KSh 15,802,800", refunds: "KSh 462,800", net: "KSh 15,340,000", growth: "+8.5%" },
  { period: "Q1 2024", revenue: "KSh 14,979,900", refunds: "KSh 405,600", net: "KSh 14,574,300", growth: "+7.2%" },
]

const recentTransactions = [
  { date: "2025-01-15", user: "Alice Johnson", amount: "KSh 4,500", status: "Success", plan: "Premium" },
  { date: "2025-01-15", user: "Bob Smith", amount: "KSh 4,500", status: "Success", plan: "Premium" },
  { date: "2025-01-15", user: "Carol Williams", amount: "KSh 4,500", status: "Pending", plan: "Premium" },
  { date: "2025-01-14", user: "David Brown", amount: "KSh 4,500", status: "Success", plan: "Premium" },
  { date: "2025-01-14", user: "Emma Davis", amount: "KSh 4,500", status: "Failed", plan: "Premium" },
]

export function FinancialReports() {
  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Financial Summary</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Generating financial report...")}
            className="glass border-border/50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Refunds</TableHead>
                <TableHead className="text-right">Net Revenue</TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialSummary.map((item) => (
                <TableRow key={item.period}>
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell className="text-right font-semibold">{item.revenue}</TableCell>
                  <TableCell className="text-right text-destructive">{item.refunds}</TableCell>
                  <TableCell className="text-right font-semibold">{item.net}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {item.growth}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Revenue Projections</CardTitle>
            <CardDescription>Actual vs projected revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueProjections}>
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line type="monotone" dataKey="actual" stroke={COLORS.primary} strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Payment Success Rate</CardTitle>
            <CardDescription>Transaction status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentSuccess}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentSuccess.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Refund Trends</CardTitle>
            <CardDescription>Monthly refunds and amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={refundTrends}>
                <defs>
                  <linearGradient id="colorRefunds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.tertiary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.tertiary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="refunds"
                  stroke={COLORS.tertiary}
                  fillOpacity={1}
                  fill="url(#colorRefunds)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Plan Performance</CardTitle>
            <CardDescription>Revenue by subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {planPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx, i) => (
                <TableRow key={i}>
                  <TableCell className="text-foreground-muted">{tx.date}</TableCell>
                  <TableCell className="font-medium">{tx.user}</TableCell>
                  <TableCell className="text-right font-semibold">{tx.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.status === "Success" ? "default" : tx.status === "Pending" ? "secondary" : "outline"}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tx.plan}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
