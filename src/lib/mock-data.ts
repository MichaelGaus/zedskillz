import type {
  User,
  Course,
  Post,
  Conversation,
  Notification,
  Payment,
  LiveClass,
  LeaderboardEntry,
  SupportTicket,
  AuditLog,
  Coupon,
  Community,
  Review,
  StudentProgressReport,
  Badge,
  Achievement,
} from "./types";

// ============================================================================
// AVATAR HELPER (uses DiceBear API for variety)
// ============================================================================
const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1f4e4,ffd5dc,ffdfbf`;

const thumb = (id: number, w = 600, h = 400) =>
  `https://picsum.photos/seed/zedskillz-${id}/${w}/${h}`;

// ============================================================================
// CURRENT USER (Student by default — switchable via UI)
// ============================================================================
export const currentUser: User = {
  id: "u-student-1",
  name: "Chitalu Banda",
  email: "chitalu.banda@zedskillz.com",
  phone: "+260971234567",
  role: "student",
  avatar: avatar("Chitalu Banda"),
  bio: "Aspiring software engineer from Lusaka. Passionate about AI, mobile development, and solving local problems with technology.",
  location: "Lusaka, Zambia",
  skills: ["JavaScript", "Python", "React", "Node.js", "Problem Solving"],
  interests: ["AI/ML", "Mobile Apps", "Web Development", "Entrepreneurship"],
  education: "Computer Science, University of Zambia",
  followers: 248,
  following: 156,
  xp: 8450,
  level: 12,
  coins: 1250,
  streak: 14,
  badges: [
    { id: "b1", name: "Quick Learner", description: "Completed 5 lessons in one day", icon: "zap", earnedAt: "2026-07-10", rarity: "rare" },
    { id: "b2", name: "Streak Master", description: "14-day learning streak", icon: "flame", earnedAt: "2026-07-15", rarity: "epic" },
    { id: "b3", name: "First Certificate", description: "Earned your first certificate", icon: "award", earnedAt: "2026-06-20", rarity: "common" },
    { id: "b4", name: "Quiz Champion", description: "Score 100% on 10 quizzes", icon: "crown", earnedAt: "2026-07-01", rarity: "legendary" },
  ],
  certificates: [
    {
      id: "cert1",
      certificateNumber: "ZS-CERT-2026-0042",
      studentName: "Chitalu Banda",
      courseTitle: "Introduction to Web Development",
      instructorName: "Dr. Michael Gaus",
      issueDate: "2026-06-20",
      verificationUrl: "https://zedskillz.com/verify/ZS-CERT-2026-0042",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZS-CERT-2026-0042",
    },
  ],
  completedCourses: 1,
  verified: true,
  joinedAt: "2026-01-15",
  socialLinks: [
    { platform: "twitter", url: "https://twitter.com/chitalub" },
    { platform: "github", url: "https://github.com/chitalub" },
    { platform: "linkedin", url: "https://linkedin.com/in/chitalub" },
  ],
};

// ============================================================================
// USERS (instructors, students, parents, admins)
// ============================================================================
export const users: User[] = [
  currentUser,
  {
    id: "u-instr-1",
    name: "Dr. Michael Gaus",
    email: "michael.gaus@zedskillz.com",
    role: "instructor",
    avatar: avatar("Michael Gaus"),
    bio: "PhD in Computer Science. 15+ years building scalable systems. Passionate about teaching the next generation of African developers.",
    location: "Lusaka, Zambia",
    skills: ["System Design", "AI/ML", "Python", "Cloud Architecture"],
    interests: ["Education", "AI", "Open Source"],
    education: "PhD Computer Science, University of Cape Town",
    followers: 12480,
    following: 234,
    xp: 0,
    level: 0,
    coins: 0,
    streak: 0,
    badges: [],
    certificates: [],
    completedCourses: 0,
    verified: true,
    joinedAt: "2025-08-01",
  },
  {
    id: "u-instr-2",
    name: "Prof. Sarah Mwanza",
    email: "sarah.mwanza@zedskillz.com",
    role: "instructor",
    avatar: avatar("Sarah Mwanza"),
    bio: "Professor of Data Science. Author of 'Python for Africans'.",
    location: "Kitwe, Zambia",
    skills: ["Data Science", "Python", "Statistics", "R"],
    followers: 8920,
    following: 145,
    xp: 0,
    level: 0,
    coins: 0,
    streak: 0,
    badges: [],
    certificates: [],
    completedCourses: 0,
    verified: true,
    joinedAt: "2025-09-12",
  },
  {
    id: "u-instr-3",
    name: "James Phiri",
    email: "james.phiri@zedskillz.com",
    role: "instructor",
    avatar: avatar("James Phiri"),
    bio: "Mobile engineer turned instructor. Built 20+ apps for African markets.",
    location: "Ndola, Zambia",
    skills: ["React Native", "Flutter", "Kotlin", "Swift"],
    followers: 5630,
    following: 312,
    xp: 0,
    level: 0,
    coins: 0,
    streak: 0,
    badges: [],
    certificates: [],
    completedCourses: 0,
    verified: true,
    joinedAt: "2025-11-03",
  },
  {
    id: "u-admin-1",
    name: "Grace Tembo",
    email: "grace.tembo@zedskillz.com",
    role: "admin",
    avatar: avatar("Grace Tembo"),
    bio: "Platform administrator keeping Zedskillz safe and thriving.",
    location: "Lusaka, Zambia",
    followers: 0,
    following: 0,
    xp: 0,
    level: 0,
    coins: 0,
    streak: 0,
    badges: [],
    certificates: [],
    completedCourses: 0,
    verified: true,
    joinedAt: "2025-06-01",
  },
  {
    id: "u-parent-1",
    name: "Mr. Banda",
    email: "banda.parent@zedskillz.com",
    role: "parent",
    avatar: avatar("Mr Banda"),
    bio: "Parent of Chitalu and Thandiwe. Encouraging lifelong learning.",
    location: "Lusaka, Zambia",
    followers: 12,
    following: 5,
    xp: 0,
    level: 0,
    coins: 0,
    streak: 0,
    badges: [],
    certificates: [],
    completedCourses: 0,
    verified: true,
    joinedAt: "2026-02-10",
  },
  {
    id: "u-student-2",
    name: "Thandiwe Banda",
    email: "thandiwe.banda@zedskillz.com",
    role: "student",
    avatar: avatar("Thandiwe Banda"),
    bio: "Secondary school student exploring coding and robotics.",
    location: "Lusaka, Zambia",
    skills: ["Scratch", "Python basics"],
    followers: 89,
    following: 42,
    xp: 2100,
    level: 5,
    coins: 320,
    streak: 7,
    badges: [
      { id: "b-t1", name: "First Steps", description: "Completed first lesson", icon: "footprints", earnedAt: "2026-07-01", rarity: "common" },
    ],
    certificates: [],
    completedCourses: 0,
    verified: true,
    joinedAt: "2026-03-01",
  },
];

