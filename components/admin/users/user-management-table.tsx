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
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, UserCog, Ban, CheckCircle, Download, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { UserDetailModal } from "@/components/admin/modals/user-detail-modal"
import { UserModal } from "@/components/admin/modals/user-modal"
import { DeleteConfirmModal } from "@/components/admin/modals/delete-confirm-modal"
import type { User } from "@/lib/types"

export function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Pagination
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter,
        subscription: subscriptionFilter,
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter, subscriptionFilter, page, limit])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchUsers])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((u) => u._id))
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

  const handleExportUsers = (toExport: User[]) => {
    const csvContent = [
      ["ID", "Name", "Email", "Status", "Subscription", "Last Login", "Joined Date"],
      ...toExport.map(user => [
        user._id,
        user.name,
        user.email,
        user.status,
        user.subscription.plan,
        user.stats.lastLogin,
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

  const handleViewProfile = (user: User) => {
    setSelectedUser(user)
    setIsUserDetailModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleSaveUser = async (userData: any) => {
    try {
      const method = selectedUser ? "PATCH" : "POST"
      const body = selectedUser ? { id: selectedUser._id, ...userData } : userData

      const response = await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(`User ${selectedUser ? "updated" : "created"} successfully`)
        fetchUsers()
      } else {
        toast.error("Failed to save user")
      }
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error("An error occurred while saving user")
    }
  }

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedUsers, status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Updated ${selectedUsers.length} users to ${newStatus}`)
        setSelectedUsers([])
        fetchUsers()
      }
    } catch (error) {
      toast.error("Failed to update users")
    }
  }

  const handleBulkDelete = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedUsers }),
      })

      if (response.ok) {
        toast.success(`Deleted ${selectedUsers.length} users`)
        setSelectedUsers([])
        fetchUsers()
      }
    } catch (error) {
      toast.error("Failed to delete users")
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser?._id }),
      })

      if (response.ok) {
        toast.success(`${selectedUser?.name} deleted successfully`)
        fetchUsers()
      }
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>User Overview</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-9 glass border-border/50"
            />
          </div>

          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
            <SelectTrigger className="w-[140px] glass border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={subscriptionFilter} onValueChange={(val) => { setSubscriptionFilter(val); setPage(1); }}>
            <SelectTrigger className="w-[140px] glass border-border/50">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleExportUsers(users)}
            className="glass border-border/50"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg glass-strong border border-border/50">
            <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange("active")}
                className="glass border-border/50 text-green-400"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange("inactive")}
                className="glass border-border/50 text-orange-400"
              >
                <Ban className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="glass border-border/50 text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportUsers(users.filter(u => selectedUsers.includes(u._id)))}
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
        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-sm rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={users.length > 0 && selectedUsers.length === users.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onCheckedChange={(checked) => handleSelectUser(user._id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-nowrap">{user.name}</TableCell>
                      <TableCell className="text-foreground-muted">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "default" : user.status === "pending" ? "secondary" : "outline"}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.subscription.plan}</Badge>
                      </TableCell>
                      <TableCell className="text-foreground-muted text-nowrap">
                        {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-foreground-muted text-nowrap">
                        {new Date(user.stats.lastLogin).toLocaleDateString()}
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
                  ))
                ) : !loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-foreground-muted">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-foreground-muted">
          <span>
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} users
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="glass border-border/50 bg-transparent"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="glass border-border/50 bg-transparent"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      <UserDetailModal
        isOpen={isUserDetailModalOpen}
        onClose={() => setIsUserDetailModalOpen(false)}
        user={selectedUser}
        onEdit={() => {
          setIsUserDetailModalOpen(false)
          setIsUserModalOpen(true)
        }}
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
