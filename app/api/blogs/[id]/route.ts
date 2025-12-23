import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/blogs/[id] - Get single blog post
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) })

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const formattedPost = {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      excerpt: post.summary,
      author: post.author?.name || "Unknown Author",
      category: post.category || "General",
      tags: post.tags || [],
      thumbnailUrl: post.thumbnailUrl,
      status: post.status,
      featured: post.featured || false,
      publishedAt: post.publishedAt,
      stats: {
        views: post.viewsCount || 0,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        shares: post.bookmarksCount || 0,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }

    return NextResponse.json({ blog: formattedPost })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

// PUT /api/blogs/[id] - Update blog post
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    // Only update fields that are provided
    if (body.title !== undefined) updateData.title = body.title
    if (body.summary !== undefined) updateData.summary = body.summary
    if (body.content !== undefined) updateData.content = body.content
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl
    if (body.category !== undefined) updateData.category = body.category
    if (body.featured !== undefined) updateData.featured = body.featured
    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === "published" && !updateData.publishedAt) {
        updateData.publishedAt = new Date().toISOString()
      }
    }

    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Blog post updated successfully",
      blog: { _id: id, ...updateData },
    })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

// PATCH - Alias for PUT
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return PUT(request, { params })
}

// DELETE /api/blogs/[id] - Delete blog post
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
