"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, CheckCircle } from "lucide-react"

interface QuizDetailModalProps {
  isOpen: boolean
  onClose: () => void
  quiz: any
}

export function QuizDetailModal({ isOpen, onClose, quiz }: QuizDetailModalProps) {
  if (!quiz) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border/50">
        <DialogHeader>
          <DialogTitle>Quiz Details</DialogTitle>
          <DialogDescription>{quiz.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Questions</span>
                </div>
                <p className="text-2xl font-bold">{quiz.questions}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Attempts</span>
                </div>
                <p className="text-2xl font-bold">{quiz.attempts}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Avg Score</span>
                </div>
                <p className="text-2xl font-bold">{quiz.avgScore}%</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Pass Rate</span>
                </div>
                <p className="text-2xl font-bold">{quiz.passRate}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass border-border/50">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 rounded-lg glass-subtle space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                        {i}
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">What is the output of console.log(typeof null)?</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 rounded-full border-2 border-foreground-muted" />
                            <span>undefined</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-medium">object</span>
                            <Badge variant="outline" className="text-xs">
                              Correct
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 rounded-full border-2 border-foreground-muted" />
                            <span>null</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">85% correct</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Question Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { q: "Question 1", correct: 92 },
                      { q: "Question 2", correct: 78 },
                      { q: "Question 3", correct: 65 },
                      { q: "Question 4", correct: 88 },
                      { q: "Question 5", correct: 71 },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.q}</span>
                          <span className="text-foreground-muted">{item.correct}% correct</span>
                        </div>
                        <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                          <div className="h-full gradient-primary" style={{ width: `${item.correct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Quiz Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Time Limit</span>
                    <span className="font-medium">30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Passing Score</span>
                    <span className="font-medium">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Attempts Allowed</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Randomize Questions</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Show Correct Answers</span>
                    <Badge variant="default">After Completion</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
              Close
            </Button>
            <Button className="gradient-primary">Edit Quiz</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
