"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Eye, BarChart3, Star } from "lucide-react"
import { demoCourses } from "@/lib/demo-data"
import { toast } from "sonner"
import { CourseDetailModal } from "@/components/admin/modals/course-detail-modal"
import { CourseModal } from "@/components/admin/modals/course-modal"
import { CourseAnalyticsModal } from "@/components/admin/modals/course-analytics-modal"
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal"

export function CourseLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal states
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [isCourseDetailModalOpen, setIsCourseDetailModalOpen] = useState(false)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [isCourseAnalyticsModalOpen, setIsCourseAnalyticsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const filteredCourses = demoCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.creator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || course.difficulty === difficultyFilter
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    return matchesSearch && matchesDifficulty && matchesStatus
  })

  const handleViewCourse = (course: any) => {
    setSelectedCourse(course)
    setIsCourseDetailModalOpen(true)
  }

  const handleViewAnalytics = (course: any) => {
    setSelectedCourse(course)
    setIsCourseAnalyticsModalOpen(true)
  }

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course)
    setIsCourseModalOpen(true)
  }

  const handleDeleteCourse = (course: any) => {
    setSelectedCourse(course)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCourse = (courseData: any) => {
    toast.success(`Course ${selectedCourse ? 'updated' : 'created'} successfully`)
  }

  const handleConfirmDelete = () => {
    toast.success(`${selectedCourse?.title} deleted successfully`)
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Course Catalog</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass border-border/50"
            />
          </div>

          {/* Filters */}
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[150px] glass border-border/50">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] glass border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Modules</TableHead>
              <TableHead className="text-right">Enrollments</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.slice(0, 10).map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell className="text-foreground-muted">{course.creator}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      course.difficulty === "Beginner"
                        ? "default"
                        : course.difficulty === "Intermediate"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {course.difficulty}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-foreground-muted">{course.modules}</TableCell>
                <TableCell className="text-right text-foreground-muted">{course.enrollments}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      course.status === "Published" ? "default" : course.status === "Draft" ? "secondary" : "outline"
                    }
                  >
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewCourse(course)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewAnalytics(course)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteCourse(course)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Info */}
        <div className="flex items-center justify-between mt-4 text-sm text-foreground-muted">
          <span>
            Showing {Math.min(10, filteredCourses.length)} of {filteredCourses.length} courses
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="glass border-border/50 bg-transparent">
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filteredCourses.length <= 10}
              className="glass border-border/50 bg-transparent"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Modals */}
      <CourseDetailModal
        isOpen={isCourseDetailModalOpen}
        onClose={() => setIsCourseDetailModalOpen(false)}
        course={selectedCourse}
      />
      <CourseModal
        open={isCourseModalOpen}
        onOpenChange={setIsCourseModalOpen}
        course={selectedCourse}
        onSave={handleSaveCourse}
      />
      <CourseAnalyticsModal
        isOpen={isCourseAnalyticsModalOpen}
        onClose={() => setIsCourseAnalyticsModalOpen(false)}
        course={selectedCourse}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Course"
        description={`Are you sure you want to delete "${selectedCourse?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
