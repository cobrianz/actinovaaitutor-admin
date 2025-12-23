"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Calendar, MessageSquare, User } from "lucide-react"
import type { Contact } from "@/lib/types"

interface ContactDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  onStatusChange: (status: Contact["status"]) => void
}

export function ContactDetailModal({ open, onOpenChange, contact, onStatusChange }: ContactDetailModalProps) {
  if (!contact) return null

  const statusColors: Record<string, string> = {
    "new": "bg-blue-500/10 text-blue-500",
    "in-progress": "bg-yellow-500/10 text-yellow-500",
    "resolved": "bg-green-500/10 text-green-500",
    "closed": "bg-gray-500/10 text-gray-500",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{contact.name}</DialogTitle>
              <DialogDescription className="text-sm mt-1">{contact.subject}</DialogDescription>
            </div>
            <Badge className={statusColors[contact.status] || "bg-gray-500/10 text-gray-500"}>{contact.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{contact.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Received:</span>
              <span className="font-medium">{new Date(contact.createdAt).toLocaleDateString()}</span>
            </div>
            {contact.category && (
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline">{contact.category}</Badge>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Message</Label>
            <div className="glass p-4 rounded-lg text-sm whitespace-pre-wrap">{contact.message}</div>
          </div>

          {contact.adminNotes && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Admin Logs</Label>
              <div className="glass p-4 rounded-lg text-sm whitespace-pre-wrap font-mono bg-black/5">{contact.adminNotes}</div>
            </div>
          )}

        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={() => onStatusChange("in-progress")}>
            Mark In Progress
          </Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => onStatusChange("resolved")}>
            Mark Resolved
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
