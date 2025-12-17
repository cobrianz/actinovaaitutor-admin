import { BlogManagement } from "@/components/admin/blogs/blog-management"
import { BlogAnalytics } from "@/components/admin/blogs/blog-analytics"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blogs Management - Actinova Admin",
  description: "Manage blog posts, comments, and engagement analytics",
}

export default function BlogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Blogs Management</h1>
          <p className="text-foreground-muted mt-1">Create, edit, and manage blog posts and comments</p>
        </div>
      </div>

      <BlogAnalytics />
      <BlogManagement />
    </div>
  )
}