// ============================================================================
// COURSES
// ============================================================================
export const courses: Course[] = [
  {
    id: "c1",
    title: "Complete Web Development Bootcamp 2026",
    subtitle: "From zero to full-stack developer in 12 weeks",
    description:
      "Master HTML, CSS, JavaScript, React, Node.js, and databases in this comprehensive bootcamp. Build real-world projects including a social media app, an e-commerce platform, and a SaaS dashboard. Designed specifically for African developers with local context and examples.",
    thumbnail: thumb(1),
    promotionalVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Web Development",
    subcategory: "Full-Stack",
    difficulty: "beginner",
    language: "English",
    tags: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    price: 149.99,
    originalPrice: 299.99,
    discount: 50,
    learningObjectives: [
      "Build modern, responsive websites with HTML5 and CSS3",
      "Master JavaScript ES6+ and asynchronous programming",
      "Create dynamic frontends with React 19",
      "Build RESTful APIs with Node.js and Express",
      "Design and query databases with MongoDB and Prisma",
      "Deploy applications to production",
    ],
    requirements: [
      "A computer with internet access",
      "No prior coding experience needed",
      "Willingness to learn and practice daily",
    ],
    targetAudience: [
      "Beginners wanting to become web developers",
      "Students looking to start a tech career",
      "Professionals transitioning into tech",
    ],
    sections: [
      {
        id: "s1",
        title: "Getting Started with Web Development",
        lessons: [
          { id: "l1", title: "Course Introduction", type: "video", duration: "8:24", preview: true },
          { id: "l2", title: "How the Web Works", type: "video", duration: "12:15" },
          { id: "l3", title: "Setting Up Your Environment", type: "video", duration: "15:30", completed: true },
          { id: "l4", title: "Your First HTML Page", type: "code_editor", duration: "20:00", completed: true },
          { id: "l5", title: "Module 1 Quiz", type: "interactive", duration: "10:00" },
        ],
      },
      {
        id: "s2",
        title: "HTML5 Fundamentals",
        lessons: [
          { id: "l6", title: "HTML Document Structure", type: "video", duration: "18:42" },
          { id: "l7", title: "Text Formatting & Links", type: "video", duration: "22:10", completed: true },
          { id: "l8", title: "Images & Multimedia", type: "video", duration: "16:30" },
          { id: "l9", title: "Forms & Input Elements", type: "code_editor", duration: "25:00" },
          { id: "l10", title: "Semantic HTML", type: "text", duration: "15:00" },
          { id: "l11", title: "HTML Challenge", type: "coding_challenge", duration: "30:00" },
        ],
      },
      {
        id: "s3",
        title: "CSS3 & Modern Layouts",
        lessons: [
          { id: "l12", title: "CSS Selectors & Specificity", type: "video", duration: "20:00" },
          { id: "l13", title: "Box Model & Positioning", type: "video", duration: "25:00" },
          { id: "l14", title: "Flexbox Mastery", type: "video", duration: "30:00" },
          { id: "l15", title: "CSS Grid Layout", type: "video", duration: "28:00" },
          { id: "l16", title: "Responsive Design", type: "interactive", duration: "35:00" },
          { id: "l17", title: "Build a Landing Page", type: "coding_challenge", duration: "45:00" },
        ],
      },
      {
        id: "s4",
        title: "JavaScript Essentials",
        lessons: [
          { id: "l18", title: "Variables & Data Types", type: "video", duration: "22:00" },
          { id: "l19", title: "Functions & Scope", type: "video", duration: "28:00" },
          { id: "l20", title: "DOM Manipulation", type: "code_editor", duration: "35:00" },
          { id: "l21", title: "Async JavaScript & Promises", type: "video", duration: "32:00" },
          { id: "l22", title: "Fetch API & AJAX", type: "code_editor", duration: "30:00" },
          { id: "l23", title: "JavaScript Quiz", type: "interactive", duration: "15:00" },
        ],
      },
    ],
    status: "published",
    instructorId: "u-instr-1",
    rating: 4.8,
    reviewsCount: 1240,
    studentsCount: 8420,
    duration: "42 hours",
    publishedAt: "2026-01-10",
    lastUpdated: "2026-07-01",
    certificateEnabled: true,
    isFeatured: true,
  },
  {
    id: "c2",
    title: "Python for Data Science & AI",
    subtitle: "Learn Python, pandas, NumPy, scikit-learn, and TensorFlow",
    description:
      "Dive into the world of data science and machine learning. Learn Python from scratch, master data manipulation with pandas, build predictive models with scikit-learn, and create neural networks with TensorFlow. Includes real datasets from African contexts.",
    thumbnail: thumb(2),
    category: "Data Science",
    subcategory: "Machine Learning",
    difficulty: "intermediate",
    language: "English",
    tags: ["Python", "pandas", "NumPy", "scikit-learn", "TensorFlow", "AI"],
    price: 199.99,
    originalPrice: 349.99,
    discount: 43,
    learningObjectives: [
      "Master Python programming fundamentals",
      "Manipulate and analyze data with pandas & NumPy",
      "Visualize data with matplotlib and seaborn",
      "Build machine learning models with scikit-learn",
      "Create neural networks with TensorFlow/Keras",
      "Deploy ML models to production",
    ],
    requirements: [
      "Basic programming knowledge helpful",
      "High school mathematics",
      "Computer with 8GB+ RAM recommended",
    ],
    targetAudience: [
      "Aspiring data scientists",
      "Analysts wanting to learn ML",
      "Developers moving into AI",
    ],
    sections: [
      {
        id: "s1",
        title: "Python Foundations",
        lessons: [
          { id: "l1", title: "Why Python for Data Science", type: "video", duration: "10:00", preview: true },
          { id: "l2", title: "Python Syntax Basics", type: "code_editor", duration: "25:00" },
          { id: "l3", title: "Data Structures", type: "video", duration: "30:00" },
          { id: "l4", title: "Functions & Modules", type: "video", duration: "28:00" },
        ],
      },
      {
        id: "s2",
        title: "Data Analysis with pandas",
        lessons: [
          { id: "l5", title: "Introduction to pandas", type: "video", duration: "20:00" },
          { id: "l6", title: "DataFrames & Series", type: "code_editor", duration: "35:00" },
          { id: "l7", title: "Cleaning Real Data", type: "coding_challenge", duration: "40:00" },
          { id: "l8", title: "Grouping & Aggregation", type: "video", duration: "30:00" },
        ],
      },
    ],
    status: "published",
    instructorId: "u-instr-2",
    rating: 4.9,
    reviewsCount: 856,
    studentsCount: 4230,
    duration: "38 hours",
    publishedAt: "2026-02-15",
    lastUpdated: "2026-06-28",
    certificateEnabled: true,
    isFeatured: true,
  },
  {
    id: "c3",
    title: "Mobile App Development with React Native",
    subtitle: "Build iOS & Android apps with one codebase",
    description:
      "Learn to build production-ready mobile apps using React Native. From setup to App Store deployment, you'll build 5 complete apps including a chat app, food delivery app, and fintech wallet.",
    thumbnail: thumb(3),
    category: "Mobile Development",
    subcategory: "Cross-Platform",
    difficulty: "intermediate",
    language: "English",
    tags: ["React Native", "Mobile", "iOS", "Android", "Expo"],
    price: 179.99,
    originalPrice: 249.99,
    discount: 28,
    learningObjectives: [
      "Set up React Native development environment",
      "Build UI components for mobile",
      "Implement navigation patterns",
      "Integrate APIs and local storage",
      "Add push notifications",
      "Deploy to App Store and Play Store",
    ],
    requirements: [
      "JavaScript fundamentals",
      "Basic React knowledge",
      "Mac for iOS development (optional)",
    ],
    targetAudience: ["Web developers going mobile", "Startup founders", "Freelance developers"],
    sections: [
      {
        id: "s1",
        title: "React Native Fundamentals",
        lessons: [
          { id: "l1", title: "Welcome to React Native", type: "video", duration: "12:00", preview: true },
          { id: "l2", title: "Setting Up Expo", type: "video", duration: "18:00" },
          { id: "l3", title: "Your First Component", type: "code_editor", duration: "22:00" },
        ],
      },
    ],
    status: "published",
    instructorId: "u-instr-3",
    rating: 4.7,
    reviewsCount: 432,
    studentsCount: 2100,
    duration: "30 hours",
    publishedAt: "2026-03-20",
    lastUpdated: "2026-07-10",
    certificateEnabled: true,
    isFeatured: false,
  },
  {
    id: "c4",
    title: "Digital Marketing Mastery",
    subtitle: "SEO, social media, paid ads, and content strategy",
    description:
      "Master the complete digital marketing toolkit. Learn SEO, social media marketing, Google Ads, Facebook Ads, email marketing, and analytics. Perfect for entrepreneurs and marketers in Africa.",
    thumbnail: thumb(4),
    category: "Marketing",
    subcategory: "Digital Marketing",
    difficulty: "beginner",
    language: "English",
    tags: ["SEO", "Social Media", "Google Ads", "Email Marketing"],
    price: 0,
    isFree: true,
    learningObjectives: [
      "Master SEO fundamentals",
      "Run profitable Google & Facebook Ads",
      "Build email marketing campaigns",
      "Analyze and optimize performance",
    ],
    requirements: ["No prior experience needed"],
    targetAudience: ["Entrepreneurs", "Marketing professionals", "Small business owners"],
    sections: [
      {
        id: "s1",
        title: "Digital Marketing Foundations",
        lessons: [
          { id: "l1", title: "What is Digital Marketing?", type: "video", duration: "15:00", preview: true },
          { id: "l2", title: "The Marketing Funnel", type: "video", duration: "20:00" },
        ],
      },
    ],
    status: "published",
    instructorId: "u-instr-1",
    rating: 4.5,
    reviewsCount: 1240,
    studentsCount: 12300,
    duration: "20 hours",
    publishedAt: "2026-04-01",
    lastUpdated: "2026-07-05",
    certificateEnabled: false,
    isFeatured: false,
  },
  {
    id: "c5",
    title: "Financial Literacy for African Entrepreneurs",
    subtitle: "Manage money, raise capital, and scale your business",
    description:
      "Practical financial skills for African entrepreneurs. Learn bookkeeping, cash flow management, fundraising, and investment basics. Includes case studies from successful Zambian startups.",
    thumbnail: thumb(5),
    category: "Business",
    subcategory: "Finance",
    difficulty: "beginner",
    language: "English",
    tags: ["Finance", "Entrepreneurship", "Fundraising", "Bookkeeping"],
    price: 89.99,
    originalPrice: 149.99,
    discount: 40,
    learningObjectives: [
      "Understand financial statements",
      "Manage cash flow effectively",
      "Prepare for fundraising",
      "Evaluate investment opportunities",
    ],
    requirements: ["Basic math skills", "Business idea or ongoing business helpful"],
    targetAudience: ["Entrepreneurs", "Small business owners", "Aspiring founders"],
    sections: [
      {
        id: "s1",
        title: "Money Management Basics",
        lessons: [
          { id: "l1", title: "Why Financial Literacy Matters", type: "video", duration: "12:00", preview: true },
          { id: "l2", title: "Reading Financial Statements", type: "video", duration: "25:00" },
        ],
      },
    ],
    status: "published",
    instructorId: "u-instr-2",
    rating: 4.6,
    reviewsCount: 234,
    studentsCount: 1890,
    duration: "15 hours",
    publishedAt: "2026-05-10",
    lastUpdated: "2026-06-30",
    certificateEnabled: true,
    isFeatured: false,
  },
  {
    id: "c6",
    title: "Graphic Design with Figma",
    subtitle: "Design beautiful interfaces from scratch",
    description:
      "Master Figma and modern UI/UX design principles. Learn design thinking, prototyping, design systems, and handoff to developers.",
    thumbnail: thumb(6),
    category: "Design",
    subcategory: "UI/UX",
    difficulty: "beginner",
    language: "English",
    tags: ["Figma", "UI/UX", "Design", "Prototyping"],
    price: 129.99,
    originalPrice: 199.99,
    discount: 35,
    learningObjectives: [
      "Master Figma's interface and tools",
      "Apply design thinking methodology",
      "Create reusable design systems",
      "Prototype interactive experiences",
    ],
    requirements: ["No prior design experience needed"],
    targetAudience: ["Aspiring designers", "Developers wanting design skills", "Founders"],
    sections: [
      {
        id: "s1",
        title: "Figma Fundamentals",
        lessons: [
          { id: "l1", title: "Getting Started with Figma", type: "video", duration: "18:00", preview: true },
          { id: "l2", title: "Auto Layout Magic", type: "video", duration: "25:00" },
        ],
      },
    ],
    status: "published",
    instructorId: "u-instr-3",
    rating: 4.7,
    reviewsCount: 567,
    studentsCount: 3200,
    duration: "18 hours",
    publishedAt: "2026-04-22",
    lastUpdated: "2026-07-12",
    certificateEnabled: true,
    isFeatured: true,
  },
];

