"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export function SystemSettings() {
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Platform configuration and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input id="platform-name" defaultValue="Actinova AI Tutor" className="glass border-border/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-email">Support Email</Label>
            <Input
              id="support-email"
              type="email"
              defaultValue="support@actinova.ai"
              className="glass border-border/50"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-foreground-muted">Enable maintenance mode for the platform</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>User Registration</Label>
              <p className="text-sm text-foreground-muted">Allow new user registrations</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-foreground-muted">Send email notifications to users</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => toast.success("Settings saved successfully")} className="gradient-primary">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Changes discarded")}
              className="glass border-border/50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure API limits and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
            <Input id="rate-limit" type="number" defaultValue="100" className="glass border-border/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-requests">Max Requests per User (daily)</Label>
            <Input id="max-requests" type="number" defaultValue="1000" className="glass border-border/50" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>API Logging</Label>
              <p className="text-sm text-foreground-muted">Log all API requests</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rate Limiting</Label>
              <p className="text-sm text-foreground-muted">Enable API rate limiting</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => toast.success("API settings saved")} className="gradient-primary">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Changes discarded")}
              className="glass border-border/50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
          <CardDescription>Manage subscription plans and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="basic-price">Basic Plan</Label>
              <Input id="basic-price" type="number" defaultValue="29.99" className="glass border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pro-price">Pro Plan</Label>
              <Input id="pro-price" type="number" defaultValue="49.99" className="glass border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enterprise-price">Enterprise Plan</Label>
              <Input id="enterprise-price" type="number" defaultValue="99.99" className="glass border-border/50" />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Free Trial</Label>
              <p className="text-sm text-foreground-muted">Enable 14-day free trial for new users</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => toast.success("Pricing updated")} className="gradient-primary">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Changes discarded")}
              className="glass border-border/50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
