// ============================================================================
// ZEDSKILLZ HUB — ZAMBIAN LEARNING PLATFORM DATA
// All names, currency (Kwacha "K"), and contexts are Zambia-specific
// ============================================================================

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffdad8,f5dddd,e5dedf`;

const thumb = (id: number, w = 600, h = 400) =>
  `https://picsum.photos/seed/zedskillz-${id}/${w}/${h}`;

// ============================================================================
// CURRENT USER — "Zambian Scholar"
// ============================================================================
export const currentUser = {
  id: "u-1",
  name: "Zambian Scholar",
  username: "zscholar",
  email: "scholar@zedskillz.com",
  phone: "+260971234567",
  role: "student" as const,
  avatar: avatar("Zambian Scholar"),
  initials: "ZS",
  bio: "Grade 12 student from Lusaka preparing for ECZ exams. Aspiring software engineer.",
  location: "Lusaka, Zambia",
  province: "Lusaka Province",
  skills: ["Python", "Mathematics", "Physics", "Web Development"],
  interests: ["AI", "Robotics", "Agriculture", "Entrepreneurship"],
  education: "Grade 12 — Lusaka Secondary School",
  followers: 248,
  following: 156,
  xp: 4500,
  level: 12,
  rank: 12,
  coins: 1250,
  streak: 8,
  learningDays: 24,
  weeklyGoalProgress: 75,
  badges: [
    { id: "b1", name: "Quick Learner", description: "Completed 5 lessons in one day", icon: "bolt", earnedAt: "2024-07-10", rarity: "rare" as const },
    { id: "b2", name: "Streak Master", description: "7-day learning streak", icon: "local_fire_department", earnedAt: "2024-07-15", rarity: "epic" as const },
    { id: "b3", name: "First Certificate", description: "Earned your first certificate", icon: "verified", earnedAt: "2024-06-20", rarity: "common" as const },
    { id: "b4", name: "AI Pioneer", description: "100 AI tutor interactions", icon: "smart_toy", earnedAt: "2024-07-01", rarity: "legendary" as const, locked: true },
  ],
  certificates: [
    { id: "cert1", title: "UX Design Mastery", issuer: "Zedskillz Hub", issuedAt: "March 2024", courseId: "c2" },
    { id: "cert2", title: "Business Analytics 101", issuer: "Zedskillz Hub", issuedAt: "Feb 2024", courseId: "c5" },
  ],
  completedCourses: 2,
  verified: true,
  joinedAt: "2024-01-15",
};

