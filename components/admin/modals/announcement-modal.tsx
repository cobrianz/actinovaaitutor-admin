"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Send, Megaphone, Users, Clock, AlertCircle, Loader2 } from "lucide-react"

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AnnouncementModal({ isOpen, onClose }: AnnouncementModalProps) {
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    priority: 'normal',
    scheduled: false,
    scheduleDate: '',
    scheduleTime: '',
    sendEmail: true,
    sendPush: false,
  })

  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!announcement.title.trim() || !announcement.message.trim()) {
      toast.error('Please fill in both title and message')
      return
    }

    try {
      setSending(true)
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement)
      })

      if (!response.ok) throw new Error('Failed to send announcement')

      toast.success('Announcement sent successfully!')
      onClose()

      // Reset form
      setAnnouncement({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
        priority: 'normal',
        scheduled: false,
        scheduleDate: '',
        scheduleTime: '',
        sendEmail: true,
        sendPush: false,
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to send announcement')
    } finally {
      setSending(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setAnnouncement(prev => ({ ...prev, [field]: value }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Send Announcement
          </DialogTitle>
          <DialogDescription>
            Send a system-wide announcement to users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Announcement Title</Label>
              <Input
                id="title"
                placeholder="Enter announcement title..."
                value={announcement.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your announcement message..."
                rows={4}
                value={announcement.message}
                onChange={(e) => updateField('message', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Announcement Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={announcement.type} onValueChange={(value) => updateField('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">
                    <div className="flex items-center gap-2">
                      <span>ℹ️</span>
                      Information
                    </div>
                  </SelectItem>
                  <SelectItem value="success">
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      Success
                    </div>
                  </SelectItem>
                  <SelectItem value="warning">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      Warning
                    </div>
                  </SelectItem>
                  <SelectItem value="error">
                    <div className="flex items-center gap-2">
                      <span>❌</span>
                      Error
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={announcement.priority} onValueChange={(value) => updateField('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Select value={announcement.targetAudience} onValueChange={(value) => updateField('targetAudience', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Users Only</SelectItem>
                <SelectItem value="premium">Premium Users</SelectItem>
                <SelectItem value="free">Free Users</SelectItem>
                <SelectItem value="inactive">Inactive Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Delivery Options */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Send className="h-4 w-4" />
              Delivery Options
            </h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Send via Email</Label>
                <p className="text-sm text-muted-foreground">Send announcement via email</p>
              </div>
              <Switch
                checked={announcement.sendEmail}
                onCheckedChange={(checked) => updateField('sendEmail', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Send Push Notification</Label>
                <p className="text-sm text-muted-foreground">Send browser push notification</p>
              </div>
              <Switch
                checked={announcement.sendPush}
                onCheckedChange={(checked) => updateField('sendPush', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Scheduling */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Schedule for Later
                </Label>
                <p className="text-sm text-muted-foreground">Send announcement at a specific time</p>
              </div>
              <Switch
                checked={announcement.scheduled}
                onCheckedChange={(checked) => updateField('scheduled', checked)}
              />
            </div>

            {announcement.scheduled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleDate">Date</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={announcement.scheduleDate}
                    onChange={(e) => updateField('scheduleDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduleTime">Time</Label>
                  <Input
                    id="scheduleTime"
                    type="time"
                    value={announcement.scheduleTime}
                    onChange={(e) => updateField('scheduleTime', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className={`p-4 rounded-lg border-2 ${getTypeColor(announcement.type)}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{getTypeIcon(announcement.type)}</span>
                <div className="flex-1">
                  <h4 className="font-semibold">{announcement.title || 'Announcement Title'}</h4>
                  <p className="text-sm mt-1">{announcement.message || 'Announcement message will appear here...'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {announcement.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {announcement.targetAudience}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending} className="gradient-primary">
            {sending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {announcement.scheduled ? 'Schedule Announcement' : 'Send Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}