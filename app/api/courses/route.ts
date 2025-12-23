import { NextResponse } from "next/server"
import type { Course } from "@/lib/types"
import { getCollection, connectToDatabase } from "@/lib/mongodb"

// GET /api/courses - Get all courses with filters from 3 sources
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const difficulty = searchParams.get("difficulty") || "all"
  const status = searchParams.get("status") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const { db } = await connectToDatabase()

    // 1. Fetch from explore_category_courses (Official)
    const categoryDocs = await db.collection("explore_category_courses").find({}).toArray()
    let allCourses: Course[] = categoryDocs.flatMap((cat: any) =>
      (cat.courses || []).map((c: any, index: number) => {
        const difficulty = (c.difficulty?.charAt(0).toUpperCase() + c.difficulty?.slice(1)) || "Intermediate"
        const courseId = c._id?.toString() || `${cat._id}-${index}`

        return {
          _id: courseId,
          title: c.title || "Untitled Course",
          description: c.description || "",
          creator: c.instructor || "System",
          difficulty: (["Beginner", "Intermediate", "Advanced"].includes(difficulty) ? difficulty : "Intermediate") as any,
          category: cat.category || cat.name || "General",
          tags: c.tags || [],
          modules: (c.modules || []).map((m: any, i: number) => ({
            id: m.id || i.toString(),
            title: m.title || "Module",
            order: m.order || i,
            content: "",
            duration: 0,
            resources: (m.lessons || []).map((lesson: string, li: number) => ({
              id: li.toString(),
              type: "article" as const,
              title: lesson,
              url: "",
            }))
          })),
          thumbnail: c.thumbnail || c.image || `/placeholder.svg?height=200&width=300&query=${c.title}`,
          status: "Published" as const,
          source: "official",
          pricing: {
            isFree: c.isPremium === false,
            price: c.price || 0,
          },
          stats: {
            avgRating: c.rating || 0,
          },
          createdDate: c.createdAt || cat.createdAt || new Date().toISOString(),
          createdAt: c.createdAt || cat.createdAt || new Date().toISOString(),
          updatedAt: c.updatedAt || cat.updatedAt || new Date().toISOString(),
        }
      })
    )

    // 2. Fetch from library (User Generated)
    const libraryDocs = await db.collection("library").find({}).toArray()

    // Resolve creator names for library courses
    const userIds = Array.from(new Set(libraryDocs.map(doc => doc.userId).filter(Boolean)))
    const usersMap: Record<string, string> = {}
    if (userIds.length > 0) {
      const creators = await db.collection("users").find({ _id: { $in: userIds } }).toArray()
      creators.forEach(u => {
        usersMap[u._id.toString()] = u.name || "User"
      })
    }

    const libraryCourses: Course[] = libraryDocs.map((doc: any) => {
      const difficulty = (doc.difficulty?.charAt(0).toUpperCase() + doc.difficulty?.slice(1)) || "Beginner"
      const courseId = doc._id.toString()

      return {
        _id: courseId,
        title: doc.title || "Untitled Library Course",
        description: doc.topic || "",
        creator: usersMap[doc.userId?.toString()] || "User",
        difficulty: (["Beginner", "Intermediate", "Advanced"].includes(difficulty) ? difficulty : "Beginner") as any,
        category: "Community",
        tags: doc.tags || [],
        modules: (doc.modules || []).map((m: any, i: number) => ({
          id: m.id || i.toString(),
          title: m.title || "Module",
          order: i,
          content: "",
          duration: 0,
          resources: (m.lessons || []).map((lesson: any, li: number) => ({
            id: lesson.id || li.toString(),
            type: "article" as const,
            title: lesson.title || "Lesson",
            url: "",
          }))
        })),
        thumbnail: `/placeholder.svg?height=200&width=300&query=${doc.title}`,
        status: "Published" as const,
        source: "community",
        pricing: {
          isFree: !doc.isPremium,
          price: 0,
        },
        stats: {
          avgRating: 4.5,
        },
        createdDate: doc.createdAt || new Date().toISOString(),
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: doc.updatedAt || new Date().toISOString(),
      }
    })
    allCourses = [...allCourses, ...libraryCourses]

    // 3. Fetch from explore_trending (Featured/Trending)
    const trendingDocs = await db.collection("explore_trending").find({}).toArray()
    const trendingCourses: Course[] = trendingDocs.flatMap((trend: any) =>
      (trend.topics || []).map((t: any, index: number) => {
        const difficulty = (t.difficulty?.charAt(0).toUpperCase() + t.difficulty?.slice(1)) || "Intermediate"
        const courseId = t._id?.toString() || `${trend._id}-${index}`

        return {
          _id: courseId,
          title: t.title || "Trending Topic",
          description: t.description || t.hook || "",
          creator: "A.I. Generated",
          difficulty: (["Beginner", "Intermediate", "Advanced"].includes(difficulty) ? difficulty : "Intermediate") as any,
          category: t.category || "Trending",
          tags: t.tags || [],
          modules: [{
            id: "0",
            title: "Course Overview",
            order: 0,
            content: t.description || "",
            duration: 0,
            resources: (t.learnerQuestions || []).map((q: any, qi: number) => ({
              id: qi.toString(),
              type: "article" as const,
              title: q.question || "FAQ",
              url: "",
            }))
          }],
          thumbnail: `/placeholder.svg?height=200&width=300&query=${t.title}`,
          status: "Published" as const,
          source: "trending",
          pricing: {
            isFree: true,
            price: 0,
          },
          stats: {
            avgRating: 5,
          },
          createdDate: trend.createdAt || new Date().toISOString(),
          createdAt: trend.createdAt || new Date().toISOString(),
          updatedAt: trend.updatedAt || new Date().toISOString(),
        }
      })
    )
    allCourses = [...allCourses, ...trendingCourses]

    // Apply global filters
    if (search) {
      allCourses = allCourses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.creator.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (difficulty !== "all") {
      allCourses = allCourses.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase())
    }

    const total = allCourses.length
    const paginatedCourses = allCourses.slice((page - 1) * limit, page * limit)

    return NextResponse.json({
      courses: paginatedCourses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching courses from MongoDB:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

// POST /api/courses - Add course to library
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const collection = await getCollection("library")

    const newDoc = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await collection.insertOne(newDoc)

    return NextResponse.json({
      course: { ...newDoc, _id: result.insertedId.toString() },
      message: "Course created in library"
    })
  } catch (error) {
    console.error("Error creating course in MongoDB:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