// ============================================================================
// USERS
// ============================================================================
export const users = [
  currentUser,
  {
    id: "u-admin",
    name: "Zambian Admin",
    email: "admin@zedskillz.com",
    role: "admin" as const,
    avatar: avatar("Admin Zambia"),
    initials: "ZA",
    bio: "Platform administrator",
    location: "Lusaka, Zambia",
    followers: 0,
    following: 0,
    xp: 4500,
    level: 12,
    rank: 0,
    coins: 0,
    streak: 0,
    learningDays: 0,
    weeklyGoalProgress: 0,
    badges: [],
    certificates: [],
    completedCourses: 0,
    verified: true,
    joinedAt: "2024-01-01",
  },
  // Leaderboard top scholars
  { id: "u-2", name: "C. Mwansa", avatar: avatar("C Mwansa"), initials: "CM", xp: 12500, level: 24, streak: 89, rank: 1, coursesCompleted: 12, trend: "same" as const, location: "Kitwe, Copperbelt" },
  { id: "u-3", name: "B. Lungu", avatar: avatar("B Lungu"), initials: "BL", xp: 8420, level: 22, streak: 67, rank: 2, coursesCompleted: 10, trend: "up" as const, location: "Ndola, Copperbelt" },
  { id: "u-4", name: "K. Phiri", avatar: avatar("K Phiri"), initials: "KP", xp: 7950, level: 20, streak: 54, rank: 3, coursesCompleted: 9, trend: "up" as const, location: "Lusaka" },
  { id: "u-5", name: "M. Banda", avatar: avatar("M Banda"), initials: "MB", xp: 6400, level: 18, streak: 12, rank: 4, coursesCompleted: 8, trend: "down" as const, location: "Kabwe" },
  { id: "u-6", name: "S. Zulu", avatar: avatar("S Zulu"), initials: "SZ", xp: 5890, level: 16, streak: 45, rank: 5, coursesCompleted: 7, trend: "up" as const, location: "Livingstone" },
  { id: "u-7", name: "P. Chanda", avatar: avatar("P Chanda"), initials: "PC", xp: 4450, level: 14, streak: 21, rank: 13, coursesCompleted: 6, trend: "down" as const, location: "Lusaka" },
  { id: "u-8", name: "Mwaba K.", avatar: avatar("Mwaba K"), initials: "MK", xp: 8240, level: 20, streak: 38, rank: 1, coursesCompleted: 9, trend: "up" as const, location: "Lusaka" },
  { id: "u-9", name: "Loveness M.", avatar: avatar("Loveness M"), initials: "LM", xp: 4420, level: 14, streak: 12, rank: 13, coursesCompleted: 6, trend: "same" as const, location: "Kasama" },

  // Community post participants
  { id: "u-10", name: "Chansa Mulenga", avatar: avatar("Chansa Mulenga"), initials: "CM", role: "student" as const, level: 11, contributions: 89, points: "+2.4k", location: "Lusaka" },
  { id: "u-11", name: "Mrs. Mutale Kapambwe", avatar: avatar("Mutale Kapambwe"), initials: "MK", role: "educator" as const, level: 30, contributions: 412, points: "+8.9k", location: "Lusaka" },
  { id: "u-12", name: "Mwila B.", avatar: avatar("Mwila B"), initials: "MB", role: "student" as const, level: 9, contributions: 32, points: "+1.2k", location: "Ndola" },
  { id: "u-13", name: "Chanda Musonda", avatar: avatar("Chanda Musonda"), initials: "CM", role: "student" as const, location: "Lusaka" },
  { id: "u-14", name: "Loveness Zulu", avatar: avatar("Loveness Zulu"), initials: "LZ", role: "student" as const, location: "Livingstone" },

  // Instructors
  { id: "u-instr-1", name: "Dr. Mwape Phiri", avatar: avatar("Mwape Phiri"), initials: "MP", role: "instructor" as const, bio: "PhD Computer Science, University of Zambia. AI/ML researcher.", verified: true, followers: 12480, courses: 8, rating: 4.9, location: "Lusaka" },
  { id: "u-instr-2", name: "Prof. Namwali Banda", avatar: avatar("Namwali Banda"), initials: "NB", role: "instructor" as const, bio: "Professor of Data Science. Author of 'Python for Zambian Schools'.", verified: true, followers: 8920, courses: 5, rating: 4.8, location: "Kitwe" },
  { id: "u-instr-3", name: "Jacob Soko", avatar: avatar("Jacob Soko"), initials: "JS", role: "instructor" as const, bio: "Mobile engineer. Built 20+ apps for African markets.", verified: true, followers: 5630, courses: 4, rating: 4.7, location: "Ndola" },
];

