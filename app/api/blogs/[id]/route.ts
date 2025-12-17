import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = {
    _id: id,
    title: "The Future of AI in Education",
    content: "Full detailed blog content with multiple paragraphs...",
    excerpt: "Exploring how AI is transforming education",
    author: "John Doe",
    category: "Technology",
    tags: ["AI", "Education", "Future"],
    thumbnail: "/ai-education.jpg",
    status: "published",
    publishDate: "2024-12-01",
    stats: { views: 2345, likes: 234, comments: 45, shares: 67 },
    seo: {
      metaTitle: "The Future of AI in Education - Actinova Blog",
      metaDescription: "Discover how AI is revolutionizing education",
      keywords: ["AI", "education", "technology"],
    },
    createdAt: "2024-12-01",
    updatedAt: new Date().toISOString(),
  }
  return NextResponse.json({ blog })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await request.json()
  return NextResponse.json({ blog: { _id: id, ...updates }, message: "Blog updated successfully" })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ message: "Blog deleted successfully" })
}
