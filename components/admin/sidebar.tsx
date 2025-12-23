"use client"
import { useState, useEffect } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  FileText,
  BookMarked,
  Mail,
  BarChart3,
  FileBarChart,
  Settings,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/admin/sidebar-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Flashcards", href: "/admin/flashcards", icon: CreditCard },
  { name: "Tests", href: "/admin/tests", icon: FileText },
  { name: "Blogs", href: "/admin/blogs", icon: BookMarked },
  { name: "Contacts", href: "/admin/contacts", icon: Mail },
  { name: "Billing", href: "/admin/billing", icon: DollarSign },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: FileBarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const pathname = usePathname()
  const [unreadContacts, setUnreadContacts] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/contacts?status=new&limit=1')
        const data = await response.json()
        if (data.pagination) {
          setUnreadContacts(data.pagination.total)
        }
      } catch (error) {
        console.error("Failed to fetch unread contacts", error)
      }
    }

    fetchUnreadCount()
    // Poll every minute
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 flex flex-col border-r border-border glass-strong transition-all duration-300",
        // On small screens: overlay/drawer behavior
        "lg:relative lg:top-0 lg:mt-16 lg:z-auto",
        // Visibility and positioning
        "hidden lg:flex", // Hide by default on small screens, show on large
        collapsed ? "w-20" : "w-64",
        // Mobile overlay when visible
        "sm:max-w-sm"
      )}
    >

      {/* Navigation */}
      <nav className="flex-1 space-y-3 px-3 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-2 text-[14px] font-medium transition-all text-gray-500",
                isActive
                  ? "gradient-primary text-white shadow-lg shadow-primary/20"
                  : "hover:bg-background-subtle hover:text-gray-700",
                collapsed && "justify-center",
              )}
              title={collapsed ? item.name : undefined}
            >
              <div className="relative">
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.name === "Contacts" && unreadContacts > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadContacts > 9 ? "9+" : unreadContacts}
                  </span>
                )}
              </div>
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.name}</span>
                  {item.name === "Contacts" && unreadContacts > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-semibold text-red-600">
                      {unreadContacts}
                    </span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-background-subtle transition-colors",
                collapsed && "justify-center",
              )}
              suppressHydrationWarning
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="gradient-primary text-white">AD</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">Admin User</span>
                  <span className="text-xs text-foreground-muted">admin@actinova.ai</span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