// ============================================================================
// COURSES — Zambian context, prices in Kwacha
// ============================================================================
export const courses = [
  {
    id: "c1",
    title: "Grade 12: Advanced Calculus",
    subtitle: "Master ECZ syllabus calculus with AI tutor support",
    description: "Complete Grade 12 calculus aligned with the Zambian Ministry of Education ECZ syllabus. Covers limits, derivatives, integrals, and applications.",
    thumbnail: thumb(1),
    category: "Mathematics",
    subcategory: "Calculus",
    difficulty: "advanced" as const,
    language: "English",
    tags: ["Mathematics", "Grade12", "ECZ", "Calculus"],
    price: 0,
    isFree: true,
    originalPrice: 0,
    duration: "24 hours",
    modules: 12,
    rating: 4.9,
    reviewsCount: 423,
    studentsCount: 1240,
    instructorId: "u-instr-2",
    instructorName: "Prof. Namwali Banda",
    progress: 65,
    completedLessons: 8,
    status: "published" as const,
    isFeatured: true,
    publishedAt: "2024-01-10",
    lastUpdated: "2024-07-01",
    certificateEnabled: true,
    sections: [
      {
        id: "s1",
        title: "Limits and Continuity",
        lessons: [
          { id: "l1", title: "Introduction to Limits", type: "video" as const, duration: "18:24", completed: true },
          { id: "l2", title: "One-Sided Limits", type: "video" as const, duration: "22:15", completed: true },
          { id: "l3", title: "Limit Laws", type: "video" as const, duration: "15:30", completed: true },
          { id: "l4", title: "Quiz: Limits", type: "interactive" as const, duration: "10:00", completed: false },
        ],
      },
      {
        id: "s2",
        title: "Derivatives",
        lessons: [
          { id: "l5", title: "Definition of Derivative", type: "video" as const, duration: "20:00", completed: true },
          { id: "l6", title: "Differentiation Rules", type: "video" as const, duration: "25:00", completed: false },
          { id: "l7", title: "Chain Rule", type: "video" as const, duration: "28:00", completed: false },
        ],
      },
    ],
  },
  {
    id: "c2",
    title: "Python for Beginners",
    subtitle: "Learn programming from scratch in Bemba & English",
    description: "Start your coding journey with Python. Perfect for Zambian students with no prior programming experience. AI tutor available in Bemba, Nyanja, and English.",
    thumbnail: thumb(2),
    category: "Technology",
    subcategory: "Programming",
    difficulty: "beginner" as const,
    language: "English",
    tags: ["Python", "Programming", "Beginner"],
    price: 450,
    originalPrice: 900,
    discount: 50,
    duration: "30 hours",
    modules: 15,
    rating: 4.7,
    reviewsCount: 856,
    studentsCount: 4230,
    instructorId: "u-instr-1",
    instructorName: "Dr. Mwape Phiri",
    progress: 20,
    completedLessons: 3,
    status: "published" as const,
    isFeatured: true,
    publishedAt: "2024-02-15",
    lastUpdated: "2024-06-28",
    certificateEnabled: true,
    sections: [
      {
        id: "s1",
        title: "Python Basics",
        lessons: [
          { id: "l1", title: "Installing Python", type: "video" as const, duration: "10:00", completed: true, preview: true },
          { id: "l2", title: "Your First Program", type: "code_editor" as const, duration: "15:00", completed: true },
          { id: "l3", title: "Variables & Types", type: "video" as const, duration: "20:00", completed: true },
          { id: "l4", title: "Strings", type: "video" as const, duration: "18:00", completed: false },
        ],
      },
    ],
  },
  {
    id: "c3",
    title: "Sustainable Agribusiness",
    subtitle: "Modern farming techniques for Zambian agriculture",
    description: "Learn sustainable agribusiness practices tailored to Zambian climate, crops (maize, cassava, groundnuts), and markets. Includes case studies from Copperbelt and Central Provinces.",
    thumbnail: thumb(3),
    category: "Vocational",
    subcategory: "Agriculture",
    difficulty: "beginner" as const,
    language: "English",
    tags: ["Agriculture", "Business", "Sustainability"],
    price: 0,
    isFree: true,
    originalPrice: 0,
    duration: "18 hours",
    modules: 8,
    rating: 4.6,
    reviewsCount: 234,
    studentsCount: 1890,
    instructorId: "u-instr-2",
    instructorName: "Prof. Namwali Banda",
    progress: 0,
    completedLessons: 0,
    status: "published" as const,
    isFeatured: true,
    publishedAt: "2024-03-20",
    lastUpdated: "2024-07-10",
    certificateEnabled: true,
    sections: [],
  },
  {
    id: "c4",
    title: "Community Health Worker",
    subtitle: "Train to serve your community's health needs",
    description: "Comprehensive CHW training aligned with Zambia Ministry of Health standards. Covers maternal health, malaria prevention, HIV/AIDS, and community outreach.",
    thumbnail: thumb(4),
    category: "Health",
    subcategory: "Community Health",
    difficulty: "intermediate" as const,
    language: "English",
    tags: ["Health", "Community", "Medical"],
    price: 0,
    isFree: true,
    originalPrice: 0,
    duration: "45 hours",
    modules: 20,
    rating: 4.8,
    reviewsCount: 1240,
    studentsCount: 3200,
    instructorId: "u-instr-1",
    instructorName: "Dr. Mwape Phiri",
    progress: 10,
    completedLessons: 2,
    status: "published" as const,
    isFeatured: true,
    publishedAt: "2024-04-01",
    lastUpdated: "2024-07-05",
    certificateEnabled: true,
    sections: [],
  },
  {
    id: "c5",
    title: "Full-Stack Web Development with React & Node",
    subtitle: "Build complete web applications from scratch",
    description: "Master modern full-stack development. Build real apps including an e-commerce platform, social media app, and SaaS dashboard. Includes deployment to Vercel & render.",
    thumbnail: thumb(5),
    category: "Programming",
    subcategory: "Web Development",
    difficulty: "intermediate" as const,
    language: "English",
    tags: ["React", "Node.js", "JavaScript", "Web Dev"],
    price: 1250,
    originalPrice: 1800,
    discount: 31,
    duration: "24 hours",
    modules: 12,
    rating: 4.8,
    reviewsCount: 432,
    studentsCount: 2100,
    instructorId: "u-instr-1",
    instructorName: "Dr. Mwape Phiri",
    progress: 45,
    completedLessons: 5,
    status: "published" as const,
    isFeatured: false,
    publishedAt: "2024-04-22",
    lastUpdated: "2024-07-12",
    certificateEnabled: true,
    sections: [],
  },
  {
    id: "c6",
    title: "Data Analysis & Visualization Masterclass",
    subtitle: "Master pandas, NumPy, and visualization tools",
    description: "Learn to analyze real-world Zambian datasets — agriculture, health, education. Build dashboards with Python, matplotlib, and Plotly.",
    thumbnail: thumb(6),
    category: "Data Science",
    subcategory: "Analytics",
    difficulty: "beginner" as const,
    language: "English",
    tags: ["Python", "pandas", "Data Analysis", "Visualization"],
    price: 950,
    originalPrice: 1400,
    discount: 32,
    duration: "18 hours",
    modules: 9,
    rating: 4.9,
    reviewsCount: 567,
    studentsCount: 3200,
    instructorId: "u-instr-2",
    instructorName: "Prof. Namwali Banda",
    progress: 0,
    completedLessons: 0,
    status: "published" as const,
    isFeatured: false,
    publishedAt: "2024-05-10",
    lastUpdated: "2024-06-30",
    certificateEnabled: true,
    sections: [],
  },
  {
    id: "c7",
    title: "UI/UX Product Design Fundamentals",
    subtitle: "Design beautiful, usable interfaces",
    description: "Master the principles of user-centered design. Learn Figma, design systems, prototyping, and user research with Zambian startup case studies.",
    thumbnail: thumb(7),
    category: "Design",
    subcategory: "UI/UX",
    difficulty: "beginner" as const,
    language: "English",
    tags: ["Design", "Figma", "UI/UX"],
    price: 1100,
    originalPrice: 1500,
    discount: 27,
    duration: "30 hours",
    modules: 14,
    rating: 4.7,
    reviewsCount: 234,
    studentsCount: 1890,
    instructorId: "u-instr-3",
    instructorName: "Jacob Soko",
    progress: 0,
    completedLessons: 0,
    status: "published" as const,
    isFeatured: false,
    publishedAt: "2024-05-22",
    lastUpdated: "2024-07-12",
    certificateEnabled: true,
    sections: [],
  },
  {
    id: "c8",
    title: "Cyber Defense: Ethical Hacking Foundations",
    subtitle: "Learn cybersecurity from the ground up",
    description: "Master ethical hacking fundamentals. Network security, penetration testing, and threat analysis. Aligned with ZICTA standards.",
    thumbnail: thumb(8),
    category: "Cybersecurity",
    subcategory: "Ethical Hacking",
    difficulty: "advanced" as const,
    language: "English",
    tags: ["Security", "Hacking", "Network"],
    price: 2500,
    originalPrice: 3500,
    discount: 29,
    duration: "45 hours",
    modules: 18,
    rating: 5.0,
    reviewsCount: 89,
    studentsCount: 540,
    instructorId: "u-instr-1",
    instructorName: "Dr. Mwape Phiri",
    progress: 0,
    completedLessons: 0,
    status: "published" as const,
    isFeatured: false,
    publishedAt: "2024-06-01",
    lastUpdated: "2024-07-15",
    certificateEnabled: true,
    sections: [],
  },
  {
    id: "c9",
    title: "Flutter & Dart: Cross-Platform Mobile Dev",
    subtitle: "Build iOS & Android apps with one codebase",
    description: "Build production-ready mobile apps using Flutter. Perfect for Zambian startups targeting both Android and iOS users.",
    thumbnail: thumb(9),
    category: "Mobile",
    subcategory: "Cross-Platform",
    difficulty: "intermediate" as const,
    language: "English",
    tags: ["Flutter", "Dart", "Mobile"],
    price: 1400,
    originalPrice: 1900,
    discount: 26,
    duration: "32 hours",
    modules: 14,
    rating: 4.6,
    reviewsCount: 156,
    studentsCount: 890,
    instructorId: "u-instr-3",
    instructorName: "Jacob Soko",
    progress: 0,
    completedLessons: 0,
    status: "published" as const,
    isFeatured: false,
    publishedAt: "2024-06-15",
    lastUpdated: "2024-07-10",
    certificateEnabled: true,
    sections: [],
  },
];

