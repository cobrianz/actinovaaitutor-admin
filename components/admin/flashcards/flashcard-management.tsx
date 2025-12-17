"use client"

import { useState } from "react"
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
import { Search, MoreHorizontal, Edit, Trash2, Eye, Star } from "lucide-react"
import { toast } from "sonner"
import { FlashcardDetailModal } from "@/components/admin/modals/flashcard-detail-modal"
import { FlashcardModal } from "@/components/admin/modals/flashcard-modal"
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal"

const demoFlashcards = Array.from({ length: 15 }, (_, i) => ({
  id: `flashcard-${i + 1}`,
  title: ["JavaScript Fundamentals", "React Hooks", "Python Basics", "SQL Queries", "Machine Learning Concepts"][i % 5],
  topic: ["Programming", "Web Development", "Data Science", "Database", "AI/ML"][i % 5],
  cards: Math.floor(Math.random() * 50) + 20,
  createdBy: ["AI Tutor", "Admin"][i % 2],
  usage: Math.floor(Math.random() * 500) + 100,
  rating: (Math.random() * 1.5 + 3.5).toFixed(1),
}))

export function FlashcardManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [selectedFlashcard, setSelectedFlashcard] = useState<any>(null)
  const [isFlashcardDetailModalOpen, setIsFlashcardDetailModalOpen] = useState(false)
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const filteredFlashcards = demoFlashcards.filter(
    (fc) =>
      fc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewFlashcard = (flashcard: any) => {
    setSelectedFlashcard(flashcard)
    setIsFlashcardDetailModalOpen(true)
  }

  const handleEditFlashcard = (flashcard: any) => {
    setSelectedFlashcard(flashcard)
    setIsFlashcardModalOpen(true)
  }

  const handleDeleteFlashcard = (flashcard: any) => {
    setSelectedFlashcard(flashcard)
    setIsDeleteModalOpen(true)
  }

  const handleSaveFlashcard = (flashcardData: any) => {
    toast.success(`Flashcard ${selectedFlashcard ? 'updated' : 'created'} successfully`)
  }

  const handleConfirmDelete = () => {
    toast.success(`${selectedFlashcard?.title} deleted successfully`)
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass border-border/50"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead className="text-right">Cards</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Usage</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFlashcards.map((fc) => (
              <TableRow key={fc.id}>
                <TableCell className="font-medium">{fc.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{fc.topic}</Badge>
                </TableCell>
                <TableCell className="text-right text-foreground-muted">{fc.cards}</TableCell>
                <TableCell className="text-foreground-muted">{fc.createdBy}</TableCell>
                <TableCell className="text-right text-foreground-muted">{fc.usage}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-sm font-medium">{fc.rating}</span>
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
            ))}
          </TableBody>
        </Table>
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
        description={`Are you sure you want to delete "${selectedFlashcard?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
