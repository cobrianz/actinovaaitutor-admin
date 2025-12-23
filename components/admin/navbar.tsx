"use client"

import {
  Bell, Search, Settings, ChevronLeft,
  ChevronRight, User, Menu, Moon, Sun, Monitor, Megaphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSidebar } from "@/components/admin/sidebar-context"
import { SettingsModal } from "@/components/admin/modals/settings-modal"
import { NotificationsPanel } from "@/components/admin/modals/notifications-panel"
import { AnnouncementModal } from "@/components/admin/modals/announcement-modal"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { collapsed, toggleCollapsed } = useSidebar()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />
    if (theme === 'light') return <Sun className="h-4 w-4" />
    if (theme === 'dark') return <Moon className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true)
  }

  const handleSendAnnouncement = () => {
    setIsAnnouncementModalOpen(true)
  }

  return (
    <nav className="fixed w-full top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-16  items-center px-6">
        {/* Menu Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleCollapsed}>
          <Menu className="h-4 w-4" />
        </Button>

        {/* Actinova Logo and Text */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg flex-shrink-0 text-gradient-primary hidden sm:block">Actinova</span>
        </div>

        {/* Right Side - All Other Content */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Search Bar */}
          <div className="max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <Input
                placeholder="Search anything..."
                className="pl-9 glass border-border/50 bg-background/50 w-64"
              />
            </div>
          </div>

          {/* Send Announcement */}
          <Button variant="ghost" size="icon" onClick={handleSendAnnouncement} title="Send announcement">
            <Megaphone className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button variant="ghost" size="icon" onClick={cycleTheme} title={`Current theme: ${theme || 'system'}`}>
              {getThemeIcon()}
            </Button>
          )}

          {/* Notifications */}
          <NotificationsPanel>
            <Button variant="ghost" size="icon" className="relative" title="Notifications" suppressHydrationWarning>
              <Bell className="h-5 w-5" />
            </Button>
          </NotificationsPanel>

          {/* Settings */}
          <Button variant="ghost" size="icon" onClick={handleSettingsClick} title="Settings">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10" title="User menu" suppressHydrationWarning>
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@actinova.ai
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' })
                    localStorage.removeItem('adminToken')
                    localStorage.removeItem('adminUser')
                    toast.success("Logged out successfully")
                    router.push('/admin/auth/login')
                  } catch (error) {
                    toast.error("Logout failed")
                  }
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
      />
    </nav>
  )
}