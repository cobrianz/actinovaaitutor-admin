"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import type { User } from "@/lib/types"

export function RecentUsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentUsers() {
      try {
        const response = await fetch("/api/users?limit=5")
        const data = await response.json()
        if (data.users) {
          setUsers(data.users)
        }
      } catch (error) {
        console.error("Failed to fetch recent users:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecentUsers()
  }, [])

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="py-4">
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{user.name}</span>
                        <span className="text-xs text-foreground-muted truncate md:hidden">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-foreground-muted truncate max-w-[150px] lg:max-w-[200px]">
                      {user.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-foreground-muted whitespace-nowrap">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={user.status === "active" ? "default" : user.status === "pending" ? "secondary" : "outline"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-foreground-muted">
                    No recent users
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
