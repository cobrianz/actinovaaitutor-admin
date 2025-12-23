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
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface FlashcardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flashcard?: any
  onSave: (flashcard: any) => void
}

export function FlashcardModal({ open, onOpenChange, flashcard, onSave }: FlashcardModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    difficulty: "beginner",
    cards: [] as any[]
  })

  // State for new card input
  const [newCard, setNewCard] = useState({ front: "", back: "" })

  useEffect(() => {
    if (flashcard) {
      // If editing, populate with existing data
      setFormData({
        title: flashcard.title || "",
        topic: flashcard.topic || "",
        difficulty: (flashcard.difficulty || "beginner").toLowerCase(),
        cards: flashcard.cards || []
      })

      // If cards are missing in the list view object, fetch them
      if (flashcard._id && (!flashcard.cards || flashcard.cards.length === 0) && flashcard.totalCards > 0) {
        fetch(`/api/flashcards/${flashcard._id}`)
          .then(res => res.json())
          .then(data => {
            if (data.flashcard) {
              setFormData(prev => ({ ...prev, cards: data.flashcard.cards || [] }))
            }
          })
          .catch(err => console.error("Failed to fetch cards for edit", err))
      }
    } else {
      setFormData({
        title: "",
        topic: "",
        difficulty: "beginner",
        cards: []
      })
    }
  }, [flashcard, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, _id: flashcard?._id })
    onOpenChange(false)
  }

  const handleAddCard = () => {
    if (newCard.front && newCard.back) {
      setFormData({ ...formData, cards: [...formData.cards, { ...newCard }] })
      setNewCard({ front: "", back: "" })
    } else {
      toast.error("Both question and answer are required")
    }
  }

  const handleRemoveCard = (index: number) => {
    const updatedCards = [...formData.cards]
    updatedCards.splice(index, 1)
    setFormData({ ...formData, cards: updatedCards })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">
            {flashcard ? "Edit Flashcard Set" : "Create New Flashcard Set"}
          </DialogTitle>
          <DialogDescription>
            {flashcard ? "Update set details and manage cards." : "Create a new topic and add flashcards."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="glass"
                placeholder="e.g., Intro to Biology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                className="glass"
                placeholder="e.g., Biology"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger className="glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Card Management Section */}
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="font-semibold">Manage Cards ({formData.cards.length})</h3>

            <div className="space-y-3 p-4 glass-subtle rounded-lg">
              <Label>Add New Card</Label>
              <Input
                placeholder="Question / Front"
                value={newCard.front}
                onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                className="glass mb-2"
              />
              <Textarea
                placeholder="Answer / Back"
                value={newCard.back}
                onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                className="glass mb-2"
                rows={2}
              />
              <Button type="button" onClick={handleAddCard} size="sm" variant="secondary" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Card
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {formData.cards.map((card, index) => (
                <div key={index} className="flex items-start justify-between p-3 glass border border-border/50 rounded hover:bg-background/50">
                  <div className="flex-1 mr-2">
                    <p className="font-medium text-sm mb-1">Q: {card.front || card.question}</p>
                    <p className="text-sm text-foreground-muted">A: {card.back || card.answer}</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCard(index)} className="text-destructive h-6 w-6">
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
              {flashcard ? "Update Set" : "Create Set"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
