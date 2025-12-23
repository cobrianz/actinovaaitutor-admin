"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Heart, MessageSquare, Share2, Clock, Loader2, Search, Trash2, Flag, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface BlogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (blog: any) => void
  blog: any
  defaultTab?: string
}

export function BlogDetailModal({ isOpen, onClose, onEdit, blog, defaultTab = "content" }: BlogDetailModalProps) {
  const [fullBlog, setFullBlog] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchFullDetails = async () => {
    if (isOpen && blog?._id) {
      setLoading(true)
      try {
        const response = await fetch(`/api/blogs/${blog._id}`)
        const data = await response.json()
        if (data.blog) {
          setFullBlog(data.blog)
        }
      } catch (error) {
        console.error("Failed to fetch blog details:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const fetchComments = async () => {
    if (isOpen && blog?._id) {
      setCommentsLoading(true)
      const blogId = blog._id.toString()
      try {
        const response = await fetch(`/api/blogs/${blogId}/comments`)
        const data = await response.json()
        if (data.comments) {
          setComments(data.comments)
        }
      } catch (error) {
        console.error(`Failed to fetch comments for blog ${blogId}:`, error)
        toast.error("Failed to load comments")
      } finally {
        setCommentsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchFullDetails()
    fetchComments()
  }, [isOpen, blog])

  const handleUpdateStatus = async (commentId: string, status: string) => {
    try {
      const response = await fetch(`/api/blogs/${blog._id}/comments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, status }),
      })

      if (response.ok) {
        toast.success(`Comment ${status}`)
        fetchComments()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      toast.error("Error updating status")
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blog._id}/comments?commentId=${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Comment deleted")
        fetchComments()
      } else {
        toast.error("Failed to delete comment")
      }
    } catch (error) {
      toast.error("Error deleting comment")
    }
  }

  if (!blog) return null

  const displayBlog = fullBlog || blog
  const stats = displayBlog.stats || {
    views: displayBlog.viewsCount || 0,
    likes: displayBlog.likesCount || 0,
    comments: displayBlog.commentsCount || 0,
    shares: displayBlog.bookmarksCount || 0,
  }

  const filteredComments = comments.filter(comment =>
    (comment.body || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (comment.userId || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border/50">
        <DialogHeader>
          <DialogTitle>Blog Post Details</DialogTitle>
          <DialogDescription>{displayBlog.title}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground-muted">Views</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.views}</p>
                </CardContent>
              </Card>
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground-muted">Likes</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.likes}</p>
                </CardContent>
              </Card>
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground-muted">Comments</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.comments}</p>
                </CardContent>
              </Card>
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Share2 className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground-muted">Shares</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.shares}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass border-border/50">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="meta">Metadata</TabsTrigger>
                <TabsTrigger value="comments" className="relative">
                  Comments
                  {comments.length > 0 && (
                    <Badge variant="secondary" className="ml-2 px-1 h-4 min-w-[1rem]">
                      {comments.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="gradient-primary text-white">
                            {(typeof displayBlog.author === 'string' ? displayBlog.author : displayBlog.author?.name || 'A').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{typeof displayBlog.author === 'string' ? displayBlog.author : displayBlog.author?.name || 'Unknown'}</p>
                          <div className="flex items-center gap-2 text-sm text-foreground-muted">
                            <Clock className="h-3 w-3" />
                            <span>{displayBlog.publishedAt ? new Date(displayBlog.publishedAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={displayBlog.status === "published" ? "default" : "secondary"}>{displayBlog.status || 'Draft'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-foreground-muted leading-relaxed">
                        {displayBlog.content || "No content available."}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="meta" className="space-y-4">
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Post Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground-muted">Category</p>
                        <p className="text-sm">{displayBlog.category || "General"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground-muted">Featured</p>
                        <Badge variant={displayBlog.featured ? "default" : "outline"}>{displayBlog.featured ? "Yes" : "No"}</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground-muted">Summary</p>
                      <p className="text-sm">{displayBlog.summary || displayBlog.excerpt || "No summary provided."}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground-muted">Tags</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {displayBlog.tags && displayBlog.tags.length > 0 ? (
                          displayBlog.tags.map((tag: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-foreground-muted italic">No tags</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                    <Input
                      placeholder="Search comments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 glass border-border/50"
                    />
                  </div>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {commentsLoading ? (
                    <div className="h-40 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredComments.length > 0 ? (
                    filteredComments.map((comment) => (
                      <Card key={comment._id} className="glass border-border/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="gradient-primary text-white text-xs">
                                {(comment.userName || comment.userId || "A").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{comment.userName || comment.userId || "Anonymous"}</span>
                                  <Badge
                                    variant={
                                      (comment.status === "approved" || comment.status === "active") ? "default" :
                                        comment.status === "flagged" ? "destructive" : "secondary"
                                    }
                                    className="text-[10px] h-4"
                                  >
                                    {comment.status === "active" ? "approved" : (comment.status || "pending")}
                                  </Badge>
                                </div>
                                <span className="text-xs text-foreground-muted">
                                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                                </span>
                              </div>

                              <p className="text-sm text-foreground-muted">{comment.body}</p>

                              <div className="flex items-center justify-end gap-1">
                                {comment.status !== 'approved' && comment.status !== 'active' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(comment._id, "approved")}
                                    title="Approve"
                                    className="h-7 w-7 p-0"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                )}
                                {comment.status !== 'flagged' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(comment._id, "flagged")}
                                    title="Flag"
                                    className="h-7 w-7 p-0"
                                  >
                                    <Flag className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteComment(comment._id)}
                                  title="Delete"
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-foreground-muted border border-dashed rounded-lg">
                      {searchQuery ? "No comments match your search." : "No comments yet for this post."}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
                Close
              </Button>
              <Button
                onClick={() => {
                  onEdit(displayBlog)
                  onClose()
                }}
                className="gradient-primary"
              >
                Edit Post
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
