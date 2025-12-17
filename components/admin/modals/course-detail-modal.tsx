"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Star, BookOpen, Clock, TrendingUp, Award } from "lucide-react"

interface CourseDetailModalProps {
  isOpen: boolean
  onClose: () => void
  course: any
}

export function CourseDetailModal({ isOpen, onClose, course }: CourseDetailModalProps) {
  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border/50">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
          <DialogDescription>Complete information about {course.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Header */}
          <div className="p-6 rounded-lg glass-subtle space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{course.title}</h3>
                <p className="text-foreground-muted">Created by {course.creator}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{course.difficulty}</Badge>
                <Badge variant={course.status === "Published" ? "default" : "secondary"}>{course.status}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Enrolled</p>
                  <p className="font-semibold">{course.enrollments}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Rating</p>
                  <p className="font-semibold">{course.rating}/5.0</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Modules</p>
                  <p className="font-semibold">{course.modules}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Duration</p>
                  <p className="font-semibold">12h 30m</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass border-border/50">
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 rounded-lg glass-subtle hover:bg-background-subtle transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                        {i}
                      </div>
                      <div>
                        <p className="font-medium">Module {i}: Advanced Concepts</p>
                        <p className="text-sm text-foreground-muted">5 lessons • 45 minutes</p>
                      </div>
                    </div>
                    <Badge variant="outline">85% completion</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="students" className="space-y-3">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Top Performing Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg glass-subtle">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Student {i}</p>
                            <p className="text-sm text-foreground-muted">student{i}@example.com</p>
                          </div>
                        </div>
                        <Badge variant="default">{100 - i * 5}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground-muted">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div className="text-2xl font-bold">78%</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground-muted">Avg. Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div className="text-2xl font-bold">64%</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground-muted">Active Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div className="text-2xl font-bold">342</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-3">
              {[5, 4, 5, 4].map((rating, i) => (
                <div key={i} className="p-4 rounded-lg glass-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Student {i + 1}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    Excellent course! The content is well-structured and easy to follow.
                  </p>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
              Close
            </Button>
            <Button className="gradient-primary">Edit Course</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
