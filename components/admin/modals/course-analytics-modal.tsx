"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { TrendingUp, Users, Clock, Star, BookOpen, Target } from "lucide-react"

interface CourseAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  course: any
}

const COLORS = {
  primary: "var(--color-chart-1)",
  secondary: "var(--color-chart-2)",
  tertiary: "var(--color-chart-3)",
  quaternary: "var(--color-chart-4)",
  quinary: "var(--color-chart-5)",
}

export function CourseAnalyticsModal({ isOpen, onClose, course }: CourseAnalyticsModalProps) {
  if (!course) return null

  // Mock analytics data for the course
  const enrollmentData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    enrollments: Math.floor(Math.random() * 20) + 5,
  }))

  const completionData = [
    { name: "Completed", value: Math.floor(course.enrollments * 0.65), fill: COLORS.primary },
    { name: "In Progress", value: Math.floor(course.enrollments * 0.25), fill: COLORS.secondary },
    { name: "Not Started", value: Math.floor(course.enrollments * 0.1), fill: COLORS.tertiary },
  ]

  const difficultyBreakdown = [
    { name: "Easy", value: 30, fill: COLORS.primary },
    { name: "Medium", value: 45, fill: COLORS.secondary },
    { name: "Hard", value: 25, fill: COLORS.tertiary },
  ]

  const weeklyEngagement = Array.from({ length: 12 }, (_, i) => ({
    week: `Week ${i + 1}`,
    activeUsers: Math.floor(Math.random() * course.enrollments * 0.8) + course.enrollments * 0.2,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto glass border-border/50">
        <DialogHeader>
          <DialogTitle>Course Analytics - {course.title}</DialogTitle>
          <DialogDescription>Detailed performance metrics and insights for this course</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Total Enrollments</span>
                </div>
                <p className="text-2xl font-bold">{course.enrollments}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Completion Rate</span>
                </div>
                <p className="text-2xl font-bold">65%</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Average Rating</span>
                </div>
                <p className="text-2xl font-bold">{course.rating}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground-muted">Avg. Time Spent</span>
                </div>
                <p className="text-2xl font-bold">4.2h</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="enrollment" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass border-border/50">
              <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
              <TabsTrigger value="completion">Completion</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
            </TabsList>

            <TabsContent value="enrollment" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Enrollment Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={enrollmentData}>
                      <defs>
                        <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        stroke="var(--color-muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="enrollments"
                        stroke={COLORS.primary}
                        fillOpacity={1}
                        fill="url(#colorEnrollments)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completion" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle>Completion Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={completionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill={COLORS.primary}
                          dataKey="value"
                        >
                          {completionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle>Module Completion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(course.modules?.length > 0 ? course.modules : Array.from({ length: 5 })).map((m: any, i: number) => (
                      <div key={m?.id || i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{m?.title || `Module ${i + 1}`}</span>
                          <span className="text-foreground-muted">{Math.floor(Math.random() * 30) + 70}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                          <div
                            className="h-full gradient-primary"
                            style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Weekly Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyEngagement}>
                      <XAxis
                        dataKey="week"
                        stroke="var(--color-muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        stroke={COLORS.secondary}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="difficulty" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Question Difficulty Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={difficultyBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {difficultyBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="glass border-border/50 bg-transparent">
              Close
            </Button>
            <Button className="gradient-primary">Export Report</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}