import { NextResponse } from "next/server"

export async function GET() {
  const settings = {
    general: {
      siteName: "Actinova AI Tutor",
      siteUrl: "https://actinova.ai",
      supportEmail: "support@actinova.ai",
      timezone: "UTC",
    },
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
  }
  return NextResponse.json({ settings })
}

export async function PATCH(request: Request) {
  const updates = await request.json()
  return NextResponse.json({ settings: updates, message: "Settings updated successfully" })
}
