"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { User, Mail, Phone, MapPin, Lock, Bell, Shield, Activity } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Admin Profile</h1>
        <p className="text-foreground-muted mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Header Card */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="gradient-primary text-white text-3xl">AD</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full gradient-primary p-0"
                onClick={() => toast.info("Photo upload coming soon")}
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Admin User</h2>
              <p className="text-foreground-muted">admin@actinova.ai</p>
              <div className="flex gap-2 mt-3">
                <Badge className="gradient-primary">Super Admin</Badge>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-foreground-muted">Member Since</p>
              <p className="font-semibold">Jan 15, 2024</p>
              <p className="text-sm text-foreground-muted">Last Login</p>
              <p className="font-semibold">2 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass border-border/50">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" className="glass border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" className="glass border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue="admin@actinova.ai"
                    className="pl-10 glass border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="pl-10 glass border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  <Input id="location" defaultValue="San Francisco, CA" className="pl-10 glass border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px] glass border-border/50"
                  defaultValue="Passionate about education technology and AI-driven learning solutions."
                />
              </div>

              <Button onClick={() => toast.success("Profile updated successfully")} className="gradient-primary">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  <Input id="currentPassword" type="password" className="pl-10 glass border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  <Input id="newPassword" type="password" className="pl-10 glass border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  <Input id="confirmPassword" type="password" className="pl-10 glass border-border/50" />
                </div>
              </div>

              <Button onClick={() => toast.success("Password updated successfully")} className="gradient-primary">
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg glass-subtle">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-foreground-muted">Secure your account with 2FA</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email Notifications", desc: "Receive notifications via email" },
                { label: "Push Notifications", desc: "Receive push notifications in browser" },
                { label: "New User Registrations", desc: "Alert when new users sign up" },
                { label: "Course Completions", desc: "Notify when users complete courses" },
                { label: "Payment Alerts", desc: "Alert on new payments and transactions" },
                { label: "System Updates", desc: "Important system and security updates" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg glass-subtle">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-foreground-muted">{item.desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={i < 3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and login history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "Updated user profile", time: "2 hours ago" },
                  { action: "Created new course", time: "5 hours ago" },
                  { action: "Responded to contact", time: "1 day ago" },
                  { action: "Generated analytics report", time: "2 days ago" },
                  { action: "Modified subscription plan", time: "3 days ago" },
                  { action: "Logged in from new device", time: "5 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg glass-subtle">
                    <Activity className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-foreground-muted">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Login Sessions</CardTitle>
              <CardDescription>Active sessions across devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { device: "Chrome on MacBook Pro", location: "San Francisco, CA", current: true },
                  { device: "Safari on iPhone 13", location: "San Francisco, CA", current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg glass-subtle">
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-foreground-muted">{session.location}</p>
                    </div>
                    {session.current ? (
                      <Badge variant="default">Current</Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success("Session terminated")}
                        className="glass border-border/50"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