// ============================================================================
// SOCIAL POSTS
// ============================================================================
export const posts: Post[] = [
  {
    id: "p1",
    authorId: "u-instr-1",
    content:
      "Just published a new lesson on Async JavaScript! 🚀 Understanding Promises and async/await is crucial for modern web development. Check it out in the Web Development Bootcamp.",
    images: [thumb(11, 800, 500)],
    tags: ["JavaScript", "WebDev"],
    likes: 142,
    shares: 28,
    comments: [
      { id: "cm1", authorId: "u-student-2", content: "This was so helpful! Finally understood async/await 🙌", createdAt: "2026-07-17T10:30:00Z", likes: 12 },
      { id: "cm2", authorId: "u-student-1", content: "The examples really clicked for me. Thanks Dr. Gaus!", createdAt: "2026-07-17T11:15:00Z", likes: 5 },
    ],
    createdAt: "2026-07-17T09:00:00Z",
    type: "image",
  },
  {
    id: "p2",
    authorId: "u-student-1",
    content:
      "🎉 Just earned my 'Quick Learner' badge! 14-day streak and counting. The Zedskillz platform is changing how I learn. Big thanks to the community for the support! #NeverStopLearning",
    images: [],
    tags: ["Achievement", "LearningStreak"],
    likes: 89,
    shares: 12,
    comments: [
      { id: "cm3", authorId: "u-instr-1", content: "Congratulations Chitalu! Keep it up 🔥", createdAt: "2026-07-16T14:20:00Z", likes: 8 },
    ],
    createdAt: "2026-07-16T14:00:00Z",
    type: "achievement",
  },
  {
    id: "p3",
    authorId: "u-instr-2",
    content:
      "Fascinating paper on AI in African education just dropped. Key insight: AI tutors can bridge the teacher shortage gap, but only if we localize content to local languages and contexts. At Zedskillz we're building AI tutors that speak Bemba, Nyanja, Tonga and more! 🌍",
    images: [],
    tags: ["AI", "Education", "Africa"],
    likes: 312,
    shares: 87,
    comments: [
      { id: "cm4", authorId: "u-student-2", content: "This is exactly what we need!", createdAt: "2026-07-15T08:30:00Z", likes: 15 },
      { id: "cm5", authorId: "u-student-1", content: "Would love Bemba support 🙏", createdAt: "2026-07-15T09:00:00Z", likes: 22 },
    ],
    createdAt: "2026-07-15T08:00:00Z",
    type: "text",
  },
  {
    id: "p4",
    authorId: "u-instr-3",
    content:
      "Build a complete React Native chat app in 45 minutes! New tutorial just dropped. Covers real-time messaging, push notifications, and Firebase integration. Link in bio. #ReactNative #MobileDev",
    images: [thumb(13, 800, 500)],
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["ReactNative", "Tutorial"],
    likes: 234,
    shares: 56,
    comments: [],
    createdAt: "2026-07-14T16:00:00Z",
    type: "video",
  },
  {
    id: "p5",
    authorId: "u-student-2",
    content:
      "Completed my first Python lesson today! 🐍 The AI tutor explained loops so much better than my textbook. Excited to keep learning!",
    images: [],
    tags: ["Python", "Milestone"],
    likes: 67,
    shares: 4,
    comments: [
      { id: "cm6", authorId: "u-parent-1", content: "Proud of you Thandiwe! 💪", createdAt: "2026-07-13T19:00:00Z", likes: 18 },
    ],
    createdAt: "2026-07-13T18:00:00Z",
    type: "text",
  },
];

