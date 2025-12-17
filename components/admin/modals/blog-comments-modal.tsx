"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MessageSquare, Trash2, Flag, CheckCircle, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface BlogCommentsModalProps {
  isOpen: boolean
  onClose: () => void
  blog: any
}

export function BlogCommentsModal({ isOpen, onClose, blog }: BlogCommentsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedComment, setSelectedComment] = useState<any>(null)
  const [replyText, setReplyText] = useState("")

  if (!blog) return null

  // Mock comments data
  const mockComments = Array.from({ length: 8 }, (_, i) => ({
    id: `comment-${i + 1}`,
    author: `User ${i + 1}`,
    avatar: `U${i + 1}`,
    content: [
      "Great article! Very informative and well-written.",
      "I learned a lot from this post. Thanks for sharing!",
      "Could you elaborate more on the technical details?",
      "This is exactly what I was looking for. Bookmarked!",
      "Interesting perspective on this topic.",
      "The examples really helped me understand the concept.",
      "Looking forward to more content like this!",
      "This changed how I think about the subject."
    ][i % 8],
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    status: ["approved", "pending", "flagged"][i % 3] as "approved" | "pending" | "flagged",
    likes: Math.floor(Math.random() * 20),
  }))

  const filteredComments = mockComments.filter(comment =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApproveComment = (comment: any) => {
    toast.success("Comment approved")
  }

  const handleRejectComment = (comment: any) => {
    toast.success("Comment rejected")
  }

  const handleDeleteComment = (comment: any) => {
    toast.success("Comment deleted")
  }

  const handleFlagComment = (comment: any) => {
    toast.success("Comment flagged for review")
  }

  const handleReply = () => {
    if (replyText.trim()) {
      toast.success("Reply sent successfully")
      setReplyText("")
      setSelectedComment(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border/50">
        <DialogHeader>
          <DialogTitle>Manage Comments - {blog.title}</DialogTitle>
          <DialogDescription>Review and moderate comments for this blog post</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Stats */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <Input
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 glass border-border/50"
              />
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>{mockComments.filter(c => c.status === 'approved').length} Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>{mockComments.filter(c => c.status === 'pending').length} Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>{mockComments.filter(c => c.status === 'flagged').length} Flagged</span>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gradient-primary text-white text-xs">
                        {comment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author}</span>
                          <Badge
                            variant={
                              comment.status === "approved" ? "default" :
                              comment.status === "pending" ? "secondary" : "destructive"
                            }
                            className="text-xs"
                          >
                            {comment.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-foreground-muted">{comment.date}</span>
                      </div>

                      <p className="text-sm text-foreground-muted">{comment.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-foreground-muted">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {comment.likes} likes
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {comment.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveComment(comment)}
                                className="h-7 px-2"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectComment(comment)}
                                className="h-7 px-2"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFlagComment(comment)}
                            className="h-7 px-2"
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteComment(comment)}
                            className="h-7 px-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Reply Section */}
                      {selectedComment?.id === comment.id && (
                        <div className="mt-3 p-3 rounded-lg glass-subtle space-y-2">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="text-sm"
                            rows={2}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedComment(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleReply}
                              disabled={!replyText.trim()}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
              Close
            </Button>
            <Button className="gradient-primary">
              Bulk Actions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}