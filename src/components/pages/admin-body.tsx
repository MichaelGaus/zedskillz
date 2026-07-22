"use client";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { useState } from "react";

// Sample data
const RECENT_COURSES = [
  { id: "c1", title: "Advanced Neural Architectures", students: 342, revenue: "K 89,250", status: "active", lessons: 24, rating: 4.8 },
  { id: "c2", title: "Full-Stack Web Development", students: 287, revenue: "K 71,750", status: "active", lessons: 32, rating: 4.7 },
  { id: "c3", title: "Data Analysis & Visualization", students: 198, revenue: "K 47,520", status: "active", lessons: 18, rating: 4.9 },
  { id: "c4", title: "UI/UX Product Design", students: 156, revenue: "K 37,440", status: "draft", lessons: 30, rating: 4.6 },
  { id: "c5", title: "Cyber Defense: Ethical Hacking", students: 89, revenue: "K 44,500", status: "active", lessons: 45, rating: 5.0 },
  { id: "c6", title: "Flutter & Dart Mobile Dev", students: 134, revenue: "K 33,500", status: "active", lessons: 32, rating: 4.5 },
  { id: "c7", title: "Cloud Computing Basics", students: 67, revenue: "K 0", status: "pending", lessons: 12, rating: 4.3 },
];

const RECENT_USERS = [
  { id: "u1", name: "Chanda Musonda", email: "chanda.m@example.com", role: "Student", status: "active", joined: "2 days ago", courses: 3 },
  { id: "u2", name: "Mrs. Mutale Kapambwe", email: "mutale.k@example.com", role: "Educator", status: "active", joined: "1 week ago", courses: 8 },
  { id: "u3", name: "B. Lungu", email: "b.lungu@example.com", role: "Mentor", status: "active", joined: "2 weeks ago", courses: 12 },
  { id: "u4", name: "Loveness Zulu", email: "l.zulu@example.com", role: "Student", status: "suspended", joined: "3 weeks ago", courses: 5 },
  { id: "u5", name: "Prof. Namwali Banda", email: "n.banda@example.com", role: "Educator", status: "active", joined: "1 month ago", courses: 15 },
  { id: "u6", name: "C. Mwansa", email: "c.mwansa@example.com", role: "Student", status: "active", joined: "1 month ago", courses: 6 },
];

const AI_MODELS = [
  { id: "m1", name: "ZedAI Tutor v2.4", queries: "45.2k", latency: "124ms", uptime: "99.8%", status: "healthy" },
  { id: "m2", name: "Content Generator", queries: "12.8k", latency: "210ms", uptime: "99.2%", status: "healthy" },
  { id: "m3", name: "Assessment Engine", queries: "8.4k", latency: "340ms", uptime: "98.5%", status: "warning" },
  { id: "m4", name: "Recommendation System", queries: "22.1k", latency: "89ms", uptime: "99.9%", status: "healthy" },
];

type AdminTab = "dashboard" | "courses" | "users" | "ai-monitor";

