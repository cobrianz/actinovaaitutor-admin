"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Send, Eye } from "lucide-react"
import { useState } from "react"
import { InvoiceDetailModal } from "@/components/admin/modals/invoice-detail-modal"
import { toast } from "sonner"
import jsPDF from 'jspdf'

const invoices = [
  {
    id: "INV-2024-001",
    customer: "John Doe",
    amount: 39.99,
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
  },
  {
    id: "INV-2024-002",
    customer: "Jane Smith",
    amount: 19.99,
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
  },
  {
    id: "INV-2024-003",
    customer: "Mike Johnson",
    amount: 99.99,
    date: "2024-01-14",
    dueDate: "2024-02-14",
    status: "pending",
  },
  {
    id: "INV-2024-004",
    customer: "Sarah Williams",
    amount: 39.99,
    date: "2024-01-14",
    dueDate: "2024-02-14",
    status: "overdue",
  },
]

export function InvoiceManagement() {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsInvoiceModalOpen(true)
  }

  const handleDownloadInvoice = (invoice: any) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text('INVOICE', 105, 20, { align: 'center' })

    // Company info
    doc.setFontSize(12)
    doc.text('Actinova AI Tutor', 20, 40)
    doc.text('123 Education Street', 20, 50)
    doc.text('Tech City, TC 12345', 20, 60)
    doc.text('contact@actinova.ai', 20, 70)

    // Invoice details
    doc.text(`Invoice ID: ${invoice.id}`, 140, 40)
    doc.text(`Date: ${invoice.date}`, 140, 50)
    doc.text(`Due Date: ${invoice.dueDate}`, 140, 60)
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 140, 70)

    // Customer info
    doc.text('Bill To:', 20, 90)
    doc.text(invoice.customer, 20, 100)
    doc.text('Customer', 20, 110)

    // Table header
    doc.setFontSize(14)
    doc.text('Description', 20, 140)
    doc.text('Amount', 160, 140)

    // Table content
    doc.setFontSize(12)
    doc.text('AI Tutor Subscription', 20, 160)
    doc.text(`$${invoice.amount}`, 160, 160)

    // Total
    doc.setFontSize(14)
    doc.text('Total:', 130, 190)
    doc.text(`$${invoice.amount}`, 160, 190)

    // Footer
    doc.setFontSize(10)
    doc.text('Thank you for your business!', 105, 250, { align: 'center' })
    doc.text('Payment terms: Net 30 days', 105, 260, { align: 'center' })

    // Save the PDF
    doc.save(`invoice-${invoice.id}.pdf`)
    toast.success(`Invoice ${invoice.id} downloaded successfully`)
  }

  const handleSendInvoice = (invoice: any) => {
    toast.success(`Sending invoice ${invoice.id} to ${invoice.customer}`)
  }

  const handleExportAll = () => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text('INVOICE SUMMARY REPORT', 105, 20, { align: 'center' })

    // Company info
    doc.setFontSize(12)
    doc.text('Actinova AI Tutor', 20, 40)
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 50)

    // Table header
    doc.setFontSize(14)
    doc.text('Invoice ID', 20, 80)
    doc.text('Customer', 60, 80)
    doc.text('Amount', 120, 80)
    doc.text('Status', 160, 80)

    // Table content
    doc.setFontSize(10)
    let yPosition = 90
    invoices.forEach((invoice, index) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      doc.text(invoice.id, 20, yPosition)
      doc.text(invoice.customer, 60, yPosition)
      doc.text(`$${invoice.amount}`, 120, yPosition)
      doc.text(invoice.status.toUpperCase(), 160, yPosition)
      yPosition += 10
    })

    // Summary
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
    doc.setFontSize(12)
    doc.text(`Total Invoices: ${invoices.length}`, 20, yPosition + 20)
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, yPosition + 30)

    // Save the PDF
    doc.save(`invoice-summary-${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success("Invoice summary exported successfully")
  }

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoice Management</CardTitle>
            <CardDescription>Manage and track invoices</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-3 rounded-lg glass-subtle hover:bg-background-subtle transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{invoice.id}</p>
                  <Badge
                    variant={
                      invoice.status === "paid" ? "default" : invoice.status === "pending" ? "secondary" : "destructive"
                    }
                    className="text-xs"
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <p className="text-sm text-foreground-muted">{invoice.customer}</p>
                <p className="text-xs text-foreground-muted mt-1">Due: {invoice.dueDate}</p>
              </div>
              <div className="text-right mr-4">
                <p className="font-semibold">${invoice.amount}</p>
                <p className="text-xs text-foreground-muted">{invoice.date}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleViewInvoice(invoice)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(invoice)}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleSendInvoice(invoice)}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Modals */}
      <InvoiceDetailModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={selectedInvoice}
      />
    </Card>
  )
}
