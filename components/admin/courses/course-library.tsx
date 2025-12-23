"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Search, MoreHorizontal, Edit, Trash2, Eye, BarChart3, Star, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { CourseDetailModal } from "@/components/admin/modals/course-detail-modal"
import { CourseModal } from "@/components/admin/modals/course-modal"
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal"
import type { Course } from "@/lib/types"

export function CourseLibrary() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Pagination - separate for each tab
  const [officialPage, setOfficialPage] = useState(1)
  const [libraryPage, setLibraryPage] = useState(1)
  const [trendingPage, setTrendingPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)

  // Modal states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isCourseDetailModalOpen, setIsCourseDetailModalOpen] = useState(false)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch all courses without pagination (we'll paginate client-side per tab)
      const params = new URLSearchParams({
        search: searchQuery,
        difficulty: difficultyFilter,
        status: statusFilter,
        limit: "1000", // Fetch all courses
      })
      const response = await fetch(`/api/courses?${params}`)
      const data = await response.json()
      if (data.courses) {
        setCourses(data.courses)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, difficultyFilter, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchCourses])

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsCourseDetailModalOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsCourseModalOpen(true)
  }

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCourse = async (courseData: any) => {
    toast.success(`Course ${selectedCourse ? 'updated' : 'created'} successfully`)
    fetchCourses()
  }

  const handleConfirmDelete = async () => {
    toast.success(`${selectedCourse?.title} deleted successfully`)
    fetchCourses()
  }

  const totalPages = Math.ceil(total / limit)

  const [activeTab, setActiveTab] = useState<"official" | "library" | "trending">("official")

  // Note: Tab is called "library" but source field is "community" in the database
  const officialCourses = courses.filter(c => (c as any).source === "official")
  const libraryCourses = courses.filter(c => (c as any).source === "community")
  const trendingCourses = courses.filter(c => (c as any).source === "trending")

  // Paginate each tab's data
  const getPaginatedData = (data: Course[], page: number) => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return data.slice(startIndex, endIndex)
  }

  const renderTable = (data: Course[], type: string, currentPage: number, setPage: (page: number) => void) => {
    const paginatedData = getPaginatedData(data, currentPage)
    const totalPages = Math.ceil(data.length / limit)

    return (
      <div className="space-y-4">
        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-sm rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>{type === "library" ? "Creator (User)" : "Creator"}</TableHead>
                <TableHead>Difficulty</TableHead>
                {type === "official" && <TableHead className="text-right">Modules</TableHead>}
                {type !== "trending" && <TableHead className="text-right">Rating</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{course.title}</TableCell>
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
                    {type === "official" && <TableCell className="text-right text-foreground-muted">{course.modules?.length || 0}</TableCell>}
                    {type !== "trending" && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-sm font-medium">{course.stats?.avgRating || 0}</span>
                        </div>
                      </TableCell>
                    )}
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
                ))
              ) : !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-foreground-muted">
                    No courses found in this category
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination for this tab */}
        <div className="flex items-center justify-between text-sm text-foreground-muted">
          <span>
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, data.length)} of {data.length} courses
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="glass border-border/50 bg-transparent"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="glass border-border/50 bg-transparent"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Course Catalog</CardTitle>
          <div className="flex items-center gap-1 p-1 bg-muted/20 backdrop-blur-md rounded-lg border border-border/50">
            <Button
              variant={activeTab === "official" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("official")}
              className="rounded-md px-3"
            >
              Official
            </Button>
            <Button
              variant={activeTab === "library" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("library")}
              className="rounded-md px-3"
            >
              Library
            </Button>
            <Button
              variant={activeTab === "trending" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("trending")}
              className="rounded-md px-3">
              Trending
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setOfficialPage(1)
                setLibraryPage(1)
                setTrendingPage(1)
              }}
              className="pl-9 glass border-border/50"
            />
          </div>

          <Select value={difficultyFilter} onValueChange={(val) => { setDifficultyFilter(val); setOfficialPage(1); setLibraryPage(1); setTrendingPage(1); }}>
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
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "official" && renderTable(officialCourses, "official", officialPage, setOfficialPage)}
        {activeTab === "library" && renderTable(libraryCourses, "library", libraryPage, setLibraryPage)}
        {activeTab === "trending" && renderTable(trendingCourses, "trending", trendingPage, setTrendingPage)}
      </CardContent>

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

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        description={`Are you sure you want to delete "${selectedCourse?.title}"? This action cannot be undone.`}
      />
    </Card>
  )
}