// ============================================================================
// CONVERSATIONS / MESSAGES
// ============================================================================
export const conversations: Conversation[] = [
  {
    id: "conv1",
    type: "ai",
    participants: ["u-student-1", "ai-tutor"],
    lastMessage: {
      id: "m1",
      senderId: "ai-tutor",
      content: "Great question! Let me explain async/await with a real-world example...",
      type: "text",
      createdAt: "2026-07-18T08:30:00Z",
    },
    unreadCount: 2,
  },
  {
    id: "conv2",
    type: "private",
    participants: ["u-student-1", "u-instr-1"],
    lastMessage: {
      id: "m2",
      senderId: "u-instr-1",
      content: "Sure, let's schedule a 1:1 for tomorrow at 3pm.",
      type: "text",
      createdAt: "2026-07-17T15:45:00Z",
    },
    unreadCount: 1,
  },
  {
    id: "conv3",
    type: "course",
    participants: ["u-student-1", "u-student-2", "u-instr-1"],
    lastMessage: {
      id: "m3",
      senderId: "u-student-2",
      content: "Has anyone finished the CSS Grid challenge?",
      type: "text",
      createdAt: "2026-07-17T11:20:00Z",
    },
    unreadCount: 5,
  },
  {
    id: "conv4",
    type: "group",
    participants: ["u-student-1", "u-student-2", "u-instr-2"],
    lastMessage: {
      id: "m4",
      senderId: "u-instr-2",
      content: "Don't forget the data science study group meets Friday!",
      type: "text",
      createdAt: "2026-07-16T14:00:00Z",
    },
    unreadCount: 0,
  },
];

