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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-foreground-muted">{user.email}</TableCell>
                    <TableCell className="text-foreground-muted">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
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
