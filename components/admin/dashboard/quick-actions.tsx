"use client"

import { Button } from "@/components/ui/button"
import { Download, Bell, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface QuickActionsProps {
  onRefresh?: () => void
  onExport?: () => void
}

export function QuickActions({ onRefresh, onExport }: QuickActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onRefresh?.()
          toast.success("Dashboard data refreshed")
        }}
        className="glass border-border/50"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onExport?.()
          toast.info("Exporting dashboard data...")
        }}
        className="glass border-border/50"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  )
}
