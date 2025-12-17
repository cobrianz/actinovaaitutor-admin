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
import type { Flashcard } from "@/lib/types"

interface FlashcardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flashcard?: Flashcard | null
  onSave: (flashcard: Partial<Flashcard>) => void
}

export function FlashcardModal({ open, onOpenChange, flashcard, onSave }: FlashcardModalProps) {
  const [formData, setFormData] = useState<Partial<Flashcard>>(
    flashcard || {
      question: "",
      answer: "",
      subject: "",
      difficulty: "easy",
      tags: [],
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
          <DialogTitle className="text-2xl text-gradient">
            {flashcard ? "Edit Flashcard" : "Create New Flashcard"}
          </DialogTitle>
          <DialogDescription>
            {flashcard ? "Update flashcard content." : "Add a new flashcard for studying."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question / Front</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
              className="glass"
              rows={3}
              placeholder="Enter the question or front of the card..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer / Back</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
              className="glass"
              rows={3}
              placeholder="Enter the answer or back of the card..."
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
                onValueChange={(value) => setFormData({ ...formData, difficulty: value as Flashcard["difficulty"] })}
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
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags?.join(", ") || ""}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map((t) => t.trim()) })}
              className="glass"
              placeholder="algebra, equations, basics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              value={formData.explanation || ""}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="glass"
              rows={2}
              placeholder="Additional context or explanation..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              {flashcard ? "Update Flashcard" : "Create Flashcard"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
