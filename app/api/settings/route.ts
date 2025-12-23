import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Default settings structure
const defaultSettings = {
  // General
  siteName: "Actinova AI Tutor",
  siteUrl: "https://actinova.ai",
  supportEmail: "support@actinova.ai",
  defaultLanguage: "en",
  timezone: "UTC",

  // Platform
  maintenanceMode: false,
  userRegistration: true,
  emailNotifications: true,

  // API Configuration
  rateLimit: 100,
  maxRequestsPerUser: 1000,
  apiLogging: true,
  rateLimiting: true,

  // Pricing
  basicPrice: 29.99,
  proPrice: 49.99,
  enterprisePrice: 99.99,
  freeTrialEnabled: true,

  // Notifications
  pushNotifications: false,
  weeklyReports: true,
  securityAlerts: true,

  // Security
  twoFactorAuth: false,
  sessionTimeout: "30",
  passwordExpiry: "90",

  // Appearance
  theme: "system",
  compactMode: false,
  animations: true,

  // System
  debugMode: false,
  cacheEnabled: true,

  // Integrations
  email: {
    provider: "SendGrid",
    fromEmail: "noreply@actinova.ai",
    fromName: "Actinova",
  },
  integrations: {
    stripe: { enabled: true, mode: "test" },
    openai: { enabled: true, model: "gpt-4" },
  },
  features: {
    aiTutor: true,
    courseGeneration: true,
    flashcards: true,
    quizzes: true,
  },

  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString()
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Try to get settings from database
    let settings = await db.collection("settings").findOne({ type: "platform" })

    // If no settings exist, create default settings
    if (!settings) {
      await db.collection("settings").insertOne({
        type: "platform",
        ...defaultSettings
      })
      settings = { ...defaultSettings }
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Update settings
    await db.collection("settings").updateOne(
      { type: "platform" },
      {
        $set: {
          ...body,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    )

    // Get updated settings
    const settings = await db.collection("settings").findOne({ type: "platform" })

    return NextResponse.json({
      success: true,
      settings,
      message: "Settings updated successfully"
    })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

// Keep PATCH for backward compatibility
export async function PATCH(request: Request) {
  return PUT(request)
}
