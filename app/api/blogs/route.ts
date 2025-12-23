import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/blogs - Get all blog posts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "all"
  const featured = searchParams.get("featured") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const { db } = await connectToDatabase()

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (status !== "all") {
      query.status = status
    }

    if (featured === "true") {
      query.featured = true
    } else if (featured === "false") {
      query.featured = false
    }

    // Get total count
    const total = await db.collection("posts").countDocuments(query)

    // Get paginated results
    const posts = await db.collection("posts")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Format response
    const formattedPosts = posts.map(post => ({
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
    }))

    return NextResponse.json({
      blogs: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

// POST /api/blogs - Create new blog post
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    const newPost = {
      title: body.title,
      slug: `${slug}-${Date.now()}`,
      summary: body.summary || "",
      content: body.content || "",
      tags: body.tags || [],
      thumbnailUrl: body.thumbnailUrl || null,
      author: {
        name: body.authorName || "Admin",
        role: "admin",
        avatar: null,
      },
      featured: body.featured || false,
      period: "monthly",
      periodKey: new Date().toISOString().slice(0, 7),
      likesCount: 0,
      bookmarksCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      publishedAt: body.status === "published" ? new Date().toISOString() : null,
      status: body.status || "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("posts").insertOne(newPost)

    return NextResponse.json({
      blog: { ...newPost, _id: result.insertedId.toString() },
      message: "Blog post created successfully",
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
