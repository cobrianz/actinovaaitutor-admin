import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star } from "lucide-react"
import { demoTopCourses } from "@/lib/demo-data"

export function TopCoursesTable() {
  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle>Top Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Title</TableHead>
              <TableHead className="text-right">Enrollments</TableHead>
              <TableHead className="text-right">Completion</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoTopCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell className="text-right text-foreground-muted">{course.enrollments}</TableCell>
                <TableCell className="text-right text-foreground-muted">{course.completion}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
