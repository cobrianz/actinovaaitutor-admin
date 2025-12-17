"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Heart, MessageSquare, Share2, Clock } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface BlogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  blog: any
}

export function BlogDetailModal({ isOpen, onClose, blog }: BlogDetailModalProps) {
  if (!blog) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border/50">
        <DialogHeader>
          <DialogTitle>Blog Post Details</DialogTitle>
          <DialogDescription>{blog.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Views</span>
                </div>
                <p className="text-2xl font-bold">{blog.views}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Likes</span>
                </div>
                <p className="text-2xl font-bold">{blog.likes}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Comments</span>
                </div>
                <p className="text-2xl font-bold">{blog.comments}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Shares</span>
                </div>
                <p className="text-2xl font-bold">145</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass border-border/50">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="gradient-primary text-white">{blog.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{blog.author}</p>
                        <div className="flex items-center gap-2 text-sm text-foreground-muted">
                          <Clock className="h-3 w-3" />
                          <span>{blog.date}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={blog.status === "Published" ? "default" : "secondary"}>{blog.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground-muted leading-relaxed">
                      This is a comprehensive guide to understanding modern AI tutoring systems. The article covers the
                      latest developments in educational technology, machine learning algorithms, and how they're being
                      applied to create personalized learning experiences.
                    </p>
                    <p className="text-foreground-muted leading-relaxed mt-4">
                      We explore various case studies, implementation strategies, and best practices for integrating AI
                      into educational platforms.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="glass border-border/50">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">User {i}</p>
                          <span className="text-xs text-foreground-muted">{i}d ago</span>
                        </div>
                        <p className="text-sm text-foreground-muted">
                          Great article! Very informative and well-written. Looking forward to more content like this.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-foreground-muted">
                          <button className="hover:text-primary transition-colors">Like</button>
                          <button className="hover:text-primary transition-colors">Reply</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Engagement Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Week 1</span>
                        <span className="text-foreground-muted">2,340 views</span>
                      </div>
                      <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                        <div className="h-full gradient-primary" style={{ width: "90%" }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Week 2</span>
                        <span className="text-foreground-muted">1,890 views</span>
                      </div>
                      <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                        <div className="h-full gradient-primary" style={{ width: "73%" }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Week 3</span>
                        <span className="text-foreground-muted">1,420 views</span>
                      </div>
                      <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                        <div className="h-full gradient-primary" style={{ width: "55%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
              Close
            </Button>
            <Button className="gradient-primary">Edit Post</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
