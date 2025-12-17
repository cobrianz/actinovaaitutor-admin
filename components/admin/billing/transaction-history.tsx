"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Download, Eye, RefreshCw } from "lucide-react"
import { TransactionDetailModal } from "@/components/admin/modals/transaction-detail-modal"

const transactions = [
  {
    id: "TXN-2024-001",
    user: "John Doe",
    email: "john@example.com",
    amount: 39.99,
    plan: "Pro",
    status: "completed",
    method: "Credit Card",
    date: "2024-01-15",
  },
  {
    id: "TXN-2024-002",
    user: "Jane Smith",
    email: "jane@example.com",
    amount: 19.99,
    plan: "Basic",
    status: "completed",
    method: "PayPal",
    date: "2024-01-15",
  },
  {
    id: "TXN-2024-003",
    user: "Mike Johnson",
    email: "mike@example.com",
    amount: 99.99,
    plan: "Enterprise",
    status: "pending",
    method: "Wire Transfer",
    date: "2024-01-14",
  },
  {
    id: "TXN-2024-004",
    user: "Sarah Williams",
    email: "sarah@example.com",
    amount: 39.99,
    plan: "Pro",
    status: "failed",
    method: "Credit Card",
    date: "2024-01-14",
  },
]

export function TransactionHistory() {
  const [search, setSearch] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleView = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent payment transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg glass-subtle hover:bg-background-subtle transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{transaction.user}</p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground-muted">{transaction.email}</p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {transaction.id} • {transaction.method}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-semibold">${transaction.amount}</p>
                  <p className="text-xs text-foreground-muted">{transaction.plan}</p>
                  <p className="text-xs text-foreground-muted">{transaction.date}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleView(transaction)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {transaction.status === "failed" && (
                    <Button variant="ghost" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  )
}
