"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface BulkActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  actions: { label: string; value: string }[]
  onConfirm: (action: string) => void
}

export function BulkActionModal({ open, onOpenChange, selectedCount, actions, onConfirm }: BulkActionModalProps) {
  const [selectedAction, setSelectedAction] = useState("")

  const handleConfirm = () => {
    if (selectedAction) {
      onConfirm(selectedAction)
      onOpenChange(false)
      setSelectedAction("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-gradient">Bulk Action</DialogTitle>
          <DialogDescription>
            Apply an action to {selectedCount} selected item{selectedCount !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="action">Select Action</Label>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Choose an action..." />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="gradient-primary text-primary-foreground"
            onClick={handleConfirm}
            disabled={!selectedAction}
          >
            Apply to {selectedCount} Item{selectedCount !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
