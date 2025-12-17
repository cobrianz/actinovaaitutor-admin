// Demo data for the admin dashboard (to be replaced with real API calls)

export const demoMetrics = {
  totalUsers: 15234,
  activeUsers: 12456,
  inactiveUsers: 2778,
  totalCourses: 456,
  totalRevenue: {
    monthly: 45678,
    yearly: 548136,
  },
  activeSubscriptions: 8934,
  dau: 3456,
  mau: 12456,
  courseCompletionRate: 67.8,
  avgSessionDuration: 42.5, // minutes
  totalVisitorsThisMonth: 45678,
}

export const demoUserGrowth = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  users: Math.floor(Math.random() * 200) + 100,
}))

export const demoRevenueDistribution = [
  { name: "Basic", value: 30, revenue: 15000 },
  { name: "Pro", value: 45, revenue: 35000 },
  { name: "Enterprise", value: 25, revenue: 50000 },
]

export const demoRecentUsers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    date: "2025-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    date: "2025-01-15",
    status: "active",
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    date: "2025-01-14",
    status: "pending",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    date: "2025-01-14",
    status: "active",
  },
  {
    id: "5",
    name: "Emma Davis",
    email: "emma@example.com",
    date: "2025-01-13",
    status: "inactive",
  },
]

export const demoTopCourses = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    enrollments: 1234,
    completion: 78,
    rating: 4.8,
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    enrollments: 987,
    completion: 82,
    rating: 4.9,
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    enrollments: 856,
    completion: 65,
    rating: 4.7,
  },
  {
    id: "4",
    title: "Cloud Architecture with AWS",
    enrollments: 743,
    completion: 71,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Full Stack Development",
    enrollments: 689,
    completion: 68,
    rating: 4.8,
  },
]

export const demoUsers = Array.from({ length: 25 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: [
    "Alice Johnson",
    "Bob Smith",
    "Carol Williams",
    "David Brown",
    "Emma Davis",
    "Frank Miller",
    "Grace Wilson",
    "Henry Moore",
    "Iris Taylor",
    "Jack Anderson",
  ][i % 10],
  email: `user${i + 1}@example.com`,
  status: ["active", "inactive", "pending"][i % 3] as "active" | "inactive" | "pending",
  subscription: ["Basic", "Pro", "Enterprise", "Free"][i % 4] as "Basic" | "Pro" | "Enterprise" | "Free",
  lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
}))

export const demoRegistrationTrends = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  users: Math.floor(Math.random() * 500) + 800,
}))

export const demoSubscriptionDistribution = [
  { name: "Free", value: 35, users: 5320 },
  { name: "Basic", value: 30, users: 4560 },
  { name: "Pro", value: 25, users: 3800 },
  { name: "Enterprise", value: 10, users: 1520 },
]

export const demoGeographicDistribution = [
  { name: "North America", value: 40, users: 6093 },
  { name: "Europe", value: 30, users: 4570 },
  { name: "Asia", value: 20, users: 3047 },
  { name: "Others", value: 10, users: 1523 },
]

export const demoRetentionCurve = Array.from({ length: 12 }, (_, i) => ({
  week: `Week ${i + 1}`,
  retention: Math.max(100 - i * 8 - Math.random() * 5, 20),
}))

export const demoCourses = Array.from({ length: 20 }, (_, i) => ({
  id: `course-${i + 1}`,
  title: [
    "Introduction to Machine Learning",
    "Advanced React Patterns",
    "Data Structures & Algorithms",
    "Cloud Architecture with AWS",
    "Full Stack Development",
    "Python for Data Science",
    "UI/UX Design Fundamentals",
    "Mobile App Development",
    "Cybersecurity Basics",
    "DevOps Engineering",
  ][i % 10],
  creator: ["AI Tutor", "John Doe", "Jane Smith", "Dr. Williams"][i % 4],
  difficulty: ["Beginner", "Intermediate", "Advanced"][i % 3] as "Beginner" | "Intermediate" | "Advanced",
  modules: Math.floor(Math.random() * 15) + 5,
  enrollments: Math.floor(Math.random() * 2000) + 500,
  rating: (Math.random() * 1.5 + 3.5).toFixed(1),
  status: ["Published", "Draft", "Archived"][i % 3] as "Published" | "Draft" | "Archived",
  createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
}))

export const demoGenerationTrends = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  courses: Math.floor(Math.random() * 50) + 20,
}))

export const demoDifficultyDistribution = [
  { name: "Beginner", value: 45, courses: 205 },
  { name: "Intermediate", value: 35, courses: 160 },
  { name: "Advanced", value: 20, courses: 91 },
]

export const demoEnrollmentAnalytics = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  enrollments: Math.floor(Math.random() * 100) + 50,
}))

export const demoCompletionVsDifficulty = [
  { difficulty: "Beginner", completion: 78, enrollments: 2500 },
  { difficulty: "Intermediate", completion: 65, enrollments: 1800 },
  { difficulty: "Advanced", completion: 52, enrollments: 1200 },
]

export const demoCoursePerformance = Array.from({ length: 10 }, (_, i) => ({
  id: `perf-${i + 1}`,
  course: [
    "Introduction to Machine Learning",
    "Advanced React Patterns",
    "Data Structures & Algorithms",
    "Cloud Architecture with AWS",
    "Full Stack Development",
  ][i % 5],
  students: Math.floor(Math.random() * 500) + 200,
  completions: Math.floor(Math.random() * 300) + 100,
  avgScore: Math.floor(Math.random() * 20) + 75,
  feedback: (Math.random() * 1 + 4).toFixed(1),
}))
