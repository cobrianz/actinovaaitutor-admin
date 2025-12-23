"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useState } from "react"

interface ContactResponseModalProps {
  isOpen: boolean
  onClose: () => void
  contact: any
}

export function ContactResponseModal({ isOpen, onClose, contact }: ContactResponseModalProps) {
  const [response, setResponse] = useState("")
  const [template, setTemplate] = useState("")

  const templates = {
    welcome: "Dear {name},\n\nThank you for reaching out to Actinova AI Tutor. We have received your inquiry regarding \"{subject}\" and our team is currently reviewing the details. You can expect a professional follow-up within 24 hours.\n\nBest regards,\nActinova Support Team",
    resolved: "Dear {name},\n\nWe are pleased to inform you that your inquiry regarding \"{subject}\" has been successfully resolved. We have addressed the points raised in your message and ensured all systems are performing as expected.\n\nPlease let us know if you require any further assistance.\n\nBest regards,\nActinova Support Team",
    investigating: "Dear {name},\n\nThank you for your patience. Your inquiry regarding \"{subject}\" is currently under active investigation by our technical team. We are working diligently to provide a comprehensive resolution and will update you as soon as more information becomes available.\n\nBest regards,\nActinova Support Team",
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/contacts/${contact._id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: contact.subject ? `Re: ${contact.subject}` : undefined,
          message: response
        }),
      })

      if (res.ok) {
        toast.success(`Response sent to ${contact?.name}`)
        onClose()
      } else {
        toast.error("Failed to send response")
      }
    } catch (error) {
      console.error("Error sending response:", error)
      toast.error("Error sending response")
    }
  }

  if (!contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass border-border/50">
        <DialogHeader>
          <DialogTitle>Respond to Contact</DialogTitle>
          <DialogDescription>Send a response to {contact.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact Info */}
          <div className="p-4 rounded-lg glass-subtle space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-foreground-muted">Name:</span>
              <span className="font-medium">{contact.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground-muted">Email:</span>
              <span className="font-medium">{contact.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground-muted">Subject:</span>
              <span className="font-medium">{contact.subject}</span>
            </div>
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <Label>Use Template</Label>
            <Select
              value={template}
              onValueChange={(value) => {
                setTemplate(value)
                let text = templates[value as keyof typeof templates] || ""
                text = text.replace(/{name}/g, contact.name || "Customer")
                text = text.replace(/{subject}/g, contact.subject || "your inquiry")
                setResponse(text)
              }}
            >
              <SelectTrigger className="glass border-border/50">
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Welcome Message</SelectItem>
                <SelectItem value="resolved">Issue Resolved</SelectItem>
                <SelectItem value="investigating">Under Investigation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Response */}
          <div className="space-y-2">
            <Label>Your Response</Label>
            <Textarea
              placeholder="Type your response here..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[200px] glass border-border/50"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gradient-primary">
              Send Response
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
