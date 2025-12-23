import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()

        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

        // ===== USER ANALYTICS =====
        const totalUsers = await db.collection("users").countDocuments()
        const newUsersLast7Days = await db.collection("users").countDocuments({
            createdAt: { $gte: sevenDaysAgo.toISOString() }
        })
        const newUsersLast30Days = await db.collection("users").countDocuments({
            createdAt: { $gte: thirtyDaysAgo.toISOString() }
        })
        const activeSubscriptions = await db.collection("users").countDocuments({
            "subscription.status": "active"
        })

        // User growth trend (last 90 days)
        const userGrowthTrend = await db.collection("users").aggregate([
            {
                $match: {
                    $or: [
                        { createdAt: { $gte: ninetyDaysAgo.toISOString() } },
                        { createdAt: { $gte: ninetyDaysAgo } }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $cond: [
                                    { $eq: [{ $type: "$createdAt" }, "string"] },
                                    { $dateFromString: { dateString: "$createdAt" } },
                                    "$createdAt"
                                ]
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 90 }
        ]).toArray()

        // Subscription distribution
        const subscriptionDistribution = await db.collection("users").aggregate([
            {
                $group: {
                    _id: "$subscription.plan",
                    count: { $sum: 1 }
                }
            }
        ]).toArray()

        // ===== CONTENT ANALYTICS =====
        const totalPosts = await db.collection("posts").countDocuments()

        // Count courses from all 3 sources (matching /api/courses logic)
        // 1. Official courses from explore_category_courses
        const categoryDocs = await db.collection("explore_category_courses").find({}).toArray()
        const officialCoursesCount = categoryDocs.reduce((sum, cat) => sum + (cat.courses?.length || 0), 0)

        // 2. User-generated courses from library
        const libraryCoursesCount = await db.collection("library").countDocuments()

        // 3. Trending courses from explore_trending
        const trendingDocs = await db.collection("explore_trending").find({}).toArray()
        const trendingCoursesCount = trendingDocs.reduce((sum, doc) => sum + (doc.courses?.length || 0), 0)

        // Total courses from all sources
        const totalCourses = officialCoursesCount + libraryCoursesCount + trendingCoursesCount

        const totalFlashcards = await db.collection("cardSets").countDocuments()
        const totalTests = await db.collection("tests").countDocuments()

        // Content creation trends (last 30 days)
        const contentCreationTrend = await db.collection("posts").aggregate([
            {
                $match: {
                    $or: [
                        { createdAt: { $gte: thirtyDaysAgo.toISOString() } },
                        { createdAt: { $gte: thirtyDaysAgo } }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $cond: [
                                    { $eq: [{ $type: "$createdAt" }, "string"] },
                                    { $dateFromString: { dateString: "$createdAt" } },
                                    "$createdAt"
                                ]
                            }
                        }
                    },
                    posts: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray()

        // Content by category
        const contentByCategory = await db.collection("posts").aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray()

        // ===== ENGAGEMENT ANALYTICS =====
        const totalComments = await db.collection("comments").countDocuments()
        const totalInteractions = await db.collection("interactions").countDocuments()
        const totalChats = await db.collection("chats").countDocuments()

        // Engagement trend (last 30 days)
        const engagementTrend = await db.collection("interactions").aggregate([
            {
                $match: {
                    $or: [
                        { createdAt: { $gte: thirtyDaysAgo.toISOString() } },
                        { createdAt: { $gte: thirtyDaysAgo } }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $cond: [
                                    { $eq: [{ $type: "$createdAt" }, "string"] },
                                    { $dateFromString: { dateString: "$createdAt" } },
                                    "$createdAt"
                                ]
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray()

        // Comments trend (last 30 days)
        const commentsTrend = await db.collection("comments").aggregate([
            {
                $match: {
                    $or: [
                        { createdAt: { $gte: thirtyDaysAgo.toISOString() } },
                        { createdAt: { $gte: thirtyDaysAgo } }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $cond: [
                                    { $eq: [{ $type: "$createdAt" }, "string"] },
                                    { $dateFromString: { dateString: "$createdAt" } },
                                    "$createdAt"
                                ]
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray()

        // ===== CONTACT ANALYTICS =====
        const totalContacts = await db.collection("contacts").countDocuments()
        const unresolvedContacts = await db.collection("contacts").countDocuments({
            status: { $ne: "resolved" }
        })
        const newContactsLast7Days = await db.collection("contacts").countDocuments({
            createdAt: { $gte: sevenDaysAgo.toISOString() }
        })

        // Contact status distribution
        const contactStatusDistribution = await db.collection("contacts").aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]).toArray()

        // ===== LEARNING ANALYTICS =====
        // Flashcard sets by subject
        const flashcardsBySubject = await db.collection("cardSets").aggregate([
            {
                $group: {
                    _id: "$subject",
                    count: { $sum: 1 },
                    totalCards: { $sum: { $size: { $ifNull: ["$cards", []] } } }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray()

        // Tests by difficulty
        const testsByDifficulty = await db.collection("tests").aggregate([
            {
                $group: {
                    _id: "$difficulty",
                    count: { $sum: 1 }
                }
            }
        ]).toArray()

        // ===== AI CHAT ANALYTICS =====
        const chatSessionsLast30Days = await db.collection("chats").countDocuments({
            createdAt: { $gte: thirtyDaysAgo.toISOString() }
        })

        // Chat sessions trend
        const chatTrend = await db.collection("chats").aggregate([
            {
                $match: {
                    $or: [
                        { createdAt: { $gte: thirtyDaysAgo.toISOString() } },
                        { createdAt: { $gte: thirtyDaysAgo } }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $cond: [
                                    { $eq: [{ $type: "$createdAt" }, "string"] },
                                    { $dateFromString: { dateString: "$createdAt" } },
                                    "$createdAt"
                                ]
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray()

        // ===== TOP PERFORMERS =====
        // Most active users (by interactions)
        const topActiveUsers = await db.collection("interactions").aggregate([
            {
                $group: {
                    _id: "$userId",
                    interactions: { $sum: 1 }
                }
            },
            { $sort: { interactions: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
        ]).toArray()

        // Most commented posts
        const topCommentedPosts = await db.collection("comments").aggregate([
            {
                $group: {
                    _id: "$postId",
                    commentCount: { $sum: 1 }
                }
            },
            { $sort: { commentCount: -1 } },
            { $limit: 10 }
        ]).toArray()

        return NextResponse.json({
            metrics: {
                // User metrics
                totalUsers,
                newUsersLast7Days,
                newUsersLast30Days,
                activeSubscriptions,

                // Content metrics
                totalPosts,
                totalCourses,
                totalFlashcards,
                totalTests,

                // Engagement metrics
                totalComments,
                totalInteractions,
                totalChats,
                chatSessionsLast30Days,

                // Contact metrics
                totalContacts,
                unresolvedContacts,
                newContactsLast7Days,
            },
            trends: {
                userGrowth: userGrowthTrend.map(item => ({
                    date: item._id,
                    count: item.count
                })),
                subscriptionDistribution: subscriptionDistribution.map(item => ({
                    plan: item._id || "Free",
                    count: item.count
                })),
                contentCreation: contentCreationTrend.map(item => ({
                    date: item._id,
                    posts: item.posts
                })),
                engagement: engagementTrend.map(item => ({
                    date: item._id,
                    count: item.count
                })),
                comments: commentsTrend.map(item => ({
                    date: item._id,
                    count: item.count
                })),
                chats: chatTrend.map(item => ({
                    date: item._id,
                    count: item.count
                })),
            },
            distributions: {
                contentByCategory: contentByCategory.map(item => ({
                    category: item._id || "Uncategorized",
                    count: item.count
                })),
                contactStatus: contactStatusDistribution.map(item => ({
                    status: item._id || "pending",
                    count: item.count
                })),
                flashcardsBySubject: flashcardsBySubject.map(item => ({
                    subject: item._id || "General",
                    count: item.count,
                    totalCards: item.totalCards
                })),
                testsByDifficulty: testsByDifficulty.map(item => ({
                    difficulty: item._id || "medium",
                    count: item.count
                })),
            },
            topPerformers: {
                activeUsers: topActiveUsers.map(item => ({
                    userId: item._id,
                    name: item.user?.name || "Unknown User",
                    email: item.user?.email || "",
                    interactions: item.interactions
                })),
                commentedPosts: topCommentedPosts.map(item => ({
                    postId: item._id,
                    comments: item.commentCount
                })),
            }
        })
    } catch (error) {
        console.error("Failed to fetch comprehensive analytics:", error)
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }
}
