import { CourseLibrary } from "@/components/admin/courses/course-library"
import { CourseAnalyticsCharts } from "@/components/admin/courses/course-analytics-charts"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Course Management - Actinova Admin",
  description: "Manage courses, view analytics, and track performance",
}

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Course Management</h1>
          <p className="text-foreground-muted mt-1">Manage courses, track enrollments, and analyze performance</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <CourseAnalyticsCharts />

      {/* Course Library */}
      <CourseLibrary />
    </div>
  )
}