// Student's active enrolled courses
export const myActiveCourses = [
  {
    id: "c10",
    title: "AI Fundamentals for Zambian Fintech",
    subtitle: "Apply AI to mobile money, lending, and payments",
    thumbnail: thumb(10),
    category: "AI & ML",
    difficulty: "intermediate" as const,
    progress: 45,
    module: 4,
    totalModules: 12,
    nextLesson: "Neural Networks Basics",
    duration: "28 hours",
    instructor: "Dr. Mwape Phiri",
  },
  {
    id: "c11",
    title: "Advanced Python for Data Analysis",
    subtitle: "Master pandas, NumPy, scikit-learn",
    thumbnail: thumb(11),
    category: "Programming",
    difficulty: "advanced" as const,
    progress: 82,
    module: 8,
    totalModules: 10,
    nextLesson: "Time Series Forecasting",
    duration: "35 hours",
    instructor: "Prof. Namwali Banda",
  },
];

// Suggested courses
export const suggestedCourses = [
  {
    id: "c12",
    title: "Digital Literacy in Agriculture",
    subtitle: "Leverage AI tools to optimize local crop yields and manage supply chains.",
    thumbnail: thumb(12),
    category: "Vocational",
    difficulty: "beginner" as const,
    duration: "4.2 hours",
    price: 0,
    isFree: true,
    aiRecommended: true,
  },
  {
    id: "c13",
    title: "Cloud Computing Basics",
    subtitle: "Learn the essentials of AWS and Azure for modern enterprise deployment.",
    thumbnail: thumb(13),
    category: "Cloud Computing",
    difficulty: "beginner" as const,
    duration: "6.5 hours",
    price: 350,
  },
];

