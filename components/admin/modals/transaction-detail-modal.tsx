"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface TransactionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  transaction?: any
}

export function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  if (!transaction) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>View complete transaction information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 rounded-lg glass-subtle">
            <div>
              <p className="text-sm text-foreground-muted">Status</p>
              <Badge
                variant={
                  transaction.status === "completed"
                    ? "default"
                    : transaction.status === "pending"
                      ? "secondary"
                      : "destructive"
                }
                className="mt-1"
              >
                {transaction.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground-muted">Transaction ID</p>
              <p className="font-mono text-sm font-medium mt-1">{transaction.id}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="space-y-3 p-4 rounded-lg glass-subtle">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Name</span>
                <span className="font-medium">{transaction.user}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-foreground-muted">Email</span>
                <span className="font-medium">{transaction.email}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-foreground-muted">Subscription Plan</span>
                <span className="font-medium">{transaction.plan}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold mb-3">Payment Information</h3>
            <div className="space-y-3 p-4 rounded-lg glass-subtle">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Amount</span>
                <span className="text-2xl font-bold">${transaction.amount}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-foreground-muted">Payment Method</span>
                <span className="font-medium">{transaction.method}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-foreground-muted">Transaction Date</span>
                <span className="font-medium">{transaction.date}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {/* Actions */}
          <div className="flex gap-3 justify-end">
            {transaction.status === "failed" && (
              <Button className="gradient-primary flex-1 sm:flex-none">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Payment
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
