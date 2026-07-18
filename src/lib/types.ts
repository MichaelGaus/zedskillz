// ============================================================================
// ZEDSKILLZ AI LEARNING PLATFORM - CORE TYPES
// ============================================================================

export type UserRole =
  | "super_admin"
  | "admin"
  | "instructor"
  | "student"
  | "parent"
  | "school"
  | "organization"
  | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  education?: string;
  followers: number;
  following: number;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  badges: Badge[];
  certificates: Certificate[];
  completedCourses: number;
  verified: boolean;
  joinedAt: string;
  socialLinks?: { platform: string; url: string }[];
}

export type CourseStatus =
  | "draft"
  | "submitted"
  | "pending_approval"
  | "needs_revision"
  | "approved"
  | "published"
  | "archived";

export type LessonType =
  | "video"
  | "text"
  | "audio"
  | "pdf"
  | "slides"
  | "code_editor"
  | "coding_challenge"
  | "interactive"
  | "live_class"
  | "external_link"
  | "downloadable";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  promotionalVideo?: string;
  category: string;
  subcategory?: string;
  difficulty: Difficulty;
  language: string;
  tags: string[];
  price: number;
  discount?: number;
  originalPrice?: number;
  learningObjectives: string[];
  requirements: string[];
  targetAudience: string[];
  sections: CourseSection[];
  status: CourseStatus;
  instructorId: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  publishedAt: string;
  lastUpdated: string;
  certificateEnabled: boolean;
  isFeatured?: boolean;
  isFree?: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  content?: string;
  preview?: boolean;
  completed?: boolean;
  resources?: { name: string; type: string; size: string }[];
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: QuizQuestion[];
  timeLimit?: number; // minutes
  passingScore: number;
}

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "matching"
  | "fill_blank"
  | "essay"
  | "coding"
  | "drag_drop"
  | "image"
  | "video";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  progress: number;
  lastAccessed: string;
  completedLessons: string[];
  certificateIssued?: boolean;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  verificationUrl: string;
  qrCode: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: { xp: number; coins: number };
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  video?: string;
  tags?: string[];
  mentions?: string[];
  likes: number;
  comments: Comment[];
  shares: number;
  createdAt: string;
  type: "text" | "image" | "video" | "achievement" | "course_completion";
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Conversation {
  id: string;
  type: "private" | "group" | "course" | "ai";
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "voice";
  createdAt: string;
  read?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "course_update" | "assignment" | "live_class" | "payment" | "social" | "achievement" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ParentStudentLink {
  id: string;
  parentId: string;
  studentId: string;
  relationship: string;
  approved: boolean;
  approvedAt?: string;
}

export interface StudentProgressReport {
  studentId: string;
  studentName: string;
  avatar: string;
  enrolledCourses: number;
  completedCourses: number;
  averageProgress: number;
  averageGrade: number;
  learningStreak: number;
  timeSpent: number; // hours
  weakTopics: string[];
  strongTopics: string[];
  recentActivities: { type: string; description: string; date: string }[];
  upcomingAssignments: { title: string; course: string; dueDate: string }[];
  certificates: Certificate[];
  aiUsageHours: number;
}

export interface Payment {
  id: string;
  userId: string;
  courseId?: string;
  amount: number;
  currency: string;
  method: string;
  status: "pending" | "completed" | "failed" | "refunded";
  type: "course_purchase" | "subscription" | "bundle" | "payout" | "refund";
  createdAt: string;
  invoiceNumber: string;
}

export interface LiveClass {
  id: string;
  title: string;
  courseId: string;
  instructorId: string;
  scheduledAt: string;
  duration: number;
  platform: "zoom" | "google_meet" | "custom";
  meetingUrl: string;
  attendees: number;
  status: "scheduled" | "live" | "ended" | "cancelled";
  recordingUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  coursesCompleted: number;
  trend: "up" | "down" | "same";
}

export interface SupportTicket {
  id: string;
  subject: string;
  userId: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  category: string;
  createdAt: string;
  lastReply: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
  status: "success" | "failed" | "warning";
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  banner: string;
  joined: boolean;
}

export interface Review {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}