// ============================================================================
// LEADERBOARD
// ============================================================================
export const leaderboard = [
  { rank: 1, userId: "u-2", name: "C. Mwansa", avatar: avatar("C Mwansa"), xp: 12500, level: 24, streak: 89, coursesCompleted: 12, trend: "same" as const, initials: "CM" },
  { rank: 2, userId: "u-3", name: "B. Lungu", avatar: avatar("B Lungu"), xp: 8420, level: 22, streak: 67, coursesCompleted: 10, trend: "up" as const, initials: "BL" },
  { rank: 3, userId: "u-4", name: "K. Phiri", avatar: avatar("K Phiri"), xp: 7950, level: 20, streak: 54, coursesCompleted: 9, trend: "up" as const, initials: "KP" },
  { rank: 4, userId: "u-5", name: "M. Banda", avatar: avatar("M Banda"), xp: 6400, level: 18, streak: 12, coursesCompleted: 8, trend: "down" as const, initials: "MB" },
  { rank: 5, userId: "u-6", name: "S. Zulu", avatar: avatar("S Zulu"), xp: 5890, level: 16, streak: 45, coursesCompleted: 7, trend: "up" as const, initials: "SZ" },
  { rank: 6, userId: "u-7", name: "T. Tembo", avatar: avatar("T Tembo"), xp: 5230, level: 15, streak: 32, coursesCompleted: 6, trend: "down" as const, initials: "TT" },
  { rank: 7, userId: "u-8", name: "N. Mwaba", avatar: avatar("N Mwaba"), xp: 4980, level: 14, streak: 28, coursesCompleted: 5, trend: "same" as const, initials: "NM" },
  { rank: 8, userId: "u-9", name: "G. Hamooya", avatar: avatar("G Hamooya"), xp: 4720, level: 13, streak: 18, coursesCompleted: 4, trend: "up" as const, initials: "GH" },
  { rank: 9, userId: "u-10", name: "L. Nyirenda", avatar: avatar("L Nyirenda"), xp: 4620, level: 13, streak: 22, coursesCompleted: 4, trend: "down" as const, initials: "LN" },
  { rank: 10, userId: "u-11", name: "D. Siame", avatar: avatar("D Siame"), xp: 4560, level: 12, streak: 16, coursesCompleted: 3, trend: "up" as const, initials: "DS" },
  { rank: 11, userId: "u-12", name: "R. Mpundu", avatar: avatar("R Mpundu"), xp: 4520, level: 12, streak: 14, coursesCompleted: 3, trend: "same" as const, initials: "RM" },
  { rank: 12, userId: "u-1", name: "You (Z. Scholar)", avatar: avatar("Zambian Scholar"), xp: 4500, level: 12, streak: 8, coursesCompleted: 2, trend: "up" as const, initials: "ZS", isMe: true },
  { rank: 13, userId: "u-13", name: "P. Chanda", avatar: avatar("P Chanda"), xp: 4450, level: 14, streak: 21, coursesCompleted: 6, trend: "down" as const, initials: "PC" },
  { rank: 14, userId: "u-14", name: "A. Bwalya", avatar: avatar("A Bwalya"), xp: 4380, level: 13, streak: 11, coursesCompleted: 4, trend: "up" as const, initials: "AB" },
  { rank: 15, userId: "u-15", name: "M. Lombe", avatar: avatar("M Lombe"), xp: 4240, level: 13, streak: 9, coursesCompleted: 3, trend: "same" as const, initials: "ML" },
];

