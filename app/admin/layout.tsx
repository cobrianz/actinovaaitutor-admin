"use client"

import type React from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { Navbar } from "@/components/admin/navbar"
import { SidebarProvider } from "@/components/admin/sidebar-context"
import { Toaster } from "sonner"

import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/admin/auth")

  if (isAuthPage) {
    return (
      <SidebarProvider>
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
          {children}
          <Toaster richColors position="top-right" />
        </main>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pt-16">
          <Navbar />
          <div className="container mx-auto p-6 lg:p-8">{children}</div>
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </SidebarProvider>
  )
}