export const messages: Record<string, { id: string; senderId: string; content: string; type: "text" | "image" | "file" | "voice"; createdAt: string; read?: boolean }[]> = {
  conv1: [
    { id: "m1", senderId: "u-student-1", content: "Hi! I'm stuck on the async/await lesson. Can you explain what a Promise is?", type: "text", createdAt: "2026-07-18T08:25:00Z" },
    { id: "m2", senderId: "ai-tutor", content: "Of course! A Promise is like a restaurant buzzer. When you order food, you get a buzzer (Promise) that will eventually notify you when your food (result) is ready, or tell you if something went wrong (rejection).", type: "text", createdAt: "2026-07-18T08:26:00Z" },
    { id: "m3", senderId: "u-student-1", content: "That makes sense! So async/await is just syntax to wait for the buzzer?", type: "text", createdAt: "2026-07-18T08:28:00Z" },
    { id: "m4", senderId: "ai-tutor", content: "Exactly! `await` pauses your function until the Promise resolves. It's cleaner than chaining `.then()`. Want me to show a code example?", type: "text", createdAt: "2026-07-18T08:30:00Z" },
  ],
  conv2: [
    { id: "m1", senderId: "u-student-1", content: "Hi Dr. Gaus, could I get some help with the capstone project?", type: "text", createdAt: "2026-07-17T15:30:00Z" },
    { id: "m2", senderId: "u-instr-1", content: "Of course! What's the issue?", type: "text", createdAt: "2026-07-17T15:35:00Z" },
    { id: "m3", senderId: "u-student-1", content: "I'm not sure how to structure the database. Could we hop on a call?", type: "text", createdAt: "2026-07-17T15:40:00Z" },
    { id: "m4", senderId: "u-instr-1", content: "Sure, let's schedule a 1:1 for tomorrow at 3pm.", type: "text", createdAt: "2026-07-17T15:45:00Z" },
  ],
  conv3: [
    { id: "m1", senderId: "u-student-2", content: "Hey everyone! Anyone working on the CSS Grid lesson?", type: "text", createdAt: "2026-07-17T10:00:00Z" },
    { id: "m2", senderId: "u-student-1", content: "Yeah! Just finished it. The trick is using `grid-template-areas`.", type: "text", createdAt: "2026-07-17T10:15:00Z" },
    { id: "m3", senderId: "u-student-2", content: "Has anyone finished the CSS Grid challenge?", type: "text", createdAt: "2026-07-17T11:20:00Z" },
  ],
  conv4: [
    { id: "m1", senderId: "u-instr-2", content: "Welcome to the data science study group!", type: "text", createdAt: "2026-07-16T13:50:00Z" },
    { id: "m2", senderId: "u-instr-2", content: "Don't forget the data science study group meets Friday!", type: "text", createdAt: "2026-07-16T14:00:00Z" },
  ],
};

// ============================================================================
// NOTIFICATIONS
// ============================================================================
export const notifications: Notification[] = [
  {
    id: "n1",
    userId: "u-student-1",
    type: "live_class",
    title: "Live class starting soon",
    message: "Q&A with Dr. Gaus starts in 30 minutes",
    read: false,
    createdAt: "2026-07-18T09:30:00Z",
    actionUrl: "/live-classes",
  },
  {
    id: "n2",
    userId: "u-student-1",
    type: "achievement",
    title: "New badge earned!",
    message: "You earned the 'Streak Master' badge 🔥",
    read: false,
    createdAt: "2026-07-18T08:00:00Z",
  },
  {
    id: "n3",
    userId: "u-student-1",
    type: "course_update",
    title: "New lesson added",
    message: "Module 4: JavaScript Essentials is now available",
    read: false,
    createdAt: "2026-07-17T16:00:00Z",
    actionUrl: "/courses/c1",
  },
  {
    id: "n4",
    userId: "u-student-1",
    type: "assignment",
    title: "Assignment due tomorrow",
    message: "HTML Challenge is due in 24 hours",
    read: true,
    createdAt: "2026-07-17T10:00:00Z",
  },
  {
    id: "n5",
    userId: "u-student-1",
    type: "social",
    title: "Dr. Gaus replied to your comment",
    message: "Congratulations Chitalu! Keep it up 🔥",
    read: true,
    createdAt: "2026-07-16T14:20:00Z",
  },
  {
    id: "n6",
    userId: "u-student-1",
    type: "payment",
    title: "Payment successful",
    message: "Your course 'Python for Data Science' was purchased successfully",
    read: true,
    createdAt: "2026-07-15T12:00:00Z",
  },
];

// ============================================================================
// PAYMENTS
// ============================================================================
export const payments: Payment[] = [
  { id: "pay1", userId: "u-student-1", courseId: "c1", amount: 149.99, currency: "USD", method: "Visa ****4242", status: "completed", type: "course_purchase", createdAt: "2026-01-20T10:00:00Z", invoiceNumber: "INV-2026-0042" },
  { id: "pay2", userId: "u-student-1", courseId: "c2", amount: 199.99, currency: "USD", method: "MTN Mobile Money", status: "completed", type: "course_purchase", createdAt: "2026-07-15T12:00:00Z", invoiceNumber: "INV-2026-0156" },
  { id: "pay3", userId: "u-student-1", amount: 29.99, currency: "USD", method: "PayPal", status: "completed", type: "subscription", createdAt: "2026-06-01T00:00:00Z", invoiceNumber: "INV-2026-0098" },
  { id: "pay4", userId: "u-instr-1", amount: 2450.00, currency: "USD", method: "Bank Transfer", status: "completed", type: "payout", createdAt: "2026-07-01T00:00:00Z", invoiceNumber: "PO-2026-0042" },
  { id: "pay5", userId: "u-student-1", amount: 0, currency: "USD", method: "Coupon ZEDSKILLZ50", status: "completed", type: "course_purchase", createdAt: "2026-01-20T10:00:00Z", invoiceNumber: "INV-2026-0042" },
];

// ============================================================================
// LIVE CLASSES
// ============================================================================
export const liveClasses: LiveClass[] = [
  { id: "lc1", title: "Web Dev Q&A with Dr. Gaus", courseId: "c1", instructorId: "u-instr-1", scheduledAt: "2026-07-18T10:00:00Z", duration: 60, platform: "zoom", meetingUrl: "https://zoom.us/j/1234567890", attendees: 234, status: "scheduled" },
  { id: "lc2", title: "Python Data Science Live", courseId: "c2", instructorId: "u-instr-2", scheduledAt: "2026-07-19T14:00:00Z", duration: 90, platform: "google_meet", meetingUrl: "https://meet.google.com/abc-defg-hij", attendees: 156, status: "scheduled" },
  { id: "lc3", title: "React Native Workshop", courseId: "c3", instructorId: "u-instr-3", scheduledAt: "2026-07-20T16:00:00Z", duration: 120, platform: "zoom", meetingUrl: "https://zoom.us/j/0987654321", attendees: 89, status: "scheduled" },
  { id: "lc4", title: "Intro to JavaScript", courseId: "c1", instructorId: "u-instr-1", scheduledAt: "2026-07-15T10:00:00Z", duration: 60, platform: "zoom", meetingUrl: "https://zoom.us/j/1111111111", attendees: 412, status: "ended", recordingUrl: "https://example.com/recording" },
];