export const miniLeaderboard = [
  { rank: 1, name: "Mwaba K.", avatar: avatar("Mwaba K"), initials: "MK", xp: 8240, isMe: false },
  { rank: 12, name: "You", avatar: avatar("Zambian Scholar"), initials: "ZS", xp: 4500, isMe: true },
  { rank: 13, name: "Loveness M.", avatar: avatar("Loveness M"), initials: "LM", xp: 4420, isMe: false },
];

// ============================================================================
// ADMIN DASHBOARD DATA
// ============================================================================
export const platformStats = {
  totalUsers: 24512,
  revenue: 85200, // in Kwacha (thousands)
  activeCourses: 156,
  aiInteractions: "1.2M",
  userGrowth: "+12%",
  revenueGrowth: "+8.4%",
  coursesGrowth: "0%",
  aiGrowth: "+24%",
};

export const userGrowthData = [
  { day: "MON", users: 45 },
  { day: "TUE", users: 62 },
  { day: "WED", users: 55 },
  { day: "THU", users: 78 },
  { day: "FRI", users: 70 },
  { day: "SAT", users: 95, active: true },
  { day: "SUN", users: 80 },
];

export const adminActivity = [
  {
    id: "a1",
    type: "enrollment",
    icon: "person_add",
    iconColor: "text-primary",
    title: "New Student Enrollment",
    description: "Chanda Musonda joined 'Intro to AI'",
    time: "2 mins ago",
  },
  {
    id: "a2",
    type: "completion",
    icon: "workspace_premium",
    iconColor: "text-on-tertiary-container",
    title: "Course Completed",
    description: "Loveness Zulu earned 'Digital Literacy' badge",
    time: "15 mins ago",
  },
  {
    id: "a3",
    type: "ai",
    icon: "psychology",
    iconColor: "text-on-primary-container",
    title: "AI Interaction Peak",
    description: "AI Tutor handled 500+ queries in 10 mins",
    time: "42 mins ago",
  },
  {
    id: "a4",
    type: "alert",
    icon: "report",
    iconColor: "text-error",
    title: "System Alert",
    description: "High latency in Lusaka Server Node",
    time: "1 hour ago",
  },
];

export const adminUsers = [
  { id: "u-x1", name: "Chanda Musonda", email: "chanda.m@zedskillz.com", role: "Student", joinedAt: "2024-07-15", status: "Active", courses: 3, xp: 1250 },
  { id: "u-x2", name: "Loveness Zulu", email: "loveness.z@zedskillz.com", role: "Student", joinedAt: "2024-07-14", status: "Active", courses: 5, xp: 3200 },
  { id: "u-x3", name: "Dr. Mwape Phiri", email: "mwape.p@zedskillz.com", role: "Instructor", joinedAt: "2024-01-10", status: "Verified", courses: 8, xp: 0 },
  { id: "u-x4", name: "Mrs. Mutale Kapambwe", email: "mutale.k@zedskillz.com", role: "Educator", joinedAt: "2024-02-05", status: "Verified", courses: 4, xp: 0 },
  { id: "u-x5", name: "Mwila Banda", email: "mwila.b@zedskillz.com", role: "Student", joinedAt: "2024-07-12", status: "Active", courses: 2, xp: 890 },
  { id: "u-x6", name: "Bwalya Phiri", email: "bwalya.p@zedskillz.com", role: "Student", joinedAt: "2024-07-10", status: "Pending", courses: 0, xp: 0 },
];

