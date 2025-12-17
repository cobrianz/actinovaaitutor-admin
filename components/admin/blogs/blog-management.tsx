"use client"

import { useState } from "react"
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
import { Search, MoreHorizontal, Edit, Trash2, Eye, MessageSquare, Star } from "lucide-react"
import { toast } from "sonner"
import { BlogDetailModal } from "@/components/admin/modals/blog-detail-modal"
import { BlogModal } from "@/components/admin/modals/blog-modal"
import { BlogCommentsModal } from "@/components/admin/modals/blog-comments-modal"
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
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [selectedBlog, setSelectedBlog] = useState<any>(null)
  const [isBlogDetailModalOpen, setIsBlogDetailModalOpen] = useState(false)
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false)
  const [isBlogCommentsModalOpen, setIsBlogCommentsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const filteredPosts = demoPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewBlog = (blog: any) => {
    setSelectedBlog(blog)
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

  const handleManageComments = (blog: any) => {
    setSelectedBlog(blog)
    setIsBlogCommentsModalOpen(true)
  }

  const handleDeleteBlog = (blog: any) => {
    setSelectedBlog(blog)
    setIsDeleteModalOpen(true)
  }

  const handleSaveBlog = (blogData: any) => {
    toast.success(`Blog post ${selectedBlog ? 'updated' : 'created'} successfully`)
  }

  const handleConfirmDelete = () => {
    toast.success(`${selectedBlog?.title} deleted successfully`)
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Blog Posts</CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="text-foreground-muted">{post.author}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === "Published" ? "default" : post.status === "Draft" ? "secondary" : "outline"
                    }
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-foreground-muted">{post.views}</TableCell>
                <TableCell className="text-right text-foreground-muted">{post.likes}</TableCell>
                <TableCell className="text-right text-foreground-muted">{post.comments}</TableCell>
                <TableCell className="text-foreground-muted">{post.date}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleManageComments(post)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Manage Comments
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success(`${post.title} featured`)}>
                        <Star className="h-4 w-4 mr-2" />
                        Feature Post
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
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Modals */}
      <BlogDetailModal
        isOpen={isBlogDetailModalOpen}
        onClose={() => setIsBlogDetailModalOpen(false)}
        blog={selectedBlog}
      />
      <BlogModal
        open={isBlogModalOpen}
        onOpenChange={setIsBlogModalOpen}
        blog={selectedBlog}
        onSave={handleSaveBlog}
      />
      <BlogCommentsModal
        isOpen={isBlogCommentsModalOpen}
        onClose={() => setIsBlogCommentsModalOpen(false)}
        blog={selectedBlog}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${selectedBlog?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
