import { QuizManagement } from "@/components/admin/tests/quiz-management"
import { QuizAnalytics } from "@/components/admin/tests/quiz-analytics"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tests & Quizzes - Actinova Admin",
  description: "Manage tests, quizzes, and performance analytics",
}

export default function TestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Tests & Quizzes Management</h1>
          <p className="text-foreground-muted mt-1">Manage quizzes, analyze performance, and track completion rates</p>
        </div>
      </div>

      <QuizAnalytics />
      <QuizManagement />
    </div>
  )
}