// ============================================================================
// COMMUNITY FORUM CATEGORIES
// ============================================================================
export const forumCategories = [
  {
    id: "cat1",
    name: "General Discussion",
    description: "General discussions about learning, technology, and Zambian tech ecosystem.",
    icon: "forum",
    postsCount: 0,
    color: "bg-primary-container/10 text-primary",
  },
  {
    id: "cat2",
    name: "Programming Help",
    description: "Get help with coding questions, debugging, and project architecture.",
    icon: "terminal",
    postsCount: 0,
    color: "bg-tertiary-container/10 text-on-tertiary-container",
  },
  {
    id: "cat3",
    name: "Career Advice",
    description: "Discuss career paths, job opportunities, and interview preparation.",
    icon: "work",
    postsCount: 0,
    color: "bg-secondary-container text-on-secondary-container",
  },
  {
    id: "cat4",
    name: "Study Groups",
    description: "Form and join collaborative study groups for specific skill tracks.",
    icon: "group_work",
    postsCount: 0,
    color: "bg-primary-fixed text-on-primary-fixed",
  },
];

// ============================================================================
// INDIVIDUAL POST (ScholarConnect view)
// ============================================================================
export const communityPost = {
  id: "post1",
  title: "Understanding Recursion in Python for Grade 12 Advanced Maths",
  author: {
    name: "Chansa Mulenga",
    avatar: avatar("Chansa Mulenga"),
    initials: "CM",
    badge: "Pro Contributor",
    postedAt: "2 hours ago",
  },
  breadcrumbs: ["Community", "Grade 12", "Programming Logic"],
  body: "Hi everyone! I'm currently preparing for my ECZ final exams and I'm having a bit of trouble visualizing how recursion works in Python, especially when applied to Fibonacci sequences. Can someone explain it with a simple example? Any help would be much appreciated!",
  code: {
    language: "python",
    content: `def fib(n):
    if n <= 1: return n
    else: return fib(n-1) + fib(n-2)`,
  },
  tags: [
    { label: "PROGRAMMING", type: "default" },
    { label: "GRADE12", type: "default" },
    { label: "PYTHON", type: "default" },
    { label: "HELP NEEDED", type: "highlight" },
  ],
  stats: {
    upvotes: 124,
    replies: 42,
    shares: 8,
  },
  aiSummary: {
    text: "Most students find the 'Base Case' (if n <= 1) difficult because it feels like it does nothing, but it's the anchor that prevents an infinite loop. Chansa, remember that each call to fib() creates a new 'frame' on your computer's memory stack.",
    followUp: "Explain Memory Stacks in Detail",
  },
  comments: [
    {
      id: "cm1",
      author: {
        name: "Mrs. Mutale Kapambwe",
        avatar: avatar("Mutale Kapambwe"),
        initials: "MK",
        badge: "EDUCATOR",
      },
      postedAt: "1 hour ago",
      body: "Think of it like a stack of nesting dolls. You keep opening smaller and smaller dolls (recursive step) until you reach the tiny one that cannot be opened (base case). Then you put them all back together to see the whole set!",
      upvotes: 56,
      replies: 3,
      nested: [
        {
          id: "cm1-r1",
          author: {
            name: "Mwila B.",
            avatar: avatar("Mwila B"),
            initials: "MB",
          },
          postedAt: "45 mins ago",
          body: "That's the best analogy I've heard! It really helps visualize the return stack.",
          upvotes: 12,
          replies: 0,
        },
      ],
    },
  ],
  related: [
    { id: "r1", category: "PROGRAMMING", title: "Best Python IDEs for Grade 12 students preparing for ECZ exams", meta: "23 replies • 2d ago" },
    { id: "r2", category: "MATHS", title: "ECZ Past Paper Discussion: 2023 Paper 2 Question 5", meta: "47 replies • 5h ago" },
    { id: "r3", category: "PYTHON", title: "How to optimize recursive functions with memoization", meta: "12 replies • 1d ago" },
  ],
  contributors: [
    { id: "co1", name: "C. Mwansa", avatar: avatar("C Mwansa"), initials: "CM", contributions: 89, points: "+2.4k", rank: 1 },
    { id: "co2", name: "Mrs. Kapambwe", avatar: avatar("Mutale Kapambwe"), initials: "MK", contributions: 67, points: "+1.8k", rank: 2 },
  ],
  pulse: {
    onlineNow: "1.2k",
    newTopics: "45",
  },
};