export function AdminBody() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [courseSearch, setCourseSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<"all" | "active" | "draft" | "pending">("all");

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700 border-green-200",
      draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
      pending: "bg-blue-100 text-blue-700 border-blue-200",
      suspended: "bg-red-100 text-red-700 border-red-200",
      healthy: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
    };
    return styles[status] || "bg-surface-variant text-on-surface-variant";
  };

  const filteredCourses = RECENT_COURSES.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesFilter = courseFilter === "all" || c.status === courseFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = RECENT_USERS.filter((u) => {
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "courses", label: "Courses", icon: "library_books" },
    { id: "users", label: "Users", icon: "group" },
    { id: "ai-monitor", label: "AI Monitor", icon: "psychology" },
  ];

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar activePage="admin-dashboard" />

        <main data-page-main className="flex-1 flex flex-col min-w-0 bg-surface h-full overflow-hidden">
          {/* Top bar (uses div instead of header so GlobalTopbar doesn't hide it) */}
          <div className="w-full bg-surface/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-4 md:px-6 border-b border-outline-variant">
            <div className="flex items-center gap-4">
              <button className="md:hidden material-symbols-outlined p-2 hover:bg-surface-variant/50 rounded-full transition-colors active:scale-95">menu</button>
              <h2 className="font-headline-md text-headline-md text-primary tracking-tight">Admin Panel</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Quick action buttons */}
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>New Course</span>
              </button>
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl text-sm font-bold hover:bg-surface-variant transition-all active:scale-95">
                <span className="material-symbols-outlined text-sm">person_add</span>
                <span>Add User</span>
              </button>
              <button className="relative p-2 hover:bg-surface-variant/50 rounded-full transition-colors" title="Notifications">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
              </button>
              <div className="w-9 h-9 rounded-full bg-cover bg-center border border-outline-variant" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcOwY5S3gT0TvH3JUfj0hIvLnNTQ_av4UWlUCCTtil9cWD9bJOV4TngwAPhYujZFpx7WgNyKp8C0joIyQ765Ahw0zVSpFOrGyR9Ry71D6TFI9B2H8ASoUIDiSFU8YqI5mn2MmIMbUAPOFmtf_c9pLDTvUq87mQA_Y6dcTnfP2ZK_yccLk2VI4Po_zIajUbvYckJD584_LPMRxezBBntxCba1jO9Sdcb5VNu-zw81RmyieI4V3BX_E1ig')"}}></div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-1 px-4 md:px-6 pt-4 pb-0 border-b border-outline-variant bg-surface">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-primary-container text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
            <div className="flex-1" />
            {/* Time range selector */}
            <div className="hidden md:flex items-center gap-1 bg-surface-container rounded-lg p-1">
              <button className="px-3 py-1.5 text-xs font-bold bg-white rounded-md shadow-sm">7D</button>
              <button className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md transition-colors">30D</button>
              <button className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md transition-colors">ALL</button>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6">
            {/* ===== DASHBOARD TAB ===== */}
            {activeTab === "dashboard" && (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary-container/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1'}}>group</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-label-caps font-label-caps opacity-70 mb-1">TOTAL USERS</p>
                    <p className="text-display-md font-display-md text-on-surface">24,512</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="text-xs font-semibold text-primary hover:underline">View all users</button>
                      <span className="text-xs text-on-surface-variant/50">• +342 this week</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-tertiary-container/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-on-tertiary-container" style={{fontVariationSettings: '"FILL" 1'}}>payments</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span> 8.4%
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-label-caps font-label-caps opacity-70 mb-1">REVENUE (ZMK)</p>
                    <p className="text-display-md font-display-md text-on-surface">K 85,240</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="text-xs font-semibold text-primary hover:underline">View reports</button>
                      <span className="text-xs text-on-surface-variant/50">• +K 6.2k today</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-secondary-container/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-on-secondary-container" style={{fontVariationSettings: '"FILL" 1'}}>local_library</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">remove</span> 0%
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-label-caps font-label-caps opacity-70 mb-1">ACTIVE COURSES</p>
                    <p className="text-display-md font-display-md text-on-surface">156</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="text-xs font-semibold text-primary hover:underline">Manage courses</button>
                      <span className="text-xs text-on-surface-variant/50">• 12 pending review</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary-container/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1'}}>psychology</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span> 24%
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-label-caps font-label-caps opacity-70 mb-1">AI INTERACTIONS</p>
                    <p className="text-display-md font-display-md text-on-surface">1.2M</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="text-xs font-semibold text-primary hover:underline">AI Analytics</button>
                      <span className="text-xs text-on-surface-variant/50">• +45k today</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions toolbar */}
                <div className="bg-gradient-to-r from-primary to-primary-container rounded-xl p-5 text-white">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold">Quick Actions</h3>
                      <p className="text-body-sm text-white/80 mt-1">Manage your learning platform efficiently</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-95">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Create Course
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-all active:scale-95 border border-white/20">
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Invite Users
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-all active:scale-95 border border-white/20">
                        <span className="material-symbols-outlined text-sm">campaign</span>
                        Send Announcement
                      </button>
                    </div>
                  </div>
                </div>

                {/* Charts & Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* User Growth Chart */}
                  <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface">User Growth Analytics</h3>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">Weekly registration tracking</p>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
                        <button className="px-3 py-1.5 text-xs font-bold bg-white rounded-md shadow-sm">WEEK</button>
                        <button className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md transition-colors">MONTH</button>
                        <button className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md transition-colors">YEAR</button>
                      </div>
                    </div>
                    <div className="h-64 relative">
                      {/* Bar chart */}
                      <div className="absolute inset-0 flex items-end justify-around px-2 pb-8">
                        {[40, 55, 45, 70, 85, 95, 60].map((h, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 group">
                            <div className="text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              {["1.2k", "1.8k", "1.5k", "2.4k", "3.1k", "3.8k", "2.1k"][i]}
                            </div>
                            <div
                              className={`w-10 sm:w-14 rounded-t-lg relative transition-all duration-300 group-hover:scale-105 ${
                                i === 5 ? "bg-primary shadow-md" : "bg-primary-container/30 hover:bg-primary-container/50"
                              }`}
                              style={{ height: `${h}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      {/* Grid lines */}
                      <div className="absolute inset-0 border-b border-l border-outline-variant/50">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-full border-t border-outline-variant/20 border-dashed" style={{ top: `${i * 20}%`, position: "absolute" }}></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-3 px-2 text-label-caps font-label-caps text-on-surface-variant/60">
                      <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span className="text-primary font-bold">SAT</span><span>SUN</span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-title-md text-title-md text-on-surface">Recent Activity</h3>
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">refresh</button>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                      {[
                        { icon: "person_add", color: "text-primary", title: "New Enrollment", desc: "Chanda Musonda joined 'Intro to AI'", time: "2 mins ago" },
                        { icon: "workspace_premium", color: "text-on-tertiary-container", title: "Course Completed", desc: "Loveness Zulu earned 'Digital Literacy' badge", time: "15 mins ago" },
                        { icon: "psychology", color: "text-on-primary-container", title: "AI Interaction Peak", desc: "AI Tutor handled 500+ queries in 10 mins", time: "42 mins ago" },
                        { icon: "report", color: "text-error", title: "System Alert", desc: "High latency detected in Lusaka Server Node", time: "1 hour ago" },
                        { icon: "rate_review", color: "text-primary", title: "Course Review", desc: "New review posted on 'Python for Beginners'", time: "2 hours ago" },
                      ].map((activity, i) => (
                        <div key={i} className="flex gap-3 group cursor-pointer">
                          <div className="flex flex-col items-center">
                            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
                              <span className={`material-symbols-outlined text-sm ${activity.color}`} style={{fontVariationSettings: '"FILL" 1'}}>{activity.icon}</span>
                            </div>
                            {i < 4 && <div className="w-0.5 flex-1 bg-outline-variant mt-2"></div>}
                          </div>
                          <div className={i < 4 ? "pb-4" : ""}>
                            <p className="text-body-sm font-semibold text-on-surface">{activity.title}</p>
                            <p className="text-body-sm text-on-surface-variant">{activity.desc}</p>
                            <span className="text-[11px] font-medium text-on-surface-variant/50">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 mt-3 text-primary font-bold text-body-sm border-t border-outline-variant hover:bg-surface-container transition-colors rounded-b-lg">
                      VIEW ALL ACTIVITY
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ===== COURSES TAB ===== */}
            {activeTab === "courses" && (
              <>
                {/* Courses toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Course Management</h3>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">Manage, create, and oversee all courses on the platform</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm">
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      Create Course
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-all">
                      <span className="material-symbols-outlined text-sm">download</span>
                      Export
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    {(["all", "active", "draft", "pending"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setCourseFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                          courseFilter === f
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courses table */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-container-high text-on-surface-variant text-label-caps font-label-caps">
                          <th className="px-4 py-3.5">Course</th>
                          <th className="px-4 py-3.5">Students</th>
                          <th className="px-4 py-3.5 hidden md:table-cell">Lessons</th>
                          <th className="px-4 py-3.5 hidden lg:table-cell">Rating</th>
                          <th className="px-4 py-3.5">Revenue</th>
                          <th className="px-4 py-3.5">Status</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {filteredCourses.map((course) => (
                          <tr key={course.id} className="hover:bg-surface-container/50 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
                                </div>
                                <div>
                                  <p className="text-body-sm font-semibold text-on-surface line-clamp-1">{course.title}</p>
                                  <p className="text-xs text-on-surface-variant">ID: {course.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-body-sm font-semibold text-on-surface">{course.students}</td>
                            <td className="px-4 py-3.5 text-body-sm text-on-surface-variant hidden md:table-cell">{course.lessons}</td>
                            <td className="px-4 py-3.5 hidden lg:table-cell">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-amber-500 text-sm" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                                <span className="text-body-sm font-semibold text-on-surface">{course.rating}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-body-sm font-semibold text-on-surface">{course.revenue}</td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(course.status)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  course.status === "active" ? "bg-green-500" :
                                  course.status === "draft" ? "bg-yellow-500" :
                                  course.status === "pending" ? "bg-blue-500" : "bg-gray-500"
                                }`}></span>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors" title="Edit">
                                  <span className="material-symbols-outlined text-sm text-on-surface-variant">edit</span>
                                </button>
                                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors" title="Preview">
                                  <span className="material-symbols-outlined text-sm text-on-surface-variant">visibility</span>
                                </button>
                                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors" title="More">
                                  <span className="material-symbols-outlined text-sm text-on-surface-variant">more_vert</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant bg-surface-container-high/50">
                    <p className="text-xs text-on-surface-variant">Showing {filteredCourses.length} of {RECENT_COURSES.length} courses</p>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold bg-white rounded-md shadow-sm border border-outline-variant hover:bg-surface-variant/50 transition-colors">Previous</button>
                      <button className="px-3 py-1.5 text-xs font-bold bg-primary text-on-primary rounded-md shadow-sm">1</button>
                      <button className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md border border-outline-variant transition-colors">2</button>
                      <button className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md border border-outline-variant transition-colors">3</button>
                      <button className="px-3 py-1.5 text-xs font-bold bg-white rounded-md shadow-sm border border-outline-variant hover:bg-surface-variant/50 transition-colors">Next</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ===== USERS TAB ===== */}
            {activeTab === "users" && (
              <>
                {/* Users toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">User Management</h3>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">Manage students, educators, mentors and administrators</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm">
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      Add User
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-all">
                      <span className="material-symbols-outlined text-sm">file_download</span>
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* User search */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                  <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Users table */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-container-high text-on-surface-variant text-label-caps font-label-caps">
                          <th className="px-4 py-3.5">User</th>
                          <th className="px-4 py-3.5">Role</th>
                          <th className="px-4 py-3.5 hidden md:table-cell">Courses</th>
                          <th className="px-4 py-3.5 hidden lg:table-cell">Joined</th>
                          <th className="px-4 py-3.5">Status</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-surface-container/50 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                                  {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-body-sm font-semibold text-on-surface">{user.name}</p>
                                  <p className="text-xs text-on-surface-variant">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-body-sm text-on-surface">{user.role}</span>
                            </td>
                            <td className="px-4 py-3.5 text-body-sm text-on-surface-variant hidden md:table-cell">{user.courses}</td>
                            <td className="px-4 py-3.5 text-body-sm text-on-surface-variant hidden lg:table-cell">{user.joined}</td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(user.status)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  user.status === "active" ? "bg-green-500" : "bg-red-500"
                                }`}></span>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors" title="Edit user">
                                  <span className="material-symbols-outlined text-sm text-on-surface-variant">edit</span>
                                </button>
                                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors" title="Message">
                                  <span className="material-symbols-outlined text-sm text-on-surface-variant">chat_bubble_outline</span>
                                </button>
                                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors" title="More options">
                                  <span className="material-symbols-outlined text-sm text-on-surface-variant">more_vert</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant bg-surface-container-high/50">
                    <p className="text-xs text-on-surface-variant">Showing {filteredUsers.length} of {RECENT_USERS.length} users</p>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold bg-white rounded-md shadow-sm border border-outline-variant hover:bg-surface-variant/50 transition-colors">Previous</button>
                      <button className="px-3 py-1.5 text-xs font-bold bg-primary text-on-primary rounded-md shadow-sm">1</button>
                      <button className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md border border-outline-variant transition-colors">2</button>
                      <button className="px-3 py-1.5 text-xs font-bold bg-white rounded-md shadow-sm border border-outline-variant hover:bg-surface-variant/50 transition-colors">Next</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ===== AI MONITOR TAB ===== */}
            {activeTab === "ai-monitor" && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">AI Model Monitoring</h3>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">Real-time performance metrics for all AI services</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm">
                    <span className="material-symbols-outlined text-sm">tune</span>
                    Configure
                  </button>
                </div>

                {/* AI Model Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AI_MODELS.map((model) => (
                    <div key={model.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            model.status === "healthy" ? "bg-green-100" : "bg-yellow-100"
                          }`}>
                            <span className={`material-symbols-outlined text-sm ${
                              model.status === "healthy" ? "text-green-600" : "text-yellow-600"
                            }`} style={{fontVariationSettings: '"FILL" 1'}}>psychology</span>
                          </div>
                          <div>
                            <p className="text-body-sm font-semibold text-on-surface">{model.name}</p>
                            <p className="text-xs text-on-surface-variant">Model ID: {model.id}</p>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(model.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            model.status === "healthy" ? "bg-green-500" : "bg-yellow-500"
                          }`}></span>
                          {model.status === "healthy" ? "Healthy" : "Warning"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-outline-variant">
                        <div>
                          <p className="text-label-caps text-label-caps text-on-surface-variant/60">Queries</p>
                          <p className="text-title-sm font-bold text-on-surface mt-0.5">{model.queries}</p>
                          <p className="text-[11px] text-green-600 font-medium">+12% today</p>
                        </div>
                        <div>
                          <p className="text-label-caps text-label-caps text-on-surface-variant/60">Latency</p>
                          <p className="text-title-sm font-bold text-on-surface mt-0.5">{model.latency}</p>
                          <p className="text-[11px] text-on-surface-variant/50 font-medium">Avg response</p>
                        </div>
                        <div>
                          <p className="text-label-caps text-label-caps text-on-surface-variant/60">Uptime</p>
                          <p className="text-title-sm font-bold text-on-surface mt-0.5">{model.uptime}</p>
                          <p className="text-[11px] text-on-surface-variant/50 font-medium">Last 24h</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-outline-variant">
                        <button className="text-xs font-semibold text-primary hover:underline">View details</button>
                        <button className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Logs</button>
                        <button className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Alert</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* System Health Summary */}
                <div className="bg-gradient-to-r from-surface-container-lowest to-surface-container border border-outline-variant rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                      </div>
                      <div>
                        <h4 className="font-title-sm text-title-sm text-on-surface">All Systems Operational</h4>
                        <p className="text-body-sm text-on-surface-variant">All 4 AI services are running normally. No incidents reported in the last 24 hours.</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-all">
                      <span className="material-symbols-outlined text-sm">monitoring</span>
                      View Status Page
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
