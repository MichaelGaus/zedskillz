"use client";

import { useAppStore } from "@/lib/store";
import { courses } from "@/lib/mock-data";

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function CoursesBody() {
  const { setSelectedCourseId, setActivePage } = useAppStore();

  // Show non-featured published courses on the explore page (c5–c9)
  const exploreCourses = courses.filter((c) => c.status === "published" && !c.isFeatured);

  const handleViewDetails = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActivePage("course-detail");
  };

  return (
    <>
      <div className="flex min-h-screen">
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1 p-container-margin md:p-xl space-y-xl">
            {/* Hero banner */}
            <section className="relative rounded-3xl overflow-hidden shadow-xl ai-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10"></div>
              <div className="absolute inset-0 z-0">
                <img
                  className="w-full h-full object-cover object-center"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjv5mcdaoKA5V70UgJHLszYZ8oxaSN-_03AWUuM-8FJTFtdIPjOjRp9RI2lj7xAjIXr3n7KN9-KGn7fjiIoASE6_HfLhy4v5txydvnGiolwQGsvZ6RaiEcQJiZppQBuzggMuhsk_qBB-enzLE_1Pz6M1jCaExLh35Mva0VB7SwWoX4cEanXp_5affugsD4jOrhfI9msuOL_FD-al6ReEqhoT383-24jzqTbiSADUYiPVGqexUkjVS0lA"
                  alt=""
                />
              </div>
              <div className="relative z-20 p-xl md:p-32 flex flex-col items-start justify-center max-w-3xl space-y-md">
                <span className="px-4 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps inline-flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    auto_awesome
                  </span>
                  AI RECOMMENDED FOR YOU
                </span>
                <h2 className="text-display-lg text-white font-display-lg">
                  Advanced Neural Architectures & LLM Engineering
                </h2>
                <p className="text-white/80 text-body-md max-w-xl">
                  Master the core principles behind modern AI. Build, train, and deploy large
                  language models with Zambia&apos;s leading AI experts.
                </p>
                <div className="flex flex-wrap gap-md pt-4">
                  <button
                    onClick={() => {
                      setSelectedCourseId("c1");
                      setActivePage("course-detail");
                    }}
                    className="px-8 h-12 bg-white text-primary font-bold rounded-xl hover:shadow-lg transition-all active:scale-95"
                  >
                    Enroll Now
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourseId("c1");
                      setActivePage("course-detail");
                    }}
                    className="px-8 h-12 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all"
                  >
                    Course Syllabus
                  </button>
                </div>
              </div>
            </section>

            {/* Category filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-outline-variant pb-md">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                <button className="px-6 py-2 bg-primary text-white rounded-full text-body-sm font-semibold whitespace-nowrap">
                  All Courses
                </button>
                <button className="px-6 py-2 bg-secondary-container text-on-secondary-container hover:bg-outline-variant transition-colors rounded-full text-body-sm font-semibold whitespace-nowrap">
                  AI & ML
                </button>
                <button className="px-6 py-2 bg-secondary-container text-on-secondary-container hover:bg-outline-variant transition-colors rounded-full text-body-sm font-semibold whitespace-nowrap">
                  Programming
                </button>
                <button className="px-6 py-2 bg-secondary-container text-on-secondary-container hover:bg-outline-variant transition-colors rounded-full text-body-sm font-semibold whitespace-nowrap">
                  Digital Marketing
                </button>
                <button className="px-6 py-2 bg-secondary-container text-on-secondary-container hover:bg-outline-variant transition-colors rounded-full text-body-sm font-semibold whitespace-nowrap">
                  Data Science
                </button>
                <button className="px-6 py-2 bg-secondary-container text-on-secondary-container hover:bg-outline-variant transition-colors rounded-full text-body-sm font-semibold whitespace-nowrap">
                  Cloud Computing
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined">tune</span>
                <span className="font-body-sm">Sort & Filter</span>
              </button>
            </div>

            {/* Course grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg pb-xl">
              {exploreCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white border border-outline-variant rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={course.thumbnail}
                      alt={course.title}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">
                      {course.category.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-md flex-1 flex flex-col">
                    <h3 className="font-title-sm text-title-sm text-on-surface mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant mb-4 line-clamp-2">
                      {course.subtitle}
                    </p>
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            signal_cellular_alt
                          </span>
                          {difficultyLabel[course.difficulty] || course.difficulty}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          {course.duration}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <span
                            className="material-symbols-outlined text-amber-500 text-[18px]"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                          >
                            star
                          </span>
                          {course.rating}
                        </div>
                        <div className="text-title-sm font-bold text-on-surface">
                          {course.isFree ? "Free" : `K ${course.price.toLocaleString()}`}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(course.id)}
                        className="w-full py-2 bg-secondary-container text-primary font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-all cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Footer */}
          <footer className="w-full py-xl bg-surface-container-highest border-t border-outline-variant px-container-margin md:px-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-md text-center">
              <div className="flex flex-col items-center md:items-start gap-1">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUXCw-tnC1Xz_cE3KlgB4tzqZcYIt9sY0T1l2GDKC-D53C9J3RMJREa_LVNp5Im5apNaQQoOh1pg8bunusWtDtEyyO8dTfJgpZERq-w5v6RUWenK5qgOdykhI0-pmaVMlo8dgDu9AZT2964nif7_rRx-AP-0IluyPgV-6-0uoe1hfUYT6e3ZPi7uv-dtG1SKTKkde4xRqR9MLVBG_1AQAlwmtysalCC-ZmTC7owq5qGn2ozG8p7qbUUVPiGbSfM747Aw0"
                  alt="Zedskillz Hub"
                  className="w-auto object-contain h-10"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  © 2024 Zedskillz Hub Zambia. Empowering through AI.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-md">
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm"
                  href="#"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* AI Tutor FAB */}
      <button
        className="fixed bottom-xl right-xl z-50 h-12 px-4 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center gap-sm active:scale-90 transition-transform ai-glow"
        aria-label="AI Tutor"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          psychology
        </span>
        <span className="font-body-sm font-semibold">Ask a Question</span>
      </button>
    </>
  );
}