// ============================================================================
// LEADERBOARD
// ============================================================================
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "u-x1", name: "Mulenga Phiri", avatar: avatar("Mulenga Phiri"), xp: 24580, level: 24, streak: 89, coursesCompleted: 12, trend: "same" },
  { rank: 2, userId: "u-x2", name: "Esther Mumba", avatar: avatar("Esther Mumba"), xp: 22340, level: 22, streak: 67, coursesCompleted: 10, trend: "up" },
  { rank: 3, userId: "u-x3", name: "David Sichone", avatar: avatar("David Sichone"), xp: 19870, level: 20, streak: 54, coursesCompleted: 9, trend: "up" },
  { rank: 4, userId: "u-x4", name: "Ruth Kaunda", avatar: avatar("Ruth Kaunda"), xp: 17240, level: 18, streak: 45, coursesCompleted: 8, trend: "down" },
  { rank: 5, userId: "u-x5", name: "Joseph Lungu", avatar: avatar("Joseph Lungu"), xp: 15680, level: 16, streak: 38, coursesCompleted: 7, trend: "up" },
  { rank: 6, userId: "u-x6", name: "Grace Banda", avatar: avatar("Grace Banda"), xp: 12340, level: 14, streak: 21, coursesCompleted: 6, trend: "same" },
  { rank: 7, userId: "u-student-1", name: "Chitalu Banda", avatar: avatar("Chitalu Banda"), xp: 8450, level: 12, streak: 14, coursesCompleted: 1, trend: "up" },
  { rank: 8, userId: "u-x7", name: "Brian Tembo", avatar: avatar("Brian Tembo"), xp: 7890, level: 11, streak: 12, coursesCompleted: 4, trend: "down" },
  { rank: 9, userId: "u-x8", name: "Patricia Nyirenda", avatar: avatar("Patricia Nyirenda"), xp: 6230, level: 9, streak: 9, coursesCompleted: 3, trend: "up" },
  { rank: 10, userId: "u-student-2", name: "Thandiwe Banda", avatar: avatar("Thandiwe Banda"), xp: 2100, level: 5, streak: 7, coursesCompleted: 0, trend: "up" },
];

// ============================================================================
// SUPPORT TICKETS
// ============================================================================
export const supportTickets: SupportTicket[] = [
  { id: "t1", subject: "Cannot access certificate", userId: "u-student-1", priority: "medium", status: "open", category: "Certificates", createdAt: "2026-07-17T10:00:00Z", lastReply: "2026-07-17T11:30:00Z" },
  { id: "t2", subject: "Payment not reflecting", userId: "u-student-2", priority: "high", status: "in_progress", category: "Payments", createdAt: "2026-07-16T14:00:00Z", lastReply: "2026-07-16T16:00:00Z" },
  { id: "t3", subject: "AI Tutor not responding", userId: "u-x4", priority: "high", status: "open", category: "AI Tutor", createdAt: "2026-07-15T09:00:00Z", lastReply: "2026-07-15T10:00:00Z" },
  { id: "t4", subject: "How to download lessons?", userId: "u-x5", priority: "low", status: "resolved", category: "Mobile App", createdAt: "2026-07-14T12:00:00Z", lastReply: "2026-07-14T14:00:00Z" },
  { id: "t5", subject: "Course refund request", userId: "u-x6", priority: "medium", status: "closed", category: "Refunds", createdAt: "2026-07-10T08:00:00Z", lastReply: "2026-07-12T10:00:00Z" },
];

// ============================================================================
// AUDIT LOGS
// ============================================================================
export const auditLogs: AuditLog[] = [
  { id: "a1", userId: "u-admin-1", userName: "Grace Tembo", action: "Approved course", resource: "Course: React Native Bootcamp", ipAddress: "102.141.24.10", timestamp: "2026-07-18T09:15:00Z", status: "success" },
  { id: "a2", userId: "u-instr-1", userName: "Dr. Michael Gaus", action: "Published lesson", resource: "Lesson: Async JavaScript", ipAddress: "102.141.24.11", timestamp: "2026-07-18T08:30:00Z", status: "success" },
  { id: "a3", userId: "u-x9", userName: "Unknown", action: "Failed login attempt", resource: "Auth", ipAddress: "45.227.255.206", timestamp: "2026-07-18T07:45:00Z", status: "failed" },
  { id: "a4", userId: "u-admin-1", userName: "Grace Tembo", action: "Updated system settings", resource: "Settings: AI Provider", ipAddress: "102.141.24.10", timestamp: "2026-07-17T16:20:00Z", status: "success" },
  { id: "a5", userId: "u-student-1", userName: "Chitalu Banda", action: "Purchased course", resource: "Course: Python for Data Science", ipAddress: "102.141.24.50", timestamp: "2026-07-15T12:00:00Z", status: "success" },
  { id: "a6", userId: "u-admin-1", userName: "Grace Tembo", action: "Suspended user", resource: "User: spam_account_42", ipAddress: "102.141.24.10", timestamp: "2026-07-14T11:00:00Z", status: "warning" },
];

// ============================================================================
// COUPONS
// ============================================================================
export const coupons: Coupon[] = [
  { id: "cp1", code: "ZEDSKILLZ50", type: "percentage", value: 50, usageLimit: 1000, usedCount: 423, expiresAt: "2026-12-31", active: true },
  { id: "cp2", code: "WELCOME20", type: "percentage", value: 20, usageLimit: 5000, usedCount: 1245, expiresAt: "2026-09-30", active: true },
  { id: "cp3", code: "FLAT30", type: "fixed", value: 30, usageLimit: 500, usedCount: 89, expiresAt: "2026-08-31", active: true },
  { id: "cp4", code: "SUMMER25", type: "percentage", value: 25, usageLimit: 2000, usedCount: 2000, expiresAt: "2026-08-15", active: false },
];

