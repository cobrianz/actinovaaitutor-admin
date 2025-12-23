"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, MessageSquare, CheckCircle, Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ContactDetailModal } from "@/components/admin/modals/contact-detail-modal"
import { ContactResponseModal } from "@/components/admin/modals/contact-response-modal"
import type { Contact } from "@/lib/types"

export function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  // Modal states
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isContactDetailModalOpen, setIsContactDetailModalOpen] = useState(false)
  const [isContactResponseModalOpen, setIsContactResponseModalOpen] = useState(false)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/contacts?${params}`)
      const data = await response.json()
      if (data.contacts) {
        setContacts(data.contacts)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
      toast.error("Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter, page])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchContacts])

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsContactDetailModalOpen(true)
  }

  const handleRespondContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsContactResponseModalOpen(true)
  }

  const updateStatus = async (contact: Contact, status: string) => {
    try {
      const response = await fetch(`/api/contacts/${contact._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success(`Contact marked as ${status}`)
        fetchContacts()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      toast.error("Error updating status")
    }
  }

  const handleMarkResolved = (contact: Contact) => {
    updateStatus(contact, 'resolved')
  }

  const handleDeleteContact = async (contact: Contact) => {
    if (!confirm(`Are you sure you want to delete the message from ${contact.name}?`)) return

    try {
      const response = await fetch(`/api/contacts/${contact._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Contact deleted successfully")
        fetchContacts()
      } else {
        toast.error("Failed to delete contact")
      }
    } catch (error) {
      toast.error("Error deleting contact")
    }
  }

  const handleMarkInProgress = (contact: Contact) => {
    updateStatus(contact, 'in-progress')
  }

  const handleStatusChange = (status: string) => {
    toast.success(`Contact status updated to ${status}`)
    fetchContacts()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "default" // or a specific green variant if available
      case "in-progress":
        return "secondary" // or yellow/warning
      case "new":
        return "outline" // or blue
      default:
        return "outline"
    }
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Contact Submissions</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-9 glass border-border/50"
            />
          </div>

          <Select value={statusFilter} onValueChange={(val) => {
            setStatusFilter(val)
            setPage(1)
          }}>
            <SelectTrigger className="w-[140px] glass border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell className="text-foreground-muted">{contact.email}</TableCell>
                      <TableCell className="text-foreground-muted truncate max-w-[200px]">{contact.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{contact.category || "General"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize"
                          variant={getStatusColor(contact.status)}
                        >
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground-muted">
                        {new Date(contact.createdAt).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRespondContact(contact)}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Respond
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkInProgress(contact)}>
                              <Loader2 className="h-4 w-4 mr-2" />
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkResolved(contact)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteContact(contact)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Contact
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-foreground-muted">
                      No contacts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {total > limit && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-foreground-muted">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} contacts
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
      <ContactDetailModal
        open={isContactDetailModalOpen}
        onOpenChange={setIsContactDetailModalOpen}
        contact={selectedContact}
        onStatusChange={handleStatusChange}
      />
      <ContactResponseModal
        isOpen={isContactResponseModalOpen}
        onClose={() => setIsContactResponseModalOpen(false)}
        contact={selectedContact}
      />
    </Card>
  )
}
