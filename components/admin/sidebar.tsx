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
  User,
  LogOut,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/admin/sidebar-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Admins", href: "/admin/admins", icon: Shield },
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

export function SidebarDesktop() {
  const { collapsed } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 flex flex-col border-r border-border glass-strong transition-all duration-300",
        "lg:relative lg:top-0 lg:mt-16 lg:z-auto",
        "hidden lg:flex",
        collapsed ? "w-20" : "w-64",
        "sm:max-w-sm"
      )}
    >
      <SidebarContent />
    </aside>
  )
}

export function Sidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      <SidebarDesktop />
      <Sheet open={mobileOpen} onOpenChange={setOpen => setMobileOpen(setOpen)}>
        <SheetContent side="left" className="p-0 bg-white dark:bg-zinc-950 w-72">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full pt-16">
            <SidebarContent onItemClick={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const { collapsed } = useSidebar()
  const pathname = usePathname()
  const [unreadContacts, setUnreadContacts] = useState(0)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem("adminUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }

    // Load unread contacts
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/contacts?status=new&limit=1')
        const data = await response.json()
        if (data.pagination) {
          setUnreadContacts(data.pagination.total)
        }
      } catch (error) {
        // console.error("Failed to fetch unread contacts", error)
      }
    }

    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      window.location.href = '/admin/auth/login'
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 space-y-3 px-3 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onItemClick?.()}
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
              {(!collapsed || typeof window !== 'undefined' && window.innerWidth < 1024) && (
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
                <AvatarFallback className="gradient-primary text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              {(!collapsed || typeof window !== 'undefined' && window.innerWidth < 1024) && (
                <div className="flex flex-col items-start text-left overflow-hidden">
                  <span className="font-medium truncate w-full">{user?.name || "Admin User"}</span>
                  <span className="text-xs text-foreground-muted truncate w-full">{user?.email || "admin@actinova.ai"}</span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
