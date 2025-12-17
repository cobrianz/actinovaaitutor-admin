import { NextResponse } from "next/server"
import type { Blog } from "@/lib/types"

const generateDemoBlogs = (): Blog[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    _id: `blog-${i + 1}`,
    title: `Blog Post ${i + 1}: Exploring New Horizons in ${["AI", "Education", "Technology", "Learning"][i % 4]}`,
    content: "Full blog content would go here with rich text formatting...",
    excerpt: "A brief summary of this insightful blog post covering important topics.",
    author: ["John Doe", "Jane Smith", "Alex Johnson", "Sarah Williams"][i % 4],
    category: ["Technology", "Education", "AI", "Learning"][i % 4],
    tags: [`tag-${(i % 10) + 1}`, `topic-${(i % 5) + 1}`],
    thumbnail: `/placeholder.svg?height=300&width=500&query=blog-${i}`,
    status: ["published", "draft", "scheduled"][i % 3] as any,
    publishDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    stats: {
      views: Math.floor(Math.random() * 5000) + 500,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 100) + 10,
      shares: Math.floor(Math.random() * 200) + 20,
    },
    seo: {
      metaTitle: `SEO Title for Blog ${i + 1}`,
      metaDescription: "SEO optimized description",
      keywords: ["keyword1", "keyword2"],
    },
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "all"
  const category = searchParams.get("category") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let blogs = generateDemoBlogs()

  if (search) {
    blogs = blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
  }
  if (status !== "all") {
    blogs = blogs.filter((b) => b.status === status)
  }
  if (category !== "all") {
    blogs = blogs.filter((b) => b.category === category)
  }

  const total = blogs.length
  const paginatedBlogs = blogs.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    blogs: paginatedBlogs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newBlog: Blog = {
    _id: `blog-${Date.now()}`,
    ...body,
    stats: { views: 0, likes: 0, comments: 0, shares: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ blog: newBlog, message: "Blog created successfully" })
}
