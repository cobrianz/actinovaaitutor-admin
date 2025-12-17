"use client"

import { useState } from "react"
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
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [isQuizDetailModalOpen, setIsQuizDetailModalOpen] = useState(false)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const filteredQuizzes = demoQuizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  const handleSaveQuiz = (quizData: any) => {
    toast.success(`Quiz ${selectedQuiz ? 'updated' : 'created'} successfully`)
  }

  const handleConfirmDelete = () => {
    toast.success(`${selectedQuiz?.title} deleted successfully`)
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
              <TableHead className="text-right">Attempts</TableHead>
              <TableHead className="text-right">Avg Score</TableHead>
              <TableHead className="text-right">Pass Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{quiz.course}</Badge>
                </TableCell>
                <TableCell className="text-right text-foreground-muted">{quiz.questions}</TableCell>
                <TableCell className="text-right text-foreground-muted">{quiz.attempts}</TableCell>
                <TableCell className="text-right text-foreground-muted">{quiz.avgScore}%</TableCell>
                <TableCell className="text-right">
                  <Badge variant={quiz.passRate >= 75 ? "default" : "secondary"}>{quiz.passRate}%</Badge>
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
                      <DropdownMenuItem onClick={() => handleViewQuiz(quiz)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Quiz
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditQuiz(quiz)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Quiz
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info(`Analytics for ${quiz.title}`)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
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
            ))}
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