// ============================================================================
// COMMUNITIES
// ============================================================================
export const communities: Community[] = [
  { id: "cm1", name: "Zambian Developers", description: "Connect with developers across Zambia. Share projects, get feedback, find collaborators.", members: 3240, category: "Programming", banner: thumb(21, 800, 200), joined: true },
  { id: "cm2", name: "AI & ML Africa", description: "Discussion on AI, ML, and data science with an African lens.", members: 5680, category: "AI", banner: thumb(22, 800, 200), joined: true },
  { id: "cm3", name: "Women in Tech Zambia", description: "Empowering women in technology across Zambia.", members: 1890, category: "Community", banner: thumb(23, 800, 200), joined: false },
  { id: "cm4", name: "Mobile Devs Africa", description: "For mobile developers building for African markets.", members: 2340, category: "Mobile", banner: thumb(24, 800, 200), joined: false },
  { id: "cm5", name: "Student Entrepreneurs", description: "Turn your skills into a business.", members: 1560, category: "Business", banner: thumb(25, 800, 200), joined: false },
  { id: "cm6", name: "Python Beginners", description: "Just starting with Python? Join us!", members: 4120, category: "Programming", banner: thumb(26, 800, 200), joined: true },
];

// ============================================================================
// REVIEWS
// ============================================================================
export const reviews: Review[] = [
  { id: "r1", courseId: "c1", studentId: "u-x1", studentName: "Mulenga Phiri", avatar: avatar("Mulenga Phiri"), rating: 5, comment: "Best web dev course I've ever taken. Dr. Gaus explains everything so clearly. Got my first dev job after completing!", createdAt: "2026-07-10T10:00:00Z", helpful: 42 },
  { id: "r2", courseId: "c1", studentId: "u-x2", studentName: "Esther Mumba", avatar: avatar("Esther Mumba"), rating: 5, comment: "Loved the African context in the examples. Made it relatable. Highly recommend!", createdAt: "2026-07-08T14:00:00Z", helpful: 28 },
  { id: "r3", courseId: "c1", studentId: "u-x3", studentName: "David Sichone", avatar: avatar("David Sichone"), rating: 4, comment: "Great course overall. Some sections felt rushed but the projects are excellent.", createdAt: "2026-07-05T09:00:00Z", helpful: 15 },
  { id: "r4", courseId: "c1", studentId: "u-x4", studentName: "Ruth Kaunda", avatar: avatar("Ruth Kaunda"), rating: 5, comment: "The AI tutor is a game changer! It's like having a personal mentor 24/7.", createdAt: "2026-07-03T16:00:00Z", helpful: 33 },
  { id: "r5", courseId: "c1", studentId: "u-student-1", studentName: "Chitalu Banda", avatar: avatar("Chitalu Banda"), rating: 5, comment: "Coming from zero coding experience, this course made everything click. The community is super supportive too.", createdAt: "2026-06-25T11:00:00Z", helpful: 21 },
];

// ============================================================================
// PARENT PORTAL — Children progress reports
// ============================================================================
export const childrenReports: StudentProgressReport[] = [
  {
    studentId: "u-student-1",
    studentName: "Chitalu Banda",
    avatar: avatar("Chitalu Banda"),
    enrolledCourses: 3,
    completedCourses: 1,
    averageProgress: 64,
    averageGrade: 87,
    learningStreak: 14,
    timeSpent: 124,
    weakTopics: ["Async JavaScript", "Database Design"],
    strongTopics: ["HTML/CSS", "Python Basics", "Git"],
    recentActivities: [
      { type: "lesson_completed", description: "Completed 'Your First HTML Page'", date: "2026-07-17T16:00:00Z" },
      { type: "quiz_passed", description: "Passed Module 1 Quiz with 92%", date: "2026-07-16T14:00:00Z" },
      { type: "ai_session", description: "30-min AI tutor session on JavaScript", date: "2026-07-16T10:00:00Z" },
      { type: "achievement", description: "Earned 'Streak Master' badge", date: "2026-07-15T20:00:00Z" },
    ],
    upcomingAssignments: [
      { title: "HTML Challenge", course: "Web Dev Bootcamp", dueDate: "2026-07-20T23:59:00Z" },
      { title: "Python Data Analysis", course: "Python for DS", dueDate: "2026-07-25T23:59:00Z" },
    ],
    certificates: [
      {
        id: "cert1",
        certificateNumber: "ZS-CERT-2026-0042",
        studentName: "Chitalu Banda",
        courseTitle: "Introduction to Web Development",
        instructorName: "Dr. Michael Gaus",
        issueDate: "2026-06-20",
        verificationUrl: "https://zedskillz.com/verify/ZS-CERT-2026-0042",
        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZS-CERT-2026-0042",
      },
    ],
    aiUsageHours: 18,
  },
  {
    studentId: "u-student-2",
    studentName: "Thandiwe Banda",
    avatar: avatar("Thandiwe Banda"),
    enrolledCourses: 2,
    completedCourses: 0,
    averageProgress: 32,
    averageGrade: 78,
    learningStreak: 7,
    timeSpent: 45,
    weakTopics: ["Variables", "Functions"],
    strongTopics: ["Scratch Programming"],
    recentActivities: [
      { type: "lesson_completed", description: "Completed 'What is Python?'", date: "2026-07-17T15:00:00Z" },
      { type: "ai_session", description: "15-min AI tutor session on variables", date: "2026-07-16T11:00:00Z" },
      { type: "quiz_attempted", description: "Attempted Python Basics Quiz (70%)", date: "2026-07-15T14:00:00Z" },
    ],
    upcomingAssignments: [
      { title: "First Python Program", course: "Python for Beginners", dueDate: "2026-07-22T23:59:00Z" },
    ],
    certificates: [],
    aiUsageHours: 6,
  },
];

