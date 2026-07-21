"use client";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

// ─── Types ───────────────────────────────────────────────────────────
interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface Lesson {
  id: string;
  title: string;
  type: "video" | "book" | "quiz";
  duration?: string;
  url?: string;
  status?: "draft" | "published";
  questions?: QuizQuestion[];
  // File upload fields
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileDataUrl?: string;
}

interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface TutorCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnail: string;
  status: "draft" | "published" | "archived";
  sections: CourseSection[];
  students: number;
  rating: number;
  createdAt: string;
}

type TutorTab = "dashboard" | "courses" | "ai-quiz";

// ─── Sample Data ─────────────────────────────────────────────────────
const initialCourses: TutorCourse[] = [
  {
    id: "tc1",
    title: "Introduction to Web Development",
    description: "Learn HTML, CSS, and JavaScript from scratch. Build your first website.",
    category: "Technology",
    difficulty: "beginner",
    price: 0,
    thumbnail: "",
    status: "published",
    students: 234,
    rating: 4.7,
    createdAt: "2024-03-15",
    sections: [
      {
        id: "ts1",
        title: "HTML Fundamentals",
        lessons: [
          { id: "tl1", title: "What is HTML?", type: "video", duration: "12:30", status: "published" },
          { id: "tl2", title: "HTML Tags & Elements", type: "video", duration: "18:45", status: "published" },
          { id: "tl3", title: "HTML Basics Quiz", type: "quiz", status: "published", questions: [
            { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language" },
            { question: "Which tag is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: "<h1>" },
            { question: "What is the correct HTML for creating a hyperlink?", options: ["<a url=\"...\">", "<a href=\"...\">", "<link>\"...\"</link>", "<href>...<href>"], answer: "<a href=\"...\">" },
          ] },
        ],
      },
      {
        id: "ts2",
        title: "CSS Styling",
        lessons: [
          { id: "tl4", title: "CSS Selectors Guide", type: "book", status: "published" },
          { id: "tl5", title: "Flexbox & Grid", type: "video", duration: "25:00", status: "draft" },
        ],
      },
    ],
  },
  {
    id: "tc2",
    title: "Zambian History & Culture",
    description: "Explore the rich history and cultural heritage of Zambia.",
    category: "Humanities",
    difficulty: "intermediate",
    price: 150,
    thumbnail: "",
    status: "draft",
    students: 0,
    rating: 0,
    createdAt: "2024-06-01",
    sections: [
      {
        id: "ts3",
        title: "Pre-Colonial Zambia",
        lessons: [
          { id: "tl6", title: "Early Kingdoms", type: "video", duration: "22:00", status: "draft" },
        ],
      },
    ],
  },
];

const categories = ["Technology", "Mathematics", "Sciences", "Humanities", "Languages", "Business", "Arts", "Other"];

// ─── Helpers ─────────────────────────────────────────────────────────
function generateId() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Component ───────────────────────────────────────────────────────
export function TutorBody() {
  const { setAiOverlayOpen, activePage } = useAppStore();
  // Default to "courses" tab when navigated from Explore (courses page) so tutors see course management directly
  const [activeTab, setActiveTab] = useState<TutorTab>(
    activePage === "courses" || activePage === "course-detail" ? "courses" : "dashboard"
  );
  const [courses, setCourses] = useState<TutorCourse[]>(initialCourses);
  const [editingCourse, setEditingCourse] = useState<TutorCourse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGeneratedQuiz, setAiGeneratedQuiz] = useState<{ sectionId: string; questions: { question: string; options: string[]; answer: string }[] } | null>(null);
  const [selectedSectionForQuiz, setSelectedSectionForQuiz] = useState<string>("");

  // ─── Course Management ───────────────────────────────────────────
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesFilter = courseFilter === "all" || c.status === courseFilter;
    return matchesSearch && matchesFilter;
  });

  const createNewCourse = () => {
    const newCourse: TutorCourse = {
      id: generateId(),
      title: "",
      description: "",
      category: "Technology",
      difficulty: "beginner",
      price: 0,
      thumbnail: "",
      status: "draft",
      sections: [{ id: generateId(), title: "Section 1", lessons: [] }],
      students: 0,
      rating: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setEditingCourse(newCourse);
    setIsCreating(true);
  };

  const saveCourse = (course: TutorCourse) => {
    if (isCreating) {
      setCourses((prev) => [...prev, course]);
    } else {
      setCourses((prev) => prev.map((c) => (c.id === course.id ? course : c)));
    }
    setEditingCourse(null);
    setIsCreating(false);
  };

  const deleteCourse = (id: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const duplicateCourse = (course: TutorCourse) => {
    const dup: TutorCourse = {
      ...course,
      id: generateId(),
      title: `${course.title} (Copy)`,
      status: "draft",
      students: 0,
      rating: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCourses((prev) => [...prev, dup]);
  };

  // ─── Section & Lesson Management ─────────────────────────────────
  const addSection = (course: TutorCourse) => {
    const updated = {
      ...course,
      sections: [...course.sections, { id: generateId(), title: `Section ${course.sections.length + 1}`, lessons: [] }],
    };
    setEditingCourse(updated);
  };

  const removeSection = (course: TutorCourse, sectionId: string) => {
    const updated = {
      ...course,
      sections: course.sections.filter((s) => s.id !== sectionId),
    };
    setEditingCourse(updated);
  };

  const updateSectionTitle = (course: TutorCourse, sectionId: string, title: string) => {
    const updated = {
      ...course,
      sections: course.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
    };
    setEditingCourse(updated);
  };

  const addLesson = (course: TutorCourse, sectionId: string, type: "video" | "book" | "quiz") => {
    const lesson: Lesson = {
      id: generateId(),
      title: "",
      type,
      status: "draft",
    };
    const updated = {
      ...course,
      sections: course.sections.map((s) =>
        s.id === sectionId ? { ...s, lessons: [...s.lessons, lesson] } : s
      ),
    };
    setEditingCourse(updated);
  };

  // ─── File Upload ────────────────────────────────────────────────
  const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null);

  const handleFileUpload = (lessonId: string, sectionId: string, file: File) => {
    const maxSize = 20 * 1024 * 1024; // 20MB limit for data URLs in state
    if (file.size > maxSize) {
      alert(`File "${file.name}" is too large. Maximum supported size is 20MB. For larger files, use a hosting service and add the URL manually.`);
      return;
    }
    setUploadingLessonId(lessonId);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Use functional form to avoid stale closure on editingCourse
      setEditingCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  lessons: s.lessons.map((l) =>
                    l.id === lessonId
                      ? { ...l, fileName: file.name, fileSize: file.size, fileType: file.type, fileDataUrl: dataUrl }
                      : l
                  ),
                }
              : s
          ),
        };
      });
      setUploadingLessonId(null);
    };
    reader.onerror = () => {
      alert("Failed to read file. Please try again.");
      setUploadingLessonId(null);
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const removeLesson = (course: TutorCourse, sectionId: string, lessonId: string) => {
    const updated = {
      ...course,
      sections: course.sections.map((s) =>
        s.id === sectionId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s
      ),
    };
    setEditingCourse(updated);
  };

  const updateLesson = (course: TutorCourse, sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    const updated = {
      ...course,
      sections: course.sections.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
          : s
      ),
    };
    setEditingCourse(updated);
  };

  // ─── AI Quiz Generation ──────────────────────────────────────────
  const handleAIGenerateQuiz = () => {
    if (!aiPrompt.trim() || !selectedSectionForQuiz) return;

    // Simulate AI-generated quiz questions
    const mockQuestions = [
      { question: `What is the main concept of "${aiPrompt.slice(0, 40)}..."?`, options: ["Option A", "Option B", "Option C", "Option D"], answer: "Option A" },
      { question: "Which of the following best describes this topic?", options: ["Definition 1", "Definition 2", "Definition 3", "Definition 4"], answer: "Definition 2" },
      { question: "What is a practical application of this concept?", options: ["Application X", "Application Y", "Application Z", "All of the above"], answer: "All of the above" },
      { question: "Which statement is TRUE about this topic?", options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"], answer: "Statement 3" },
      { question: "What should you remember most from this section?", options: ["Key point A", "Key point B", "Key point C", "Key point D"], answer: "Key point A" },
    ];

    setAiGeneratedQuiz({
      sectionId: selectedSectionForQuiz,
      questions: mockQuestions,
    });
  };

  const addGeneratedQuizToSection = () => {
    if (!aiGeneratedQuiz || !editingCourse) return;
    const quizLesson: Lesson = {
      id: generateId(),
      title: `AI Quiz: ${aiPrompt.slice(0, 50)}`,
      type: "quiz",
      status: "draft",
      questions: aiGeneratedQuiz.questions,
    };
    const updatedCourse: TutorCourse = {
      ...editingCourse,
      sections: editingCourse.sections.map((s) =>
        s.id === aiGeneratedQuiz.sectionId
          ? { ...s, lessons: [...s.lessons, quizLesson] }
          : s
      ),
    };
    setEditingCourse(updatedCourse);
    // Also immediately persist to courses list so the quiz survives navigation
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === updatedCourse.id);
      return exists
        ? prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
        : prev;
    });
    setAiGeneratedQuiz(null);
    setAiPrompt("");
  };

  const openAIAssistant = () => {
    setAiOverlayOpen(true);
  };

  // ─── Tab Config ──────────────────────────────────────────────────
  const tabs: { id: TutorTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "courses", label: "Courses", icon: "library_books" },
    { id: "ai-quiz", label: "AI Quiz", icon: "auto_awesome" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: "bg-green-100 text-green-700 border-green-200",
      draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
      archived: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return styles[status] || "bg-surface-variant text-on-surface-variant";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "text-green-600 bg-green-50",
      intermediate: "text-amber-600 bg-amber-50",
      advanced: "text-red-600 bg-red-50",
    };
    return colors[difficulty] || "text-on-surface-variant bg-surface-variant";
  };

  const getLessonIcon = (type: string) => {
    const icons: Record<string, string> = {
      video: "play_circle",
      book: "menu_book",
      quiz: "quiz",
    };
    return icons[type] || "description";
  };

  const getLessonColor = (type: string) => {
    const colors: Record<string, string> = {
      video: "text-blue-600 bg-blue-50",
      book: "text-purple-600 bg-purple-50",
      quiz: "text-amber-600 bg-amber-50",
    };
    return colors[type] || "text-surface-variant bg-surface-variant";
  };

  // ─── Stats ───────────────────────────────────────────────────────
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalVideos = courses.reduce((sum, c) =>
    sum + c.sections.reduce((sSum, s) => sSum + s.lessons.filter((l) => l.type === "video").length, 0), 0);
  const totalQuizzes = courses.reduce((sum, c) =>
    sum + c.sections.reduce((sSum, s) => sSum + s.lessons.filter((l) => l.type === "quiz").length, 0), 0);
  const publishedCourses = courses.filter((c) => c.status === "published").length;

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar activePage="tutor-dashboard" />

        <main data-page-main className="flex-1 flex flex-col min-w-0 bg-surface h-full overflow-hidden">
          {/* ── Merged header: toolbar + tab navigation ── */}
          <div className="w-full bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant">
            {/* Row 1: Title + actions */}
            <div className="h-16 flex items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-4">
                <button className="md:hidden material-symbols-outlined p-2 hover:bg-surface-variant/50 rounded-full transition-colors active:scale-95">menu</button>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary text-sm" style={{fontVariationSettings: '"FILL" 1'}}>auto_stories</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight">Tutor Panel</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={openAIAssistant}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>AI Assistant</span>
                </button>
                <button className="relative p-2 hover:bg-surface-variant/50 rounded-full transition-colors" title="Notifications">
                  <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary text-xs font-bold shrink-0">
                  T
                </div>
              </div>
            </div>
            {/* Row 2: Tab navigation */}
            <div className="flex items-center gap-1 px-4 md:px-6 pb-2">
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
          </div>
          </div>

          {/* ── Scrollable Content ── */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6">

            {/* ══════════════════════════════════════════════════════════
                DASHBOARD TAB
            ══════════════════════════════════════════════════════════ */}
            {activeTab === "dashboard" && (
              <>
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary-container/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1'}}>library_books</span>
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-label-caps font-label-caps opacity-70 mb-1">TOTAL COURSES</p>
                    <p className="text-display-md font-display-md text-on-surface">{courses.length}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-green-600 font-semibold">{publishedCourses} published</span>
                      <span className="text-xs text-on-surface-variant/50">• {courses.length - publishedCourses} drafts</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-secondary-container/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1'}}>group</span>
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-label-caps font-label-caps opacity-70 mb-1">ENROLLED STUDENTS</p>
                    <p className="text-display-md font-display-md text-on-surface">{totalStudents.toLocaleString()}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-green-600 font-semibold">+12 this week</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-blue-600" style={{fontVariationSettings: '"FILL" 1'}}>play_circle</span>
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-label-caps font-label-caps opacity-70 mb-1">VIDEO LESSONS</p>
                    <p className="text-display-md font-display-md text-on-surface">{totalVideos}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant/50">Across all courses</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-amber-600" style={{fontVariationSettings: '"FILL" 1'}}>quiz</span>
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-label-caps font-label-caps opacity-70 mb-1">QUIZZES</p>
                    <p className="text-display-md font-display-md text-on-surface">{totalQuizzes}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="text-xs font-semibold text-primary hover:underline" onClick={() => setActiveTab("ai-quiz")}>Generate with AI</button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-5 text-white">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold">Tutor Quick Actions</h3>
                      <p className="text-body-sm text-white/80 mt-1">Create and manage your course content</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={createNewCourse}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Create Course
                      </button>
                      <button
                        onClick={() => setActiveTab("ai-quiz")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-all active:scale-95 border border-white/20"
                      >
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Generate Quiz
                      </button>
                      <button
                        onClick={openAIAssistant}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white rounded-xl text-sm font-bold hover:bg-white/25 transition-all active:scale-95 border border-white/20"
                      >
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        AI Tutor Help
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Courses */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-title-md text-title-md text-on-surface">Your Courses</h3>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {courses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container/50 transition-colors border border-outline-variant/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
                          </div>
                          <div>
                            <p className="text-body-sm font-semibold text-on-surface">{course.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(course.status)}`}>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                              </span>
                              <span className="text-xs text-on-surface-variant">{course.sections.length} sections</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => { setEditingCourse(course); setIsCreating(false); }}
                          className="p-2 hover:bg-surface-variant rounded-lg transition-colors"
                          title="Edit course"
                        >
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">edit</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════════════════════
                COURSES TAB (with Course Builder)
            ══════════════════════════════════════════════════════════ */}
            {activeTab === "courses" && (
              editingCourse ? (
                /* ── Course Builder / Editor ── */
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setEditingCourse(null); setIsCreating(false); }}
                        className="p-2 hover:bg-surface-variant rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                      </button>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">
                          {isCreating ? "Create New Course" : "Edit Course"}
                        </h3>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">
                          {isCreating ? "Set up your course details, sections, and content" : `Editing: ${editingCourse.title}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (!editingCourse) return;
                          const course: TutorCourse = { ...editingCourse, status: "published" };
                          saveCourse(course);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {isCreating ? "Create Course" : "Save Changes"}
                      </button>
                      <button
                        onClick={() => saveCourse(editingCourse)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">save</span>
                        Save as Draft
                      </button>
                    </div>
                  </div>

                  {/* Course Details Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Main Details */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4">
                        <h4 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">info</span>
                          Course Details
                        </h4>
                        <div>
                          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Course Title *</label>
                          <input
                            type="text"
                            value={editingCourse.title}
                            onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                            placeholder="e.g., Introduction to Web Development"
                            className="w-full h-11 px-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Description *</label>
                          <textarea
                            value={editingCourse.description}
                            onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                            placeholder="Describe what students will learn in this course..."
                            rows={4}
                            className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Category</label>
                            <select
                              value={editingCourse.category}
                              onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                              className="w-full h-11 px-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Difficulty</label>
                            <select
                              value={editingCourse.difficulty}
                              onChange={(e) => setEditingCourse({ ...editingCourse, difficulty: e.target.value as any })}
                              className="w-full h-11 px-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Price (ZMK)</label>
                            <input
                              type="number"
                              value={editingCourse.price}
                              onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                              placeholder="0 = Free"
                              className="w-full h-11 px-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sections & Lessons */}
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">layers</span>
                            Course Content
                          </h4>
                          <button
                            onClick={() => addSection(editingCourse)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Section
                          </button>
                        </div>

                        {editingCourse.sections.length === 0 && (
                          <div className="text-center py-8 text-on-surface-variant text-body-sm">
                            No sections yet. Click "Add Section" to start building your course.
                          </div>
                        )}

                        {editingCourse.sections.map((section, si) => (
                          <div key={section.id} className="border border-outline-variant rounded-xl overflow-hidden">
                            {/* Section Header */}
                            <div className="flex items-center justify-between p-4 bg-surface-container-high/50 border-b border-outline-variant">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="material-symbols-outlined text-on-surface-variant text-sm">drag_indicator</span>
                                <input
                                  type="text"
                                  value={section.title}
                                  onChange={(e) => updateSectionTitle(editingCourse, section.id, e.target.value)}
                                  className="font-title-sm font-semibold text-on-surface bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-2 py-1 flex-1"
                                  placeholder="Section title..."
                                />
                                <span className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                                  {section.lessons.length} {section.lessons.length === 1 ? "item" : "items"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => addLesson(editingCourse, section.id, "video")}
                                    className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group"
                                    title="Add video lesson"
                                  >
                                    <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-blue-600">play_circle</span>
                                  </button>
                                  <button
                                    onClick={() => addLesson(editingCourse, section.id, "book")}
                                    className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors group"
                                    title="Add book/document"
                                  >
                                    <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-purple-600">menu_book</span>
                                  </button>
                                  <button
                                    onClick={() => addLesson(editingCourse, section.id, "quiz")}
                                    className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors group"
                                    title="Add quiz"
                                  >
                                    <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-amber-600">quiz</span>
                                  </button>
                                </div>
                                {editingCourse.sections.length > 1 && (
                                  <button
                                    onClick={() => removeSection(editingCourse, section.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove section"
                                  >
                                    <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-red-500">delete</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Lessons List */}
                            <div className="divide-y divide-outline-variant">
                              {section.lessons.map((lesson) => (
                                <div key={lesson.id}>
                                  <div className="flex items-center gap-3 p-3 hover:bg-surface-container/50 transition-colors">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getLessonColor(lesson.type)}`}>
                                      <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: '"FILL" 1'}}>
                                        {getLessonIcon(lesson.type)}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <input
                                        type="text"
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(editingCourse, section.id, lesson.id, { title: e.target.value })}
                                        className="text-body-sm text-on-surface bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-2 py-1 w-full"
                                        placeholder={`${lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} title...`}
                                      />
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                                          {lesson.type}
                                        </span>
                                        {lesson.type === "video" && (
                                          <>
                                            {/* Duration input */}
                                            <input
                                              type="text"
                                              value={lesson.duration || ""}
                                              onChange={(e) => updateLesson(editingCourse, section.id, lesson.id, { duration: e.target.value })}
                                              className="text-[11px] text-on-surface-variant bg-surface-container-high max-w-[80px] px-1.5 py-0.5 rounded border-none focus:ring-1 focus:ring-primary/30"
                                              placeholder="00:00"
                                            />
                                            {/* File upload / file info */}
                                            {uploadingLessonId === lesson.id ? (
                                              <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                                                Uploading...
                                              </span>
                                            ) : lesson.fileName ? (
                                              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                {lesson.fileName}
                                              </span>
                                            ) : (
                                              <label className="text-[11px] text-primary font-medium cursor-pointer hover:underline flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">upload_file</span>
                                                Upload Video
                                                <input
                                                  type="file"
                                                  accept="video/*"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(lesson.id, section.id, file);
                                                    e.target.value = "";
                                                  }}
                                                />
                                              </label>
                                            )}
                                          </>
                                        )}
                                        {lesson.type === "book" && (
                                          <>
                                            {uploadingLessonId === lesson.id ? (
                                              <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                                                Uploading...
                                              </span>
                                            ) : lesson.fileName ? (
                                              <span className="text-[11px] text-purple-600 font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">description</span>
                                                {lesson.fileName}
                                                {lesson.fileSize && (
                                                  <span className="text-on-surface-variant font-normal">({formatFileSize(lesson.fileSize)})</span>
                                                )}
                                              </span>
                                            ) : (
                                              <label className="text-[11px] text-primary font-medium cursor-pointer hover:underline flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">upload_file</span>
                                                Upload Document
                                                <input
                                                  type="file"
                                                  accept=".pdf,.doc,.docx,.txt,.epub,.md"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(lesson.id, section.id, file);
                                                    e.target.value = "";
                                                  }}
                                                />
                                              </label>
                                            )}
                                          </>
                                        )}
                                        {lesson.type === "quiz" && (
                                          <>
                                            <span className="text-[11px] text-on-surface-variant">Auto-graded</span>
                                            <span className="text-[11px] font-medium text-primary">
                                              {(lesson.questions?.length || 0)} {(lesson.questions?.length || 0) === 1 ? "question" : "questions"}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => removeLesson(editingCourse, section.id, lesson.id)}
                                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                      title="Remove item"
                                    >
                                      <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-red-500">close</span>
                                    </button>
                                  </div>
                                  {/* Inline video preview */}
                                  {lesson.type === "video" && lesson.fileDataUrl && (
                                    <div className="px-3 pb-3">
                                      <div className="ml-11 rounded-lg overflow-hidden border border-outline-variant bg-black">
                                        <video
                                          src={lesson.fileDataUrl}
                                          controls
                                          className="w-full max-h-48 object-contain"
                                          preload="metadata"
                                        >
                                          Your browser does not support the video tag.
                                        </video>
                                      </div>
                                      <div className="ml-11 mt-1.5 flex items-center gap-2 text-[11px] text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[14px]">videocam</span>
                                        <span>{lesson.fileName}</span>
                                        {lesson.fileSize && <span>• {formatFileSize(lesson.fileSize)}</span>}
                                        <label className="ml-auto text-primary font-medium cursor-pointer hover:underline">
                                          Change file
                                          <input
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleFileUpload(lesson.id, section.id, file);
                                              e.target.value = "";
                                            }}
                                          />
                                        </label>
                                        <button
                                          onClick={() => updateLesson(editingCourse, section.id, lesson.id, { fileName: undefined, fileSize: undefined, fileType: undefined, fileDataUrl: undefined })}
                                          className="text-red-500 hover:underline cursor-pointer"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {/* Inline book preview */}
                                  {lesson.type === "book" && lesson.fileDataUrl && (
                                    <div className="px-3 pb-3">
                                      <div className="ml-11 rounded-lg overflow-hidden border border-outline-variant bg-surface-container-high">
                                        {lesson.fileType === "application/pdf" ? (
                                          <object
                                            data={lesson.fileDataUrl}
                                            type="application/pdf"
                                            className="w-full h-48"
                                          >
                                            <div className="flex items-center gap-4 p-4">
                                              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-3xl text-purple-600">picture_as_pdf</span>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="text-body-sm font-semibold text-on-surface truncate">{lesson.fileName}</p>
                                                <p className="text-xs text-on-surface-variant mt-0.5">PDF preview not available in your browser.</p>
                                              </div>
                                              <a
                                                href={lesson.fileDataUrl}
                                                download={lesson.fileName}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
                                              >
                                                <span className="material-symbols-outlined text-[14px]">download</span>
                                                Download
                                              </a>
                                            </div>
                                          </object>
                                        ) : (
                                          <div className="flex items-center gap-4 p-4">
                                            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                              <span className="material-symbols-outlined text-3xl text-purple-600">description</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-body-sm font-semibold text-on-surface truncate">{lesson.fileName}</p>
                                              <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                                                <span>{lesson.fileType}</span>
                                                {lesson.fileSize && <span>• {formatFileSize(lesson.fileSize)}</span>}
                                              </div>
                                            </div>
                                            <a
                                              href={lesson.fileDataUrl}
                                              download={lesson.fileName}
                                              className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
                                            >
                                              <span className="material-symbols-outlined text-[14px]">download</span>
                                              Download
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                      <div className="ml-11 mt-1.5 flex items-center gap-2 text-[11px] text-on-surface-variant">
                                        <label className="text-primary font-medium cursor-pointer hover:underline flex items-center gap-1">
                                          <span className="material-symbols-outlined text-[14px]">upload_file</span>
                                          Change file
                                          <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.txt,.epub,.md"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleFileUpload(lesson.id, section.id, file);
                                              e.target.value = "";
                                            }}
                                          />
                                        </label>
                                        <button
                                          onClick={() => updateLesson(editingCourse, section.id, lesson.id, { fileName: undefined, fileSize: undefined, fileType: undefined, fileDataUrl: undefined })}
                                          className="text-red-500 hover:underline cursor-pointer"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {/* Inline quiz questions display for quiz lessons */}
                                  {lesson.type === "quiz" && lesson.questions && lesson.questions.length > 0 && (
                                    <div className="px-3 pb-3 space-y-2">
                                      <div className="ml-11 pl-2 border-l-2 border-primary/20 space-y-2">
                                        {lesson.questions.map((q, qi) => (
                                          <div key={qi} className="bg-surface-container/50 rounded-lg p-3 border border-outline-variant/50">
                                            <div className="flex items-start gap-2">
                                              <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                                                {qi + 1}
                                              </span>
                                              <div className="flex-1 min-w-0">
                                                <input
                                                  type="text"
                                                  value={q.question}
                                                  onChange={(e) => {
                                                    const updatedQuestions = [...(lesson.questions || [])];
                                                    updatedQuestions[qi] = { ...updatedQuestions[qi], question: e.target.value };
                                                    updateLesson(editingCourse, section.id, lesson.id, { questions: updatedQuestions });
                                                  }}
                                                  className="text-body-sm font-semibold text-on-surface bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-1.5 py-0.5 w-full"
                                                />
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                                                  {q.options.map((opt, oi) => (
                                                    <div key={oi} className="flex items-center gap-2">
                                                      <input
                                                        type="radio"
                                                        name={`q-${lesson.id}-${qi}`}
                                                        checked={opt === q.answer}
                                                        onChange={() => {
                                                          const updatedQuestions = [...(lesson.questions || [])];
                                                          updatedQuestions[qi] = { ...updatedQuestions[qi], answer: opt };
                                                          updateLesson(editingCourse, section.id, lesson.id, { questions: updatedQuestions });
                                                        }}
                                                        className="text-primary focus:ring-primary h-3.5 w-3.5"
                                                      />
                                                      <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => {
                                                          const updatedQuestions = [...(lesson.questions || [])];
                                                          const newOptions = [...updatedQuestions[qi].options];
                                                          newOptions[oi] = e.target.value;
                                                          updatedQuestions[qi] = { ...updatedQuestions[qi], options: newOptions };
                                                          updateLesson(editingCourse, section.id, lesson.id, { questions: updatedQuestions });
                                                        }}
                                                        className={`text-xs flex-1 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-1.5 py-0.5 ${
                                                          opt === q.answer ? "text-green-700 font-semibold" : "text-on-surface-variant"
                                                        }`}
                                                      />
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {section.lessons.length === 0 && (
                                <div className="p-4 text-center text-body-sm text-on-surface-variant/60">
                                  No content yet. Click the icons above to add a video, book, or quiz.
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Settings Panel */}
                    <div className="space-y-4">
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4">
                        <h4 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">settings</span>
                          Course Settings
                        </h4>
                        <div>
                          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Status</label>
                          <div className="flex gap-2">
                            {(["draft", "published", "archived"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => setEditingCourse({ ...editingCourse, status: s })}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                                  editingCourse.status === s
                                    ? "bg-primary text-on-primary shadow-sm"
                                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Thumbnail URL</label>
                          <input
                            type="text"
                            value={editingCourse.thumbnail}
                            onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                            placeholder="https://..."
                            className="w-full h-11 px-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div className="pt-2 border-t border-outline-variant">
                          <p className="text-xs text-on-surface-variant mb-2">Quick Stats</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-surface-container-high rounded-lg p-2">
                              <span className="text-on-surface-variant">Sections</span>
                              <p className="font-bold text-on-surface">{editingCourse.sections.length}</p>
                            </div>
                            <div className="bg-surface-container-high rounded-lg p-2">
                              <span className="text-on-surface-variant">Lessons</span>
                              <p className="font-bold text-on-surface">
                                {editingCourse.sections.reduce((sum, s) => sum + s.lessons.length, 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Generate Content */}
                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                          <h4 className="font-title-sm text-title-sm text-on-surface">AI Content Assistant</h4>
                        </div>
                        <p className="text-body-sm text-on-surface-variant">
                          Use AI to help generate quiz questions, lesson summaries, or course descriptions.
                        </p>
                        <button
                          onClick={openAIAssistant}
                          className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95"
                        >
                          Open AI Assistant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Course List ── */
                <>
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">My Courses</h3>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">Create, manage, and publish your course content</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={createNewCourse}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Create Course
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Search & Filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      {(["all", "draft", "published", "archived"] as const).map((f) => (
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

                  {/* Course Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCourses.length === 0 && (
                      <div className="col-span-full text-center py-16">
                        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">library_books</span>
                        <p className="text-title-md text-on-surface-variant">No courses found</p>
                        <p className="text-body-sm text-on-surface-variant/60 mt-1">
                          {courseSearch ? "Try a different search term" : "Create your first course to get started"}
                        </p>
                        {!courseSearch && (
                          <button
                            onClick={createNewCourse}
                            className="mt-4 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95"
                          >
                            Create Your First Course
                          </button>
                        )}
                      </div>
                    )}
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-all group"
                      >
                        {/* Thumbnail */}
                        <div className="h-36 bg-gradient-to-br from-primary-container/30 to-secondary-container/30 flex items-center justify-center relative overflow-hidden">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-4xl text-primary/30">auto_stories</span>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm bg-white/80 backdrop-blur-sm ${getStatusBadge(course.status)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                course.status === "published" ? "bg-green-500" :
                                course.status === "draft" ? "bg-yellow-500" : "bg-gray-500"
                              }`}></span>
                              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                          </div>
                          <div className="absolute top-2 left-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getDifficultyColor(course.difficulty)}`}>
                              {course.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                          <div>
                            <h4 className="font-title-sm text-title-sm text-on-surface line-clamp-1">{course.title || "Untitled Course"}</h4>
                            <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-1">{course.description || "No description yet"}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">layers</span>
                              {course.sections.length} sections
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">group</span>
                              {course.students} students
                            </span>
                          </div>

                          {/* Price & Rating */}
                          <div className="flex items-center justify-between">
                            <span className="font-title-sm font-bold text-primary">
                              {course.price === 0 ? "Free" : `K ${course.price}`}
                            </span>
                            {course.rating > 0 && (
                              <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                                <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                                {course.rating}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t border-outline-variant">
                            <button
                              onClick={() => { setEditingCourse(course); setIsCreating(false); }}
                              className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-all active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[14px] align-middle mr-1">edit</span>
                              Edit
                            </button>
                            <button
                              onClick={() => duplicateCourse(course)}
                              className="py-2 px-3 border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-all"
                              title="Duplicate course"
                            >
                              <span className="material-symbols-outlined text-[14px]">content_copy</span>
                            </button>
                            <button
                              onClick={() => deleteCourse(course.id)}
                              className="py-2 px-3 border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-all"
                              title="Delete course"
                            >
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}

            {/* ══════════════════════════════════════════════════════════
                AI QUIZ TAB
            ══════════════════════════════════════════════════════════ */}
            {activeTab === "ai-quiz" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Input */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">AI Quiz Generator</h3>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                      Generate quiz questions automatically based on your course content using AI.
                    </p>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4">
                    <h4 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                      Generate Quiz
                    </h4>

                    {/* Select Course Section */}
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Target Course Section</label>
                      <select
                        value={selectedSectionForQuiz}
                        onChange={(e) => setSelectedSectionForQuiz(e.target.value)}
                        className="w-full h-11 px-4 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                      >
                        <option value="">Select a section...</option>
                        {editingCourse
                          ? editingCourse.sections.map((s) => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))
                          : courses.flatMap((c) =>
                              c.sections.map((s) => (
                                <option key={s.id} value={s.id}>{c.title} → {s.title}</option>
                              ))
                            )}
                      </select>
                    </div>

                    {/* AI Prompt */}
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">Describe the Quiz Topic</label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., 'Create a quiz about HTML tags and elements for beginners' or 'Generate questions on CSS Flexbox layout properties'..."
                        rows={4}
                        className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none text-body-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleAIGenerateQuiz}
                        disabled={!aiPrompt.trim() || !selectedSectionForQuiz}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Generate Quiz
                      </button>
                      <button
                        onClick={openAIAssistant}
                        className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        Ask AI Tutor
                      </button>
                    </div>
                  </div>

                  {/* Generated Quiz Preview */}
                  {aiGeneratedQuiz && (
                    <div className="bg-surface-container-lowest border border-primary/20 rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                          Generated Quiz
                        </h4>
                        <button
                          onClick={addGeneratedQuizToSection}
                          disabled={!editingCourse}
                          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                          Add to Course
                        </button>
                      </div>
                      <p className="text-body-sm text-on-surface-variant">
                        {aiGeneratedQuiz.questions.length} questions generated. Review and edit below before adding to your course.
                      </p>
                      <div className="space-y-3">
                        {aiGeneratedQuiz.questions.map((q, qi) => (
                          <div key={qi} className="border border-outline-variant rounded-xl p-4 hover:border-primary/30 transition-colors">
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary-container/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                {qi + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-body-sm font-semibold text-on-surface mb-2">{q.question}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {q.options.map((opt, oi) => (
                                    <div
                                      key={oi}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                        opt === q.answer
                                          ? "bg-green-50 text-green-700 border border-green-200"
                                          : "bg-surface-container-high text-on-surface-variant"
                                      }`}
                                    >
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                        opt === q.answer ? "bg-green-500 text-white" : "bg-outline-variant"
                                      }`}>
                                        {String.fromCharCode(65 + oi)}
                                      </span>
                                      {opt}
                                      {opt === q.answer && (
                                        <span className="material-symbols-outlined text-[14px] text-green-600 ml-auto">check</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={handleAIGenerateQuiz}
                          className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-all"
                        >
                          Regenerate
                        </button>
                        <button
                          onClick={addGeneratedQuizToSection}
                          disabled={!editingCourse}
                          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
                        >
                          {editingCourse ? "Add Quiz to Course" : "Open a course to add this quiz"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Tips */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
                      <h4 className="font-title-sm text-title-sm text-on-surface">Tips for Great Quizzes</h4>
                    </div>
                    <ul className="space-y-2 text-body-sm text-on-surface-variant">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-xs text-primary mt-0.5">check_circle</span>
                        Be specific about the topic and difficulty level
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-xs text-primary mt-0.5">check_circle</span>
                        Mention the target grade or education level
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-xs text-primary mt-0.5">check_circle</span>
                        Specify the number of questions you need
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-xs text-primary mt-0.5">check_circle</span>
                        Request question types: multiple choice, true/false, fill-in
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-xs text-primary mt-0.5">check_circle</span>
                        Include Zambian context for better relevance
                      </li>
                    </ul>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">history</span>
                      <h4 className="font-title-sm text-title-sm text-on-surface">Recent Generations</h4>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      Your AI-generated quizzes will appear here once you generate them.
                    </p>
                    {!aiGeneratedQuiz && (
                      <div className="text-center py-6 text-on-surface-variant/50">
                        <span className="material-symbols-outlined text-3xl block mb-2">auto_awesome</span>
                        <span className="text-xs">No quizzes generated yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
