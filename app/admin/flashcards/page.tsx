import { FlashcardManagement } from "@/components/admin/flashcards/flashcard-management"
import { FlashcardAnalytics } from "@/components/admin/flashcards/flashcard-analytics"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flashcard Management - Actinova Admin",
  description: "Manage flashcard sets and study analytics",
}

export default function FlashcardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Flashcard Management</h1>
          <p className="text-foreground-muted mt-1">Manage flashcard sets, topics, and study patterns</p>
        </div>
      </div>

      <FlashcardAnalytics />
      <FlashcardManagement />
    </div>
  )
}
