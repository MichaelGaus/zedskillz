# Zedskillz — AI-Powered Learning Platform for Africa 🌍

> Learn skills that matter. Teach what you know. Powered by AI tutors that speak your language.

Zedskillz is a modern AI-powered online learning platform that enables instructors to create and sell courses while allowing students to learn using an AI tutor, parents to monitor progress, and administrators to manage the entire ecosystem. Built specifically for African learners with local language support, mobile-first design, and offline-ready architecture.

## ✨ Features

### 👥 Multi-Role Architecture (8 user types)
- **Super Administrator** — Full platform control
- **Administrator** — Manage users, courses, payments
- **Instructor** — Create & sell courses, track revenue
- **Student** — Learn with AI tutor, earn certificates
- **Parent** — Monitor children, control screen time, approve purchases
- **School** — Manage teachers, students, curriculum
- **Organization** — Bulk enrollments, custom training
- **Guest** — Browse & preview

### 🔐 Authentication & Security
- Email, Google, Microsoft, Apple login
- Phone number registration with OTP
- Two-factor authentication (2FA)
- Biometric login (mobile)
- Session & device management
- JWT + OAuth + RBAC
- Login history & audit logs

### 📚 Course Management
- 8 course statuses: Draft → Submitted → Pending → Approved → Published → Archived
- 11 lesson types: Video, Text, Audio, PDF, Slides, Code Editor, Coding Challenge, Interactive, Live Class, External Link, Downloadable
- Zoom & Google Meet integration
- Sections, lessons, assignments, projects, quizzes, exams
- Certificates with QR codes & verification URLs

### 🤖 AI Tutor (RAG-Powered)
- Course-aware: uses Retrieval-Augmented Generation with course content
- Stays within course context (configurable)
- Explains concepts, summarizes lessons, generates quizzes & flashcards
- Translates lessons into local languages (Bemba, Nyanja, Tonga, Lozi, Kaonde, Lunda, Luvale)
- Voice conversation, speech-to-text, text-to-speech
- Recommends next lessons & suggests improvements
- Generates practice exams and study plans

### 🧠 AI Learning Engine
- Analyzes learning behavior & detects weak topics
- Creates personalized learning paths
- Predicts student performance
- Detects cheating & inactivity
- Generates daily goals & study plans

### 👨‍👩‍👧 Parent Portal
- Link & approve children
- Monitor progress, grades, attendance
- View AI usage & certificates
- Control screen time
- Approve purchases
- Receive weekly/monthly reports via email & SMS

### 🎮 Gamification
- XP, levels, coins
- 12+ badges (common, rare, epic, legendary)
- Achievements & daily streaks
- Weekly & monthly challenges
- Global leaderboard

### 💬 Social Network (LinkedIn + Facebook for learners)
- Follow/unfollow users
- Create posts (text, image, video, achievement)
- Like, comment, share, tag, mention
- Direct & group messaging
- Communities, discussion forums
- News feed & learning activity feed

### 💳 Payment System
- Stripe, PayPal, Flutterwave, PayChangu
- MTN Mobile Money, Airtel Money, Zamtel Kwacha
- Visa, MasterCard, Apple Pay, Google Pay
- Free, paid, subscriptions, bundles, coupons, gift cards
- Refunds, invoices, tax, revenue sharing, instructor payouts
- Wallet system

### 📊 Analytics & Reporting
- Student, instructor, school, organization, platform reports
- Revenue, growth, completion, engagement, AI usage
- Active users, retention, conversion rates

### 🎯 Quiz Engine
- Multiple choice, true/false, matching, fill-in-blank, essay, coding, drag-and-drop, image, video
- Timed exams, random questions, question bank
- Auto & manual grading

### 📱 Mobile-First & Offline
- Android & iOS apps
- Offline mode with background sync
- Push notifications
- Download lessons
- Biometric login

### ♿ Accessibility (WCAG 2.2)
- Keyboard navigation
- Dark mode & light mode
- High contrast
- Screen reader support
- Font scaling

## 🛠 Tech Stack

### Frontend
- **Next.js 16** (App Router, React 19, TypeScript 5)
- **Tailwind CSS 4** with **shadcn/ui** (New York style)
- **Zustand** for client state
- **React Query** for server state
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Prisma ORM** with SQLite
- **NextAuth.js v4** for authentication
- **z-ai-web-dev-sdk** for AI integration

### Design System
- Brand palette: Emerald (growth) + Amber (African sun)
- Font: Inter (system stack)
- Component library: shadcn/ui
- Mobile-first responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/MichaelGaus/zedskillz.git
cd zedskillz

# Install dependencies
bun install  # or npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

```bash
bun run dev        # Start dev server (port 3000)
bun run build      # Production build
bun run start      # Start production server
bun run lint       # Run ESLint
bun run db:push    # Push Prisma schema to database
bun run db:generate # Generate Prisma client
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with theme
│   ├── page.tsx              # Main entry — routes between pages
│   └── globals.css           # Global styles + brand tokens
├── components/
│   ├── pages/                # All page components
│   │   ├── landing.tsx       # Public marketing page
│   │   ├── auth.tsx          # Login/register/OTP/2FA/forgot
│   │   ├── student-dashboard.tsx
│   │   ├── instructor-dashboard.tsx
│   │   ├── admin-dashboard.tsx
│   │   ├── parent-portal.tsx
│   │   ├── courses-catalog.tsx
│   │   ├── course-detail.tsx
│   │   ├── course-player.tsx # Lesson player with AI tutor
│   │   ├── social-feed.tsx
│   │   ├── messaging.tsx
│   │   ├── leaderboard.tsx
│   │   ├── profile.tsx
│   │   ├── settings.tsx
│   │   ├── ai-tutor.tsx
│   │   └── live-classes.tsx
│   ├── shell/                # App shell (sidebar, topbar, footer)
│   └── shared/               # Shared components
├── lib/
│   ├── types.ts              # All TypeScript types
│   ├── mock-data.ts          # Mock data for all entities
│   ├── store.ts              # Zustand global state
│   └── utils.ts              # Utilities
└── hooks/                    # React hooks
```

## 🎨 Design System

### Brand Palette
- **Primary**: Emerald (`oklch(0.55 0.15 160)`) — Growth, Zambian flag
- **Accent**: Amber (`oklch(0.94 0.05 75)`) — African sun
- **Background**: Light cream (`oklch(0.99 0.005 145)`)
- **Foreground**: Dark emerald (`oklch(0.18 0.02 160)`)

### Typography
- **Sans**: Inter
- **Headings**: Inter Bold/Semibold
- **Body**: Inter Regular

## 🌍 Zedskillz-Specific Features

Built different for African learners:

- **AI Tutor with local language support** — Bemba, Nyanja, Tonga, Lozi, Kaonde, Lunda, Luvale, and more
- **Age-adaptive learning** — primary, secondary, tertiary, professional
- **School management portal** — for teachers and administrators
- **Offline-first mobile** — for low-connectivity rural areas with background sync
- **Scholarship & sponsorship management** — donors fund learners
- **Mentorship marketplace** — connect with industry professionals
- **Career guidance** — CV generation, interview prep, internship matching
- **Stackable micro-credentials** — digital skills pathways
- **Multi-country localization** — currencies, languages, educational systems across Africa
- **Content moderation** — for AI-generated and instructor-created content

## 📄 License

© 2026 Zedskillz. All rights reserved.

Built with ❤️ in Lusaka, Zambia.
