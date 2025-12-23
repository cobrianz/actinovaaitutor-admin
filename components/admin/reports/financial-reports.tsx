"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, RefreshCw, Loader2 } from "lucide-react"
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

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]

export function FinancialReports() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchReports = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const response = await fetch("/api/billing/reports", { cache: "no-store" })
      const result = await response.json()
      if (result) {
        setData(result)
      }
    } catch (error) {
      console.error("Failed to fetch financial reports:", error)
      toast.error("Failed to load financial reports")
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleExport = () => {
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Financial report exported successfully")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-muted">No financial data available</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchReports(true)}
          className="glass-card border-border/50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="glass-card border-border/50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Financial Summary */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Quarterly Financial Summary</CardTitle>
          <CardDescription>Revenue, refunds, and net income by quarter</CardDescription>
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
              {(data.quarters || []).map((item: any, index: number) => {
                const prevNet = data.quarters[index + 1]?.net || item.net
                const growth = prevNet > 0 ? (((item.net - prevNet) / prevNet) * 100).toFixed(1) : "0.0"

                return (
                  <TableRow key={item.period}>
                    <TableCell className="font-medium">{item.period}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.revenue)}</TableCell>
                    <TableCell className="text-right text-destructive">{formatCurrency(item.refunds)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.net)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={parseFloat(growth) >= 0 ? "default" : "destructive"}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {growth >= 0 ? '+' : ''}{growth}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trends over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyRevenue || []}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Payment Success Rate</CardTitle>
            <CardDescription>Transaction status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.paymentSuccess || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(data.paymentSuccess || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payment activities</CardDescription>
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
              {(data.recentTransactions || []).map((tx: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="text-foreground-muted">{tx.date}</TableCell>
                  <TableCell className="font-medium">{tx.user}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(tx.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "success" || tx.status === "completed"
                          ? "default"
                          : tx.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
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
