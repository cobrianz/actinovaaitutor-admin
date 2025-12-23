"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Eye, BarChart3 } from "lucide-react"
import { toast } from "sonner"
import { QuizDetailModal } from "@/components/admin/modals/quiz-detail-modal"
import { QuizModal } from "@/components/admin/modals/quiz-modal"
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal"

const demoQuizzes = Array.from({ length: 15 }, (_, i) => ({
  id: `quiz-${i + 1}`,
  title: [
    "JavaScript Fundamentals Quiz",
    "React Advanced Concepts",
    "Python Data Structures",
    "SQL Query Mastery",
    "ML Algorithms Test",
  ][i % 5],
  course: ["Web Development", "Frontend Mastery", "Python Programming", "Database Systems", "Machine Learning"][i % 5],
  questions: Math.floor(Math.random() * 30) + 10,
  attempts: Math.floor(Math.random() * 500) + 100,
  avgScore: Math.floor(Math.random() * 30) + 65,
  passRate: Math.floor(Math.random() * 30) + 60,
}))

export function QuizManagement() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  // Modal states
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [isQuizDetailModalOpen, setIsQuizDetailModalOpen] = useState(false)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/tests?${params}`)
      const data = await response.json()
      if (data.tests) {
        setQuizzes(data.tests)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error)
      toast.error("Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuizzes()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, page])

  const handleViewQuiz = (quiz: any) => {
    setSelectedQuiz(quiz)
    setIsQuizDetailModalOpen(true)
  }

  const handleEditQuiz = (quiz: any) => {
    setSelectedQuiz(quiz)
    setIsQuizModalOpen(true)
  }

  const handleDeleteQuiz = (quiz: any) => {
    setSelectedQuiz(quiz)
    setIsDeleteModalOpen(true)
  }

  const handleSaveQuiz = async (quizData: any) => {
    try {
      const isEdit = !!quizData._id
      const url = isEdit ? `/api/tests/${quizData._id}` : "/api/tests"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      })

      if (!response.ok) throw new Error("Failed to save quiz")

      toast.success(`Quiz ${isEdit ? 'updated' : 'created'} successfully`)
      fetchQuizzes()
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast.error("Failed to save quiz")
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/tests/${selectedQuiz._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Quiz deleted successfully")
        fetchQuizzes()
      } else {
        toast.error("Failed to delete quiz")
      }
    } catch (error) {
      toast.error("Error deleting quiz")
    }
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Quiz List</CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-9 glass border-border/50"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Questions</TableHead>
              <TableHead className="text-right">Difficulty</TableHead>
              <TableHead className="text-right">Creator</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <TableRow key={quiz._id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{quiz.course || "General"}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-foreground-muted">{quiz.questionCount || quiz.questions?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{quiz.difficulty || "Beginner"}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-foreground-muted">{quiz.creator || "Unknown"}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewQuiz(quiz)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Quiz
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditQuiz(quiz)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Quiz
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteQuiz(quiz)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-foreground-muted">
                  No quizzes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Modals */}
      <QuizDetailModal
        isOpen={isQuizDetailModalOpen}
        onClose={() => setIsQuizDetailModalOpen(false)}
        quiz={selectedQuiz}
      />
      <QuizModal
        open={isQuizModalOpen}
        onOpenChange={setIsQuizModalOpen}
        quiz={selectedQuiz}
        onSave={handleSaveQuiz}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Quiz"
        description={`Are you sure you want to delete "${selectedQuiz?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
