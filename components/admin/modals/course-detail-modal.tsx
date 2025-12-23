"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, BookOpen, Clock } from "lucide-react"

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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Rating</p>
                  <p className="font-semibold">{course.stats?.avgRating || 0}/5.0</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Modules</p>
                  <p className="font-semibold">{course.modules?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-foreground-muted">Category</p>
                  <p className="font-semibold">{course.category}</p>
                </div>
              </div>
            </div>

            {course.description && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-foreground-muted">{course.description}</p>
              </div>
            )}
          </div>

          {/* Modules Section */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.modules?.length > 0 ? (
                course.modules.map((module: any, i: number) => (
                  <div key={module.id || i} className="p-4 rounded-lg glass-subtle hover:bg-background-subtle transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-medium">{module.title}</p>
                          <p className="text-sm text-foreground-muted">{module.resources?.length || 0} lessons</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-foreground-muted">No modules listed for this course.</div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
