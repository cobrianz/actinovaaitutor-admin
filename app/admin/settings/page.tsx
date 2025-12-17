import { SystemSettings } from "@/components/admin/settings/system-settings"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings - Actinova Admin",
  description: "System configuration and settings",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">System Settings</h1>
          <p className="text-foreground-muted mt-1">Configure platform settings and preferences</p>
        </div>
      </div>

      <SystemSettings />
    </div>
  )
}
