"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Calendar, CreditCard, BookOpen, Trophy, Clock } from "lucide-react"

interface UserDetailModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border/50">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete information about {user.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start gap-4 p-4 rounded-lg glass-subtle">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/ceholder-svg-height-80.jpg?height=80&width=80`} />
              <AvatarFallback className="gradient-primary text-white text-xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                <Badge variant="outline">{user.subscription}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-foreground-muted">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {user.lastLogin}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass border-border/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground-muted">Total Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div className="text-2xl font-bold">12</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground-muted">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <div className="text-2xl font-bold">8</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground-muted">Study Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <div className="text-2xl font-bold">47h</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg glass-subtle">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Completed: Introduction to React</p>
                          <p className="text-sm text-foreground-muted">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg glass-subtle">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{user.subscription} Plan</p>
                        <p className="text-sm text-foreground-muted">$39.99/month</p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payment History</p>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between p-2 rounded text-sm">
                        <span className="text-foreground-muted">Jan {i}, 2024</span>
                        <span className="font-medium">$39.99</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["JavaScript Mastery", "React Fundamentals", "Python Basics"].map((course, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{course}</span>
                          <span className="text-foreground-muted">{[85, 60, 40][i]}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                          <div className="h-full gradient-primary" style={{ width: `${[85, 60, 40][i]}%` }} />
                        </div>
                      </div>
                    ))}
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
            <Button className="gradient-primary">Edit User</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
