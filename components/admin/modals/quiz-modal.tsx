"use client"

import type React from "react"

import { useState } from "react"
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
import type { Quiz } from "@/lib/types"

interface QuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quiz?: Quiz | null
  onSave: (quiz: Partial<Quiz>) => void
}

export function QuizModal({ open, onOpenChange, quiz, onSave }: QuizModalProps) {
  const [formData, setFormData] = useState<Partial<Quiz>>(
    quiz || {
      title: "",
      subject: "",
      difficulty: "medium",
      questions: 10,
      timeLimit: 30,
      passingScore: 70,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">{quiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
          <DialogDescription>
            {quiz ? "Update quiz settings and details." : "Generate a new AI-powered quiz."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="glass"
              placeholder="e.g., Algebra Fundamentals Test"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="glass"
                placeholder="e.g., Mathematics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value as Quiz["difficulty"] })}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="glass"
              rows={2}
              placeholder="Brief description of the quiz..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questions">Questions</Label>
              <Input
                id="questions"
                type="number"
                value={formData.questions}
                onChange={(e) => setFormData({ ...formData, questions: Number.parseInt(e.target.value) })}
                className="glass"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (min)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: Number.parseInt(e.target.value) })}
                className="glass"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: Number.parseInt(e.target.value) })}
                className="glass"
                min="0"
                max="100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              {quiz ? "Update Quiz" : "Generate Quiz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
