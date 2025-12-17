import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, UserCheck, TrendingUp, Activity, Clock, Eye } from "lucide-react"
import { demoMetrics } from "@/lib/demo-data"

const metrics = [
  {
    title: "Total Users",
    value: demoMetrics.totalUsers.toLocaleString(),
    subtitle: `${demoMetrics.activeUsers.toLocaleString()} active, ${demoMetrics.inactiveUsers.toLocaleString()} inactive`,
    icon: Users,
    trend: "+12.5%",
    color: "blue",
  },
  {
    title: "Total Courses",
    value: demoMetrics.totalCourses.toLocaleString(),
    subtitle: "Available courses",
    icon: BookOpen,
    trend: "+8.2%",
    color: "purple",
  },
  {
    title: "Total Revenue",
    value: `$${(demoMetrics.totalRevenue.monthly / 1000).toFixed(1)}K`,
    subtitle: `$${(demoMetrics.totalRevenue.yearly / 1000).toFixed(0)}K yearly`,
    icon: DollarSign,
    trend: "+23.1%",
    color: "green",
  },
  {
    title: "Active Subscriptions",
    value: demoMetrics.activeSubscriptions.toLocaleString(),
    subtitle: "Current subscribers",
    icon: UserCheck,
    trend: "+15.3%",
    color: "blue",
  },
  {
    title: "DAU / MAU",
    value: `${demoMetrics.dau.toLocaleString()} / ${demoMetrics.mau.toLocaleString()}`,
    subtitle: "Daily / Monthly active",
    icon: Activity,
    trend: "+7.8%",
    color: "purple",
  },
  {
    title: "Completion Rate",
    value: `${demoMetrics.courseCompletionRate}%`,
    subtitle: "Course completion",
    icon: TrendingUp,
    trend: "+4.2%",
    color: "green",
  },
  {
    title: "Avg Session Duration",
    value: `${demoMetrics.avgSessionDuration} min`,
    subtitle: "Average time spent",
    icon: Clock,
    trend: "+9.5%",
    color: "blue",
  },
  {
    title: "Total Visitors This Month",
    value: demoMetrics.totalVisitorsThisMonth.toLocaleString(),
    subtitle: "Website visitors",
    icon: Eye,
    trend: "+18.7%",
    color: "purple",
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className={`glass-${metric.color} border-border/50`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{metric.value}</div>
            <p className="text-xs text-foreground-muted mt-1">{metric.subtitle}</p>
            <p className="text-xs text-primary font-medium mt-2">{metric.trend} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