// ============================================================================
// ALL BADGES & ACHIEVEMENTS DEFINITIONS
// ============================================================================
export const allBadges: Badge[] = [
  { id: "ab1", name: "First Steps", description: "Complete your first lesson", icon: "footprints", earnedAt: "", rarity: "common" },
  { id: "ab2", name: "Quick Learner", description: "Complete 5 lessons in one day", icon: "zap", earnedAt: "", rarity: "rare" },
  { id: "ab3", name: "Streak Master", description: "Maintain a 14-day streak", icon: "flame", earnedAt: "", rarity: "epic" },
  { id: "ab4", name: "Quiz Champion", description: "Score 100% on 10 quizzes", icon: "crown", earnedAt: "", rarity: "legendary" },
  { id: "ab5", name: "First Certificate", description: "Earn your first certificate", icon: "award", earnedAt: "", rarity: "common" },
  { id: "ab6", name: "Social Butterfly", description: "Get 100 followers", icon: "users", earnedAt: "", rarity: "rare" },
  { id: "ab7", name: "Helper", description: "Answer 50 questions in forums", icon: "heart", earnedAt: "", rarity: "rare" },
  { id: "ab8", name: "Marathon Learner", description: "Study 100 hours total", icon: "trophy", earnedAt: "", rarity: "epic" },
  { id: "ab9", name: "Night Owl", description: "Study after midnight 5 times", icon: "moon", earnedAt: "", rarity: "common" },
  { id: "ab10", name: "Early Bird", description: "Study before 6am 5 times", icon: "sunrise", earnedAt: "", rarity: "common" },
  { id: "ab11", name: "Polyglot", description: "Complete courses in 3 languages", icon: "languages", earnedAt: "", rarity: "epic" },
  { id: "ab12", name: "Mentor", description: "Mentor 5 students", icon: "graduation-cap", earnedAt: "", rarity: "legendary" },
];

export const achievements: Achievement[] = [
  { id: "ach1", title: "Complete 10 Lessons", description: "You're making great progress!", icon: "book-open", progress: 7, target: 10, reward: { xp: 500, coins: 100 } },
  { id: "ach2", title: "30-Day Streak", description: "Consistency is key to mastery", icon: "flame", progress: 14, target: 30, reward: { xp: 1000, coins: 250 } },
  { id: "ach3", title: "Earn 5 Certificates", description: "Build your professional portfolio", icon: "award", progress: 1, target: 5, reward: { xp: 2000, coins: 500 } },
  { id: "ach4", title: "Help 50 Students", description: "Share your knowledge with the community", icon: "heart", progress: 12, target: 50, reward: { xp: 1500, coins: 300 } },
  { id: "ach5", title: "Reach Level 20", description: "Become a senior learner", icon: "trending-up", progress: 12, target: 20, reward: { xp: 3000, coins: 750 } },
];

// ============================================================================
// CATEGORIES
// ============================================================================
export const categories = [
  { id: "cat1", name: "Web Development", icon: "code", coursesCount: 142, color: "from-emerald-500 to-teal-500" },
  { id: "cat2", name: "Data Science", icon: "bar-chart-3", coursesCount: 89, color: "from-violet-500 to-purple-500" },
  { id: "cat3", name: "Mobile Development", icon: "smartphone", coursesCount: 67, color: "from-rose-500 to-pink-500" },
  { id: "cat4", name: "Design", icon: "palette", coursesCount: 54, color: "from-amber-500 to-orange-500" },
  { id: "cat5", name: "Marketing", icon: "megaphone", coursesCount: 78, color: "from-cyan-500 to-blue-500" },
  { id: "cat6", name: "Business", icon: "briefcase", coursesCount: 96, color: "from-lime-500 to-green-500" },
  { id: "cat7", name: "AI & ML", icon: "brain", coursesCount: 63, color: "from-fuchsia-500 to-pink-500" },
  { id: "cat8", name: "Languages", icon: "languages", coursesCount: 34, color: "from-sky-500 to-indigo-500" },
];

// ============================================================================
// PLATFORM STATS (for admin dashboard)
// ============================================================================
export const platformStats = {
  totalUsers: 124_503,
  activeToday: 18_420,
  totalCourses: 1_847,
  totalRevenue: 892_340,
  monthlyRevenue: 142_500,
  completionRate: 68.4,
  aiUsageHours: 24_580,
  countries: 12,
};

export const weeklyActiveUsersData = [
  { day: "Mon", users: 14200 },
  { day: "Tue", users: 15800 },
  { day: "Wed", users: 16400 },
  { day: "Thu", users: 15100 },
  { day: "Fri", users: 17800 },
  { day: "Sat", users: 13200 },
  { day: "Sun", users: 18420 },
];

export const revenueData = [
  { month: "Jan", revenue: 78_000, courses: 420 },
  { month: "Feb", revenue: 92_000, courses: 510 },
  { month: "Mar", revenue: 105_000, courses: 580 },
  { month: "Apr", revenue: 118_000, courses: 640 },
  { month: "May", revenue: 124_000, courses: 720 },
  { month: "Jun", revenue: 135_000, courses: 780 },
  { month: "Jul", revenue: 142_500, courses: 845 },
];

// ============================================================================
// AI TUTOR SAMPLE RESPONSES
// ============================================================================
export const aiTutorSuggestions = [
  "Explain async/await with an example",
  "Quiz me on JavaScript arrays",
  "Summarize this lesson",
  "Generate flashcards on CSS",
  "What should I learn next?",
  "Translate this lesson to Bemba",
];

export const aiTutorConversation = [
  { id: "ai1", role: "user" as const, content: "Can you explain what a Promise is in JavaScript?", time: "10:24 AM" },
  { id: "ai2", role: "assistant" as const, content: "A Promise is an object representing the eventual completion or failure of an asynchronous operation. Think of it like a restaurant buzzer — you place your order, get a buzzer (the Promise), and it'll notify you when your food is ready (resolve) or if something went wrong (reject).\n\nHere's an example:\n```javascript\nconst orderFood = new Promise((resolve, reject) => {\n  const isAvailable = true;\n  if (isAvailable) {\n    resolve('Your nshima is ready!');\n  } else {\n    reject('Sorry, we\\'re out of nshima.');\n  }\n});\n\norderFood\n  .then(meal => console.log(meal))\n  .catch(error => console.error(error));\n```\n\nWould you like to see how async/await makes this even cleaner?", time: "10:24 AM" },
  { id: "ai3", role: "user" as const, content: "Yes please! And how does error handling work with async/await?", time: "10:25 AM" },
  { id: "ai4", role: "assistant" as const, content: "Great question! With async/await, you use try/catch for error handling:\n\n```javascript\nasync function getOrder() {\n  try {\n    const meal = await orderFood;\n    console.log(meal); // 'Your nshima is ready!'\n  } catch (error) {\n    console.error('Order failed:', error);\n  }\n}\n```\n\n**Key points:**\n1. `await` can only be used inside `async` functions\n2. It pauses execution until the Promise resolves\n3. Errors are caught with `try/catch` instead of `.catch()`\n4. The code reads top-to-bottom, like synchronous code\n\nThis is much cleaner than chaining `.then()` calls. Want me to generate a quick quiz to test your understanding?", time: "10:26 AM" },
];
