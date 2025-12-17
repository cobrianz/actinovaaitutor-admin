import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { demoRecentUsers } from "@/lib/demo-data"

export function RecentUsersTable() {
  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
      </CardHeader>
      <CardContent>
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
            {demoRecentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-foreground-muted">{user.email}</TableCell>
                <TableCell className="text-foreground-muted">{user.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : user.status === "pending" ? "secondary" : "outline"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
