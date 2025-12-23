"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, RefreshCw } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings", { cache: "no-store" })
      const data = await response.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Settings saved successfully")
        setSettings(data.settings)
      } else {
        toast.error(data.error || "Failed to save settings")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-muted">No settings available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSettings}
          className="glass-card border-border/50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* General Settings */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Platform configuration and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input
              id="platform-name"
              value={settings.siteName || ""}
              onChange={(e) => updateSetting("siteName", e.target.value)}
              className="glass-card border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-email">Support Email</Label>
            <Input
              id="support-email"
              type="email"
              value={settings.supportEmail || ""}
              onChange={(e) => updateSetting("supportEmail", e.target.value)}
              className="glass-card border-border/50"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-foreground-muted">Enable maintenance mode for the platform</p>
            </div>
            <Switch
              checked={settings.maintenanceMode || false}
              onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>User Registration</Label>
              <p className="text-sm text-foreground-muted">Allow new user registrations</p>
            </div>
            <Switch
              checked={settings.userRegistration !== false}
              onCheckedChange={(checked) => updateSetting("userRegistration", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-foreground-muted">Send email notifications to users</p>
            </div>
            <Switch
              checked={settings.emailNotifications !== false}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gradient-primary"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={fetchSettings}
              disabled={saving}
              className="glass-card border-border/50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure API limits and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
            <Input
              id="rate-limit"
              type="number"
              value={settings.rateLimit || 100}
              onChange={(e) => updateSetting("rateLimit", parseInt(e.target.value))}
              className="glass-card border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-requests">Max Requests per User (daily)</Label>
            <Input
              id="max-requests"
              type="number"
              value={settings.maxRequestsPerUser || 1000}
              onChange={(e) => updateSetting("maxRequestsPerUser", parseInt(e.target.value))}
              className="glass-card border-border/50"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>API Logging</Label>
              <p className="text-sm text-foreground-muted">Log all API requests</p>
            </div>
            <Switch
              checked={settings.apiLogging !== false}
              onCheckedChange={(checked) => updateSetting("apiLogging", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rate Limiting</Label>
              <p className="text-sm text-foreground-muted">Enable API rate limiting</p>
            </div>
            <Switch
              checked={settings.rateLimiting !== false}
              onCheckedChange={(checked) => updateSetting("rateLimiting", checked)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gradient-primary"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={fetchSettings}
              disabled={saving}
              className="glass-card border-border/50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
          <CardDescription>Manage subscription plans and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="basic-price">Basic Plan</Label>
              <Input
                id="basic-price"
                type="number"
                step="any"
                value={settings.basicPrice ?? 0}
                onChange={(e) => updateSetting("basicPrice", parseFloat(e.target.value))}
                className="glass-card border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pro-price">Pro Plan</Label>
              <Input
                id="pro-price"
                type="number"
                step="any"
                value={settings.proPrice ?? 0}
                onChange={(e) => updateSetting("proPrice", parseFloat(e.target.value))}
                className="glass-card border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enterprise-price">Enterprise Plan</Label>
              <Input
                id="enterprise-price"
                type="number"
                step="any"
                value={settings.enterprisePrice ?? 0}
                onChange={(e) => updateSetting("enterprisePrice", parseFloat(e.target.value))}
                className="glass-card border-border/50"
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Free Trial</Label>
              <p className="text-sm text-foreground-muted">Enable 14-day free trial for new users</p>
            </div>
            <Switch
              checked={settings.freeTrialEnabled !== false}
              onCheckedChange={(checked) => updateSetting("freeTrialEnabled", checked)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gradient-primary"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={fetchSettings}
              disabled={saving}
              className="glass-card border-border/50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
