// MongoDB Types (for reference - using demo data for preview)
export interface Admin {
  _id: string
  name: string
  email: string
  phone: string
  password: string
  secretKey1: string
  secretKey2: string
  isVerified: boolean
  verificationCode?: string
  verificationExpires?: string
  resetToken?: string
  resetExpires?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  password?: string
  status: "active" | "inactive" | "pending" | "suspended"
  subscription: {
    plan: "Free" | "Basic" | "Pro" | "Enterprise"
    startDate: string
    endDate?: string
    status: "active" | "cancelled" | "expired"
  }
  profile: {
    avatar?: string
    bio?: string
    country?: string
    timezone?: string
    language?: string
  }
  stats: {
    coursesEnrolled: number
    coursesCompleted: number
    totalStudyTime: number // minutes
    lastLogin: string
  }
  joinedDate: string
  createdAt: string
  updatedAt: string
}

export interface Course {
  _id: string
  title: string
  description: string
  creator: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  tags: string[]
  modules: Module[]
  thumbnail?: string
  status: "Published" | "Draft" | "Archived"
  pricing: {
    isFree: boolean
    price?: number
  }
  stats: {
    enrollments: number
    completions: number
    avgRating: number
    totalReviews: number
  }
  createdDate: string
  createdAt: string
  updatedAt: string
}

export interface Module {
  id: string
  title: string
  order: number
  content: string
  duration: number
  resources: Resource[]
}

export interface Resource {
  id: string
  type: "video" | "article" | "quiz" | "assignment"
  title: string
  url?: string
}

export interface Flashcard {
  _id: string
  question: string
  answer: string
  course: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  category: string
  stats: {
    views: number
    correct: number
    incorrect: number
    avgResponseTime: number
  }
  createdBy: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Quiz {
  _id: string
  title: string
  description: string
  course: string
  questions: Question[]
  difficulty: "Easy" | "Medium" | "Hard"
  duration: number // minutes
  passingScore: number // percentage
  stats: {
    attempts: number
    avgScore: number
    completions: number
  }
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "short-answer"
  options?: string[]
  correctAnswer: string | number
  explanation?: string
  points: number
}

export interface Blog {
  _id: string
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  thumbnail?: string
  status: "published" | "draft" | "scheduled"
  publishDate: string
  stats: {
    views: number
    likes: number
    comments: number
    shares: number
  }
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  assignedTo?: string
  tags: string[]
  source: "website" | "email" | "phone" | "chat"
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface Analytics {
  date: string
  users: {
    total: number
    active: number
    new: number
  }
  engagement: {
    sessions: number
    avgDuration: number
    bounceRate: number
  }
  revenue: {
    total: number
    subscriptions: number
    courses: number
  }
}
