"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Loader2 } from "lucide-react"
import type { Course } from "@/lib/types"

export function TopCoursesTable() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopCourses() {
      try {
        // Fetch courses sorted by enrollments (handled by sorting in-place for now as the API returns all)
        const response = await fetch("/api/courses?limit=20")
        const data = await response.json()
        if (data.courses) {
          const sorted = [...data.courses].sort((a, b) =>
            (b.stats?.avgRating || 0) - (a.stats?.avgRating || 0)
          )
          setCourses(sorted.slice(0, 5))
        }
      } catch (error) {
        console.error("Failed to fetch top courses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTopCourses()
  }, [])

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Top Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead className="text-right">Difficulty</TableHead>
                <TableHead className="text-right">Category</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium truncate max-w-[200px]">{course.title}</TableCell>
                    <TableCell className="text-right text-foreground-muted">
                      {course.difficulty}
                    </TableCell>
                    <TableCell className="text-right text-foreground-muted">
                      {course.category}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-sm font-medium">{course.stats?.avgRating || 0}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-foreground-muted">
                    No top courses
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
