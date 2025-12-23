"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface FlashcardDetailModalProps {
  isOpen: boolean
  onClose: () => void
  flashcard: any
}

export function FlashcardDetailModal({ isOpen, onClose, flashcard }: FlashcardDetailModalProps) {
  const [fullFlashcard, setFullFlashcard] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (isOpen && flashcard?._id) {
        setLoading(true)
        try {
          const response = await fetch(`/api/flashcards/${flashcard._id}`)
          const data = await response.json()
          if (data.flashcard) {
            setFullFlashcard(data.flashcard)
          }
        } catch (error) {
          console.error("Failed to fetch details:", error)
          toast.error("Failed to load flashcard details")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchFullDetails()
  }, [isOpen, flashcard])

  if (!flashcard) return null

  const displayData = fullFlashcard || flashcard
  const cards = displayData.cards || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-strong max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Flashcard Set Details</DialogTitle>
          <DialogDescription>View set details and cards.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <div className="glass p-2 rounded-md border border-input text-sm">
                {displayData.title}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <div className="glass p-2 rounded-md border border-input text-sm">
                {displayData.topic}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <div>
              <Badge variant={displayData.difficulty === 'beginner' ? 'default' : displayData.difficulty === 'intermediate' ? 'secondary' : 'destructive'} className="capitalize">
                {displayData.difficulty || 'N/A'}
              </Badge>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Cards in this Set ({cards.length})</h3>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {cards.length > 0 ? (
                cards.map((card: any, index: number) => (
                  <div key={index} className="flex items-start justify-between p-3 glass border border-border/50 rounded hover:bg-background/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1"><span className="text-primary font-bold">Q:</span> {card.front || card.question}</p>
                      <p className="text-sm text-foreground-muted"><span className="text-secondary font-bold">A:</span> {card.back || card.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-foreground-muted glass border border-dashed border-border/50 rounded-lg">
                  No cards available.
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
