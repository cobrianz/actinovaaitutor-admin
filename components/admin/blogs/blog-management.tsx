"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Eye, MessageSquare, Star, BookOpen, Heart } from "lucide-react"
import { toast } from "sonner"
import { BlogDetailModal } from "@/components/admin/modals/blog-detail-modal"
import { BlogModal } from "@/components/admin/modals/blog-modal"
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal"

const demoPosts = Array.from({ length: 15 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: [
    "Getting Started with AI Tutoring",
    "Best Practices for Online Learning",
    "Machine Learning Fundamentals",
    "Building Study Habits",
    "The Future of EdTech",
  ][i % 5],
  author: ["Admin", "John Doe", "Jane Smith"][i % 3],
  status: ["Published", "Draft", "Scheduled"][i % 3] as "Published" | "Draft" | "Scheduled",
  views: Math.floor(Math.random() * 5000) + 500,
  likes: Math.floor(Math.random() * 500) + 50,
  comments: Math.floor(Math.random() * 100) + 10,
  date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
}))

export function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  // Modal states
  const [selectedBlog, setSelectedBlog] = useState<any>(null)
  const [isBlogDetailModalOpen, setIsBlogDetailModalOpen] = useState(false)
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false)
  const [detailModalTab, setDetailModalTab] = useState("content")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/blogs?${params}`)
      const data = await response.json()
      if (data.blogs) {
        setBlogs(data.blogs)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
      toast.error("Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, page])

  const handleViewBlog = (blog: any) => {
    setSelectedBlog(blog)
    setDetailModalTab("content")
    setIsBlogDetailModalOpen(true)
  }

  const handleEditBlog = (blog: any) => {
    setSelectedBlog(blog)
    setIsBlogModalOpen(true)
  }

  const handleCreateBlog = () => {
    setSelectedBlog(null)
    setIsBlogModalOpen(true)
  }

  const handleToggleFeature = async (blog: any) => {
    try {
      const newStatus = !blog.featured
      const response = await fetch(`/api/blogs/${blog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newStatus }),
      })

      if (response.ok) {
        toast.success(`Post ${newStatus ? "featured" : "unfeatured"} successfully`)
        fetchBlogs()
      } else {
        toast.error("Failed to update feature status")
      }
    } catch (error) {
      toast.error("Error updating feature status")
    }
  }

  const handleDeleteBlog = (blog: any) => {
    setSelectedBlog(blog)
    setIsDeleteModalOpen(true)
  }

  const handleSaveBlog = async (blogData: any) => {
    setLoading(true)
    try {
      const isUpdate = !!selectedBlog
      const url = isUpdate ? `/api/blogs/${selectedBlog._id}` : "/api/blogs"
      const method = isUpdate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? "update" : "create"} blog post`)
      }

      toast.success(`Blog post ${isUpdate ? 'updated' : 'created'} successfully`)
      setIsBlogModalOpen(false)
      fetchBlogs()
    } catch (error) {
      console.error("Error saving blog:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save blog post")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/blogs/${selectedBlog._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Blog post deleted successfully")
        fetchBlogs()
      } else {
        toast.error("Failed to delete blog post")
      }
    } catch (error) {
      toast.error("Error deleting blog post")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const stats = {
    totalPosts: total,
    totalViews: blogs.reduce((acc: number, b: any) => acc + (b.stats?.views || b.viewsCount || 0), 0),
    totalLikes: blogs.reduce((acc: number, b: any) => acc + (b.stats?.likes || b.likesCount || 0), 0),
    totalComments: blogs.reduce((acc: number, b: any) => acc + (b.stats?.comments || b.commentsCount || 0), 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Total Posts</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Recent Views</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalViews}</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Recent Likes</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalLikes}</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-muted">Recent Comments</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalComments}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="pl-9 glass border-border/50"
              />
            </div>
            <Button onClick={handleCreateBlog} className="gradient-primary">
              Create Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Likes</TableHead>
                <TableHead className="text-right">Comments</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length > 0 ? (
                blogs.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium truncate max-w-[250px]">
                      <div className="flex items-center gap-2">
                        {post.featured && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                        <span className="truncate">{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground-muted">{post.author?.name || post.author || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "published" ? "default" : post.status === "draft" ? "secondary" : "outline"
                        }
                      >
                        {(post.status || "draft").charAt(0).toUpperCase() + (post.status || "draft").slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-foreground-muted">{post.stats?.views || 0}</TableCell>
                    <TableCell className="text-right text-foreground-muted">{post.stats?.likes || 0}</TableCell>
                    <TableCell className="text-right text-foreground-muted">{post.stats?.comments || 0}</TableCell>
                    <TableCell className="text-foreground-muted">{formatDate(post.publishedAt || post.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewBlog(post)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditBlog(post)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeature(post)}>
                            <Star className={`h-4 w-4 mr-2 ${post.featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            {post.featured ? "Unfeature Post" : "Feature Post"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteBlog(post)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-foreground-muted">
                    No blog posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Modals */}
        <BlogDetailModal
          isOpen={isBlogDetailModalOpen}
          onClose={() => setIsBlogDetailModalOpen(false)}
          onEdit={handleEditBlog}
          blog={selectedBlog}
          defaultTab={detailModalTab}
        />
        <BlogModal
          open={isBlogModalOpen}
          onOpenChange={setIsBlogModalOpen}
          blog={selectedBlog}
          onSave={handleSaveBlog}
        />
        <DeleteConfirmModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="Delete Blog Post"
          description={`Are you sure you want to delete "${selectedBlog?.title}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
        />
      </Card>
    </div>
  )
}
