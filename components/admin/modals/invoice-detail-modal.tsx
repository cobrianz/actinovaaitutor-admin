"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Send } from "lucide-react"
import { toast } from "sonner"

interface InvoiceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: any
}

export function InvoiceDetailModal({ isOpen, onClose, invoice }: InvoiceDetailModalProps) {
  if (!invoice) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl glass border-border/50">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>Invoice {invoice.invoice}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="flex items-start justify-between p-6 rounded-lg glass-subtle">
            <div>
              <h3 className="text-2xl font-bold mb-2">Actinova AI</h3>
              <p className="text-sm text-foreground-muted">123 Tech Street</p>
              <p className="text-sm text-foreground-muted">San Francisco, CA 94105</p>
              <p className="text-sm text-foreground-muted">support@actinova.ai</p>
            </div>
            <div className="text-right">
              <Badge variant={invoice.status === "paid" ? "default" : "secondary"} className="mb-2">
                {invoice.status}
              </Badge>
              <p className="text-sm text-foreground-muted">Invoice: {invoice.invoice}</p>
              <p className="text-sm text-foreground-muted">Date: {invoice.date}</p>
              <p className="text-sm text-foreground-muted">Due: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="space-y-2">
            <h4 className="font-semibold">Bill To:</h4>
            <div className="p-4 rounded-lg glass-subtle">
              <p className="font-medium">{invoice.customer}</p>
              <p className="text-sm text-foreground-muted">customer@example.com</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h4 className="font-semibold">Items:</h4>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="glass-subtle">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Description</th>
                    <th className="text-right p-3 text-sm font-medium">Quantity</th>
                    <th className="text-right p-3 text-sm font-medium">Rate</th>
                    <th className="text-right p-3 text-sm font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3">{invoice.plan} Subscription</td>
                    <td className="text-right p-3">1</td>
                    <td className="text-right p-3">${invoice.amount}</td>
                    <td className="text-right p-3 font-medium">${invoice.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Subtotal:</span>
              <span className="font-medium">${invoice.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Tax (10%):</span>
              <span className="font-medium">${(invoice.amount * 0.1).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">${(invoice.amount * 1.1).toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => toast.success("Invoice downloaded")}
              className="glass border-border/50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={() => toast.success("Invoice sent")} className="gradient-primary">
              <Send className="h-4 w-4 mr-2" />
              Email Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
