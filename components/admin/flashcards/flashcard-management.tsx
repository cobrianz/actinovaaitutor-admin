"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Search, MoreHorizontal, Edit, Trash2, Eye, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { FlashcardDetailModal } from "@/components/admin/modals/flashcard-detail-modal"
import { FlashcardModal } from "@/components/admin/modals/flashcard-modal"
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal"
import type { Flashcard } from "@/lib/types"

export function FlashcardManagement() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  // Modal states
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null)
  const [isFlashcardDetailModalOpen, setIsFlashcardDetailModalOpen] = useState(false)
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const fetchFlashcards = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/flashcards?${params}`)
      const data = await response.json()
      if (data.flashcards) {
        setFlashcards(data.flashcards)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error("Failed to fetch flashcards:", error)
      toast.error("Failed to load flashcard sets")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, page])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFlashcards()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchFlashcards])

  const handleViewFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard)
    setIsFlashcardDetailModalOpen(true)
  }

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard)
    setIsFlashcardModalOpen(true)
  }

  const handleDeleteFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard)
    setIsDeleteModalOpen(true)
  }

  const handleSaveFlashcard = async (flashcardData: any) => {
    try {
      const isEdit = !!flashcardData._id
      const url = isEdit ? `/api/flashcards/${flashcardData._id}` : "/api/flashcards"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flashcardData),
      })

      if (!response.ok) throw new Error("Failed to save flashcard")

      toast.success(`Flashcard set ${isEdit ? 'updated' : 'created'} successfully`)
      fetchFlashcards()
    } catch (error) {
      console.error("Error saving flashcard:", error)
      toast.error("Failed to save flashcard set")
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedFlashcard) return

    try {
      const response = await fetch(`/api/flashcards/${selectedFlashcard._id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete flashcard")

      toast.success("Flashcard set deleted successfully")
      fetchFlashcards()
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting flashcard:", error)
      toast.error("Failed to delete flashcard set")
    }
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Flashcard Sets Overview</CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search flashcard sets..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-9 glass border-border/50"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead className="text-right">Cards</TableHead>
                  <TableHead className="text-right">Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flashcards.length > 0 ? (
                  flashcards.map((fc) => (
                    <TableRow key={fc._id}>
                      <TableCell className="font-medium truncate max-w-[250px]">{fc.title || fc.question}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{fc.topic || fc.category}</Badge>
                      </TableCell>
                      <TableCell className="text-foreground-muted">{fc.creator || fc.createdBy}</TableCell>
                      <TableCell className="text-right text-foreground-muted">{fc.totalCards || fc.stats?.views || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-sm font-medium">{fc.difficulty || "N/A"}</span>
                        </div>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewFlashcard(fc)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditFlashcard(fc)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Set
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteFlashcard(fc)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-foreground-muted">
                      No flashcard sets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {total > limit && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-foreground-muted">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} sets
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * limit >= total}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Modals */}
      <FlashcardDetailModal
        isOpen={isFlashcardDetailModalOpen}
        onClose={() => setIsFlashcardDetailModalOpen(false)}
        flashcard={selectedFlashcard}
      />
      <FlashcardModal
        open={isFlashcardModalOpen}
        onOpenChange={setIsFlashcardModalOpen}
        flashcard={selectedFlashcard}
        onSave={handleSaveFlashcard}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Flashcard Set"
        description={`Are you sure you want to delete this test? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
