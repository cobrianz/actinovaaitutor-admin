"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Check, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface QuizDetailModalProps {
  isOpen: boolean
  onClose: () => void
  quiz: any
}

export function QuizDetailModal({ isOpen, onClose, quiz }: QuizDetailModalProps) {
  const [fullQuiz, setFullQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (isOpen && quiz?._id) {
        setLoading(true)
        try {
          const response = await fetch(`/api/tests/${quiz._id}`)
          const data = await response.json()
          if (data.test) {
            setFullQuiz(data.test)
          }
        } catch (error) {
          console.error("Failed to fetch quiz details:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchFullDetails()
  }, [isOpen, quiz])

  if (!quiz) return null

  const displayQuiz = fullQuiz || quiz
  // Ensure questions is an array
  const questions = Array.isArray(displayQuiz.questions) ? displayQuiz.questions : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-strong max-w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-full m-4 sm:m-0">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Quiz Details</DialogTitle>
          <DialogDescription>View quiz settings and questions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <div className="glass p-2 rounded-md border border-input text-sm break-all">
                {displayQuiz.title}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Course / Subject</Label>
              <div className="glass p-2 rounded-md border border-input text-sm">
                {displayQuiz.course || displayQuiz.subject || "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <div className="glass p-2 rounded-md border border-input text-sm capitalize">
                <Badge variant={displayQuiz.difficulty === 'easy' ? 'secondary' : displayQuiz.difficulty === 'hard' ? 'destructive' : 'default'} className="capitalize">
                  {displayQuiz.difficulty || 'Medium'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Time Limit (min)</Label>
              <div className="glass p-2 rounded-md border border-input text-sm">
                {displayQuiz.timeLimit || 30}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pass Score (%)</Label>
              <div className="glass p-2 rounded-md border border-input text-sm">
                {displayQuiz.passingScore || 70}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border-t border-border pt-4 space-y-4">
              <h3 className="font-semibold">Questions ({questions.length})</h3>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {questions.length > 0 ? (
                  questions.map((q: any, index: number) => (
                    <div key={index} className="flex items-start justify-between p-3 glass border border-border/50 rounded hover:bg-background/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{q.text || q.question}</p>
                        <p className="text-xs text-foreground-muted mb-1">
                          Options: {q.options ? q.options.join(", ") : "No options"}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-primary">Correct Answer:</span>
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                            <Check className="h-3 w-3 mr-1" />
                            {q.correctAnswer}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-foreground-muted glass border border-dashed border-border/50 rounded-lg">
                    No questions available.
                  </div>
                )}
              </div>
            </div>
          )}


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