// ============================================================================
// CATEGORIES FOR COURSE EXPLORER
// ============================================================================
export const courseCategories = [
  { id: "all", name: "All Courses", icon: "apps" },
  { id: "ai", name: "AI & ML", icon: "psychology" },
  { id: "prog", name: "Programming", icon: "code" },
  { id: "marketing", name: "Digital Marketing", icon: "campaign" },
  { id: "data", name: "Data Science", icon: "analytics" },
  { id: "cloud", name: "Cloud Computing", icon: "cloud" },
  { id: "design", name: "Design", icon: "palette" },
  { id: "cyber", name: "Cybersecurity", icon: "shield" },
  { id: "mobile", name: "Mobile", icon: "smartphone" },
  { id: "health", name: "Health", icon: "medical_services" },
  { id: "vocational", name: "Vocational", icon: "agriculture" },
  { id: "math", name: "Mathematics", icon: "calculate" },
];

// Hero recommended course for course explorer
export const aiRecommendedCourse = {
  id: "c-hero",
  title: "Advanced Neural Architectures & LLM Engineering",
  subtitle: "Master the core principles behind modern AI. Build, train, and deploy large language models with Zambia's leading AI experts.",
  thumbnail: thumb(20, 1600, 600),
  duration: "60 hours",
  modules: 20,
  level: "Advanced",
  rating: 5.0,
  studentsCount: 320,
};

// ============================================================================
// AI TUTOR CONVERSATION SAMPLES
// ============================================================================
export const landingAiChat = {
  status: "Online • Ready to help in Bemba, Nyanja & English",
  messages: [
    {
      id: "m1",
      role: "ai" as const,
      content: "Muli bwanji! How can I help you with your Grade 12 Math revision today?",
    },
    {
      id: "m2",
      role: "user" as const,
      content: "I'm struggling with quadratic equations. Can you explain them simply?",
    },
    {
      id: "m3",
      role: "ai" as const,
      content: "Of course! Think of a quadratic equation like a bridge arch. In Zambia, we see these in architecture all the time. Let's look at the formula ax² + bx + c = 0...",
      thinking: true,
    },
  ],
};

export const aiTutorSuggestions = [
  "Explain quadratic equations",
  "Quiz me on Python loops",
  "Summarize today's lesson",
  "Generate flashcards on calculus",
  "Translate this to Bemba",
  "What should I learn next?",
];

// ============================================================================
// NOTIFICATIONS
// ============================================================================
export const notifications = [
  { id: "n1", type: "live_class", title: "Live class starting soon", message: "Q&A with Dr. Phiri starts in 30 minutes", read: false, createdAt: "2024-07-18T09:30:00Z" },
  { id: "n2", type: "achievement", title: "New badge earned!", message: "You earned the 'Streak Master' badge", read: false, createdAt: "2024-07-18T08:00:00Z" },
  { id: "n3", type: "course_update", title: "New lesson added", message: "Module 4: JavaScript Essentials is now available", read: false, createdAt: "2024-07-17T16:00:00Z" },
  { id: "n4", type: "assignment", title: "Assignment due tomorrow", message: "HTML Challenge is due in 24 hours", read: true, createdAt: "2024-07-17T10:00:00Z" },
];

// ============================================================================
// FOOTER LINKS (standard across all pages)
// ============================================================================
export const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Support", href: "#" },
  { label: "Zambia Ministry of Education", href: "#" },
];

// ============================================================================
// AI FAB VARIANTS
// ============================================================================
export type AiFabVariant = "solid" | "gradient" | "pulse";

// ============================================================================
// SIDEBAR NAVIGATION CONFIG
// ============================================================================
export const sidebarNav = {
  primary: [
    { label: "Home", icon: "home", page: "landing" },
    { label: "Explore", icon: "explore", page: "courses" },
    { label: "My Courses", icon: "school", page: "my-courses" },
    { label: "AI Tutor", icon: "psychology", page: "ai-tutor" },
    { label: "Leaderboard", icon: "leaderboard", page: "leaderboard" },
    { label: "Community", icon: "groups", page: "community" },
  ],
  management: [
    { label: "Admin Dashboard", icon: "dashboard", page: "admin-dashboard" },
    { label: "Resources", icon: "library_books", page: "resources" },
  ],
  secondary: [
    { label: "Settings", icon: "settings", page: "settings" },
    { label: "Help", icon: "help", page: "help" },
  ],
};

// ScholarConnect-specific sidebar
export const scholarConnectNav = {
  primary: [
    { label: "Dashboard", icon: "dashboard", page: "scholarconnect" },
    { label: "Community", icon: "groups", page: "post", active: true },
    { label: "Study Partners", icon: "person_search", page: "scholarconnect" },
    { label: "AI Tutor", icon: "psychology", page: "ai-tutor" },
    { label: "Resources", icon: "library_books", page: "resources" },
  ],
};
