"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner"

interface QuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quiz?: any
  onSave: (quiz: any) => void
}

export function QuizModal({ open, onOpenChange, quiz, onSave }: QuizModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    course: "", // specific to API
    subject: "", // keeping for UI consistency if needed, but likely 'course'
    difficulty: "medium",
    timeLimit: 30,
    passingScore: 70,
    questions: [] as any[]
  })

  // State for new question
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1
  })

  useEffect(() => {
    if (quiz) {
      // Initialize with available prop data
      setFormData({
        title: quiz.title || "",
        course: quiz.course || quiz.subject || "",
        subject: quiz.subject || quiz.course || "",
        difficulty: (quiz.difficulty || "medium").toLowerCase(),
        timeLimit: quiz.timeLimit || 30,
        passingScore: quiz.passingScore || 70,
        questions: quiz.questions || []
      })

      // Fetch full details if questions are missing (which is expected from list view)
      if (quiz._id && (!quiz.questions || quiz.questions.length === 0)) {
        fetch(`/api/tests/${quiz._id}`)
          .then(res => res.json())
          .then(data => {
            if (data.test) {
              setFormData(prev => ({
                ...prev,
                questions: data.test.questions || [],
                // Update other fields to ensure accuracy
                title: data.test.title || prev.title,
                course: data.test.course || prev.course,
                difficulty: (data.test.difficulty || prev.difficulty).toLowerCase(),
                timeLimit: data.test.timeLimit || prev.timeLimit,
                passingScore: data.test.passingScore || prev.passingScore
              }))
            }
          })
          .catch(err => console.error("Failed to fetch full quiz details", err))
      }
    } else {
      setFormData({
        title: "",
        course: "",
        subject: "",
        difficulty: "medium",
        timeLimit: 30,
        passingScore: 70,
        questions: []
      })
    }
  }, [quiz, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ensure we map 'subject' to 'course' for API if needed, or stick to one.
    // API uses 'course'.
    const payload = {
      ...formData,
      course: formData.course || formData.subject,
      _id: quiz?._id // Preserve ID for updates
    }
    onSave(payload)
    onOpenChange(false)
  }

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options]
    updatedOptions[index] = value
    setNewQuestion({ ...newQuestion, options: updatedOptions })
  }

  const handleAddQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some(o => !o) || !newQuestion.correctAnswer) {
      toast.error("Please fill in question, all 4 options, and select a correct answer.")
      return
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, { ...newQuestion }]
    })
    setNewQuestion({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1
    })
  }

  const handleRemoveQuestion = (index: number) => {
    const updated = [...formData.questions]
    updated.splice(index, 1)
    setFormData({ ...formData, questions: updated })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">{quiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
          <DialogDescription>
            {quiz ? "Update quiz details and questions." : "Create a new quiz with custom questions."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="glass"
                placeholder="e.g., Algebra Fundamentals"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course / Subject</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value, subject: e.target.value })}
                required
                className="glass"
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Limit (min)</Label>
              <Input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label>Pass Score (%)</Label>
              <Input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                className="glass"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <h3 className="font-semibold">Manage Questions ({formData.questions.length})</h3>

            {/* Add New Question Form */}
            <div className="p-4 glass-subtle rounded-lg space-y-3">
              <Label>New Question</Label>
              <Textarea
                placeholder="Question text..."
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className="glass mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                {newQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={newQuestion.correctAnswer === opt && opt !== "" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: opt })}
                      disabled={!opt}
                      title="Mark as correct"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="glass h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-foreground-muted">Enter options and click the checkmark to select the correct answer.</p>
              <Button type="button" onClick={handleAddQuestion} size="sm" variant="secondary" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </div>

            {/* List of Questions */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {formData.questions.map((q, index) => (
                <div key={index} className="flex items-start justify-between p-3 glass border border-border/50 rounded hover:bg-background/50">
                  <div className="flex-1 mr-2">
                    <p className="font-medium text-sm mb-1">{q.text || q.question}</p>
                    <p className="text-xs text-foreground-muted">
                      Answer: <span className="text-primary">{q.correctAnswer}</span> | Options: {q.options.join(", ")}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveQuestion(index)} className="text-destructive h-6 w-6">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              {quiz ? "Update Quiz" : "Create Quiz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
