"use client"

import { useState } from "react"
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
import { Search, MoreHorizontal, Eye, MessageSquare, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { ContactDetailModal } from "@/components/admin/modals/contact-detail-modal"
import { ContactResponseModal } from "@/components/admin/modals/contact-response-modal"

const demoContacts = Array.from({ length: 20 }, (_, i) => ({
  id: `contact-${i + 1}`,
  name: ["Alice Johnson", "Bob Smith", "Carol Williams", "David Brown", "Emma Davis"][i % 5],
  email: `user${i + 1}@example.com`,
  subject: ["Account Help", "Feature Request", "Technical Issue", "General Inquiry", "Feedback"][i % 5],
  category: ["Support", "Sales", "Technical", "Feedback", "General"][i % 5] as
    | "Support"
    | "Sales"
    | "Technical"
    | "Feedback"
    | "General",
  status: ["New", "In Progress", "Resolved"][i % 3] as "New" | "In Progress" | "Resolved",
  submitted: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  responseTime: i % 3 === 2 ? `${Math.floor(Math.random() * 24) + 1}h` : "-",
}))

export function ContactsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Modal states
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isContactDetailModalOpen, setIsContactDetailModalOpen] = useState(false)
  const [isContactResponseModalOpen, setIsContactResponseModalOpen] = useState(false)

  const filteredContacts = demoContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    const matchesCategory = categoryFilter === "all" || contact.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact)
    setIsContactDetailModalOpen(true)
  }

  const handleRespondContact = (contact: any) => {
    setSelectedContact(contact)
    setIsContactResponseModalOpen(true)
  }

  const handleMarkResolved = (contact: any) => {
    toast.success(`${contact.name}'s request marked as resolved`)
  }

  const handleSendResponse = (response: string) => {
    toast.success("Response sent successfully")
  }

  const handleStatusChange = (status: string) => {
    toast.success(`Contact status updated to ${status}`)
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass border-border/50"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] glass border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] glass border-border/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Feedback">Feedback</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Response Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.slice(0, 10).map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="text-foreground-muted">{contact.email}</TableCell>
                <TableCell className="text-foreground-muted">{contact.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline">{contact.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      contact.status === "Resolved"
                        ? "default"
                        : contact.status === "In Progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground-muted">{contact.submitted}</TableCell>
                <TableCell className="text-right text-foreground-muted">{contact.responseTime}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleMarkResolved(contact)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
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
