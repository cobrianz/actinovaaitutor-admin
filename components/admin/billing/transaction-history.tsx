"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Download, Eye, RefreshCw } from "lucide-react"
import { TransactionDetailModal } from "@/components/admin/modals/transaction-detail-modal"
import { toast } from "sonner"

export function TransactionHistory() {
  const [search, setSearch] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: "10",
        search: search
      })
      const response = await fetch(`/api/billing/transactions?${params}`)
      const data = await response.json()
      if (data.transactions) {
        setTransactions(data.transactions)
        setPagination({
          page: data.page,
          totalPages: data.totalPages
        })
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      toast.error("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, pagination.page])

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
            {loading ? (
              <div className="text-center py-8 text-foreground-muted">Loading transactions...</div>
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id || Math.random()}
                  className="flex items-center justify-between p-3 rounded-lg glass-subtle hover:bg-background-subtle transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.user || 'Unknown User'}</p>
                      <Badge
                        variant={
                          transaction.status === "paid" || transaction.status === "success" || transaction.status === "completed"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs capitalize"
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
                    <p className="font-semibold">KSh {transaction.amount?.toLocaleString()}</p>
                    <p className="text-xs text-foreground-muted">{transaction.plan}</p>
                    <p className="text-xs text-foreground-muted">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleView(transaction)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(transaction.status === "failed") && (
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-foreground-muted">No transactions found</div>
            )}
          </div>

          {/* Simple Pagination Controls */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page <= 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-foreground-muted">Page {pagination.page} of {pagination.totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              Next
            </Button>
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
