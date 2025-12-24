"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Calendar, CreditCard, BookOpen, Trophy, Clock, MessageSquare, StickyNote, Layers, Activity, User as UserIcon, Loader2 } from "lucide-react"

interface UserDetailModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onEdit?: () => void
}

export function UserDetailModal({ isOpen, onClose, user, onEdit }: UserDetailModalProps) {
  const [detailedUser, setDetailedUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && user?._id) {
      setLoading(true)
      setError(null)
      fetch(`/api/users/${user._id}`)
        .then(async res => {
          if (!res.ok) {
            const text = await res.text()
            throw new Error(`API error: ${res.status} ${text}`)
          }
          const contentType = res.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Expected JSON but got ${contentType}`)
          }
          return res.json()
        })
        .then(data => {
          if (data.user) {
            setDetailedUser(data.user)
          }
        })
        .catch(err => {
          console.error("Failed to fetch user details:", err)
          setError(err.message)
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, user?._id])

  if (!user && !detailedUser) return null

  // Use detailedUser if available, otherwise fallback to user from props
  const displayUser = detailedUser || user
  const billingHistory = displayUser.billingHistory || []
  const courses = displayUser.courses || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto glass border-border/50 p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold">User Profile</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Viewing detailed information for {displayUser.name}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-foreground-muted animate-pulse">Loading detailed profile...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-3 rounded-full bg-destructive/10 text-destructive mb-4">
              <Activity className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load profile</h3>
            <p className="text-sm text-foreground-muted max-w-sm mb-6">
              There was an error retrieving the detailed user data. This might be a temporary connection issue.
            </p>
            <Button variant="outline" onClick={() => {
              if (user?._id) {
                setLoading(true)
                setError(null)
                fetch(`/api/users/${user._id}`)
                  .then(res => res.json())
                  .then(data => data.user && setDetailedUser(data.user))
                  .catch(err => setError(err.message))
                  .finally(() => setLoading(false))
              }
            }}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Header - Fully Responsive */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl glass-strong border border-border/50">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full gradient-primary flex items-center justify-center border-2 border-primary/20 shrink-0 shadow-lg">
                <UserIcon className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>

              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{displayUser.name}</h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge
                      className={
                        displayUser.status === "active"
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                      }
                    >
                      {displayUser.status}
                    </Badge>
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      {displayUser.subscription?.plan || "Premium"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-sm text-left">
                  <div className="flex items-center gap-2 text-foreground-muted">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{displayUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground-muted">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <span>Joined {displayUser.joinedDate ? new Date(displayUser.joinedDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground-muted col-span-1 xs:col-span-2">
                    <Activity className="h-4 w-4 text-primary shrink-0" />
                    <span>Last active: {displayUser.stats?.lastLogin ? new Date(displayUser.stats.lastLogin).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs - Responsive TabsList */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full glass border-border/50 p-1 h-auto">
                <TabsTrigger value="overview" className="data-[state=active]:gradient-primary text-xs sm:text-sm py-2">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:gradient-primary text-xs sm:text-sm py-2">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="billing" className="data-[state=active]:gradient-primary text-xs sm:text-sm py-2">
                  Billing
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:gradient-primary text-xs sm:text-sm py-2">
                  Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: "Courses", value: displayUser.stats?.coursesEnrolled || 0, icon: BookOpen, label: "Enrolled" },
                    { title: "Completed", value: displayUser.stats?.coursesCompleted || 0, icon: Trophy, label: "Courses" },
                    { title: "Study Time", value: `${Math.round((displayUser.stats?.totalStudyTime || 0) / 60)}h`, icon: Clock, label: "Total time" },
                    { title: "AI Chats", value: displayUser.stats?.totalChats || 0, icon: MessageSquare, label: "Interactions" },
                    { title: "Flashcards", value: displayUser.stats?.totalFlashcards || 0, icon: Layers, label: "Sets generated" },
                    { title: "Notes", value: displayUser.stats?.totalNotes || 0, icon: StickyNote, label: "Saved notes" },
                  ].map((stat, i) => (
                    <Card key={i} className="glass-subtle border-border/50 overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
                          {stat.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                          <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary/40" />
                        </div>
                        <p className="text-[10px] text-foreground-muted mt-1">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card className="glass-strong border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Recent Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Last Login Activity Card */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl glass-subtle border border-border/30">
                        <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
                          <Clock className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">Last Session</p>
                          <p className="text-sm text-foreground-muted">
                            The user was last active on {displayUser.stats?.lastLogin ? new Date(displayUser.stats.lastLogin).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            }) : 'N/A'}.
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-500/30 mt-2 sm:mt-0">
                          Recent
                        </Badge>
                      </div>

                      {displayUser.stats?.totalChats > 0 || displayUser.stats?.totalFlashcards > 0 || displayUser.stats?.totalTests > 0 ? (
                        <div className="space-y-3">
                          {displayUser.stats?.totalChats > 0 && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl glass-subtle border border-border/30">
                              <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                                <MessageSquare className="h-5 w-5 text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">AI Chat Engagement</p>
                                <p className="text-sm text-foreground-muted">
                                  User has interacted with AI tutor {displayUser.stats.totalChats} times.
                                </p>
                              </div>
                              <Badge variant="outline" className="text-blue-400 border-blue-400/30 mt-2 sm:mt-0">
                                Active
                              </Badge>
                            </div>
                          )}
                          {displayUser.stats?.totalFlashcards > 0 && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl glass-subtle border border-border/30">
                              <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
                                <Layers className="h-5 w-5 text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">Active Learning</p>
                                <p className="text-sm text-foreground-muted">
                                  Generated {displayUser.stats.totalFlashcards} custom flashcard sets.
                                </p>
                              </div>
                              <Badge variant="outline" className="text-purple-400 border-purple-400/30 mt-2 sm:mt-0">
                                Engaged
                              </Badge>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-foreground-muted">
                          <p className="text-sm">No specific engagement metrics recorded yet.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="mt-6">
                <Card className="glass-strong border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Financial Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl gradient-primary-soft border border-primary/20">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/30 shrink-0">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl font-bold">{displayUser.subscription?.plan || "Premium"} Active</p>
                          <p className="text-sm text-foreground-muted opacity-80">
                            Next billing on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="text-2xl font-black">KSh 4,500</p>
                        <p className="text-xs text-foreground-muted">Monthly billing cycle</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-foreground-muted border-b border-border/50 pb-2">
                        Transaction History
                      </h4>
                      {billingHistory.length > 0 ? (
                        <div className="space-y-3">
                          {billingHistory.map((bill: any, i: number) => (
                            <div
                              key={bill._id || i}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg glass-subtle transition-all hover:border-primary/30 group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] shrink-0" />
                                <div>
                                  <p className="font-medium group-hover:text-primary transition-colors">
                                    {bill.type || "Subscription"} Payment
                                  </p>
                                  <p className="text-xs text-foreground-muted">
                                    {new Date(bill.date || bill.paidAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right sm:text-left">
                                <p className="font-bold">KSh {(bill.amount || 4500).toLocaleString()}</p>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] h-5 bg-green-500/5 text-green-400 border-green-500/20"
                                >
                                  {bill.status || "Completed"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-4 rounded-lg glass-subtle border border-dashed border-border/50">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0" />
                          <p className="text-sm text-foreground-muted italic">
                            Initial onboarding phase - no past transactions recorded.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="mt-6">
                <Card className="glass-strong border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Course Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {courses.length > 0 ? (
                        courses.map((course: any, i: number) => (
                          <div
                            key={course.courseId || i}
                            className="space-y-3 p-4 rounded-xl glass-subtle border border-border/30"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div>
                                <h4 className="font-bold text-foreground">
                                  Course ID: {course.courseId.slice(-6).toUpperCase()}
                                </h4>
                                <p className="text-xs text-foreground-muted">
                                  Started on {new Date(course.startedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-black text-primary">{course.progress || 0}%</span>
                                <p className="text-[10px] text-foreground-muted font-bold tracking-tighter">
                                  COMPLETION
                                </p>
                              </div>
                            </div>
                            <div className="h-3 rounded-full bg-background-subtle overflow-hidden relative">
                              <div
                                className="h-full gradient-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] transition-all duration-1000 ease-out"
                                style={{ width: `${course.progress || 5}%` }}
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between text-[10px] text-foreground-muted font-medium gap-2">
                              <span>LAST ACCESSED: {new Date(course.lastUpdated).toLocaleDateString()}</span>
                              <span>{course.status === "completed" ? "FULL ACCESS UNLOCKED" : "LEARNING IN PROGRESS"}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-10" />
                          <p className="text-foreground-muted">User hasn't enrolled in any specific courses yet.</p>
                          <Button variant="link" className="mt-2 text-primary">
                            Assign Recommended Course
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}