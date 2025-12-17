"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Users, Clock, TrendingUp } from "lucide-react"
import { useState } from "react"

interface FlashcardDetailModalProps {
  isOpen: boolean
  onClose: () => void
  flashcard: any
}

export function FlashcardDetailModal({ isOpen, onClose, flashcard }: FlashcardDetailModalProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  if (!flashcard) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl glass border-border/50">
        <DialogHeader>
          <DialogTitle>Flashcard Set Details</DialogTitle>
          <DialogDescription>{flashcard.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Rating</span>
                </div>
                <p className="text-2xl font-bold">{flashcard.rating}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Usage</span>
                </div>
                <p className="text-2xl font-bold">{flashcard.usage}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Cards</span>
                </div>
                <p className="text-2xl font-bold">{flashcard.cards}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Success</span>
                </div>
                <p className="text-2xl font-bold">87%</p>
              </CardContent>
            </Card>
          </div>

          {/* Flashcard Preview */}
          <div>
            <h3 className="font-semibold mb-3">Preview Flashcards</h3>
            <div className="relative h-64 cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
              <div
                className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <Card
                  className={`absolute inset-0 glass border-border/50 backface-hidden ${
                    isFlipped ? "invisible" : "visible"
                  }`}
                >
                  <CardContent className="h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <Badge className="mb-4">Question</Badge>
                      <p className="text-xl font-medium">What is a closure in JavaScript?</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Back */}
                <Card
                  className={`absolute inset-0 glass border-border/50 backface-hidden rotate-y-180 ${
                    isFlipped ? "visible" : "invisible"
                  }`}
                >
                  <CardContent className="h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <Badge className="mb-4">Answer</Badge>
                      <p className="text-lg">
                        A closure is a function that has access to variables in its outer scope, even after the outer
                        function has returned.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <p className="text-center text-sm text-foreground-muted mt-3">Click card to flip</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
              Close
            </Button>
            <Button className="gradient-primary">Edit Flashcard Set</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
