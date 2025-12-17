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
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, UserCog, Ban, CheckCircle, Download, Trash2 } from "lucide-react"
import { demoUsers } from "@/lib/demo-data"
import { toast } from "sonner"
import { UserDetailModal } from "@/components/admin/modals/user-detail-modal"
import { UserModal } from "@/components/admin/modals/user-modal"
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal"

export function UserManagementTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Modal states
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const filteredUsers = demoUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesSubscription = subscriptionFilter === "all" || user.subscription === subscriptionFilter
    return matchesSearch && matchesStatus && matchesSubscription
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((u) => u.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleBulkAction = (action: string) => {
    if (action === "Export") {
      handleExportUsers(selectedUsers.length > 0 ? demoUsers.filter(u => selectedUsers.includes(u.id)) : demoUsers)
    } else {
      toast.success(`${action} applied to ${selectedUsers.length} users`)
    }
    setSelectedUsers([])
  }

  const handleExportUsers = (users: any[]) => {
    const csvContent = [
      ["ID", "Name", "Email", "Status", "Subscription", "Last Login", "Joined Date"],
      ...users.map(user => [
        user.id,
        user.name,
        user.email,
        user.status,
        user.subscription,
        user.lastLogin,
        user.joinedDate
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "users_export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("User data exported successfully")
  }

  const handleViewProfile = (user: any) => {
    setSelectedUser(user)
    setIsUserDetailModalOpen(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleSaveUser = (userData: any) => {
    toast.success(`User ${selectedUser ? 'updated' : 'created'} successfully`)
  }

  const handleConfirmDelete = () => {
    toast.success(`${selectedUser?.name} deleted successfully`)
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>User Overview</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass border-border/50"
            />
          </div>

          {/* Filters */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] glass border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger className="w-[140px] glass border-border/50">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleExportUsers(demoUsers)}
            className="glass border-border/50"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg glass-strong border border-border/50">
            <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("Activate")}
                className="glass border-border/50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("Deactivate")}
                className="glass border-border/50"
              >
                <Ban className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("Export")}
                className="glass border-border/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.slice(0, 10).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-foreground-muted">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : user.status === "pending" ? "secondary" : "outline"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.subscription}</Badge>
                </TableCell>
                <TableCell className="text-foreground-muted">{user.lastLogin}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                        <UserCog className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Info */}
        <div className="flex items-center justify-between mt-4 text-sm text-foreground-muted">
          <span>
            Showing {Math.min(10, filteredUsers.length)} of {filteredUsers.length} users
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="glass border-border/50 bg-transparent">
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filteredUsers.length <= 10}
              className="glass border-border/50 bg-transparent"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Modals */}
      <UserDetailModal
        isOpen={isUserDetailModalOpen}
        onClose={() => setIsUserDetailModalOpen(false)}
        user={selectedUser}
      />
      <UserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
