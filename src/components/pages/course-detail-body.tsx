"use client";

import { useAppStore } from "@/lib/store";
import { courses } from "@/lib/mock-data";

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const difficultyColor: Record<string, string> = {
  beginner: "text-green-600 bg-green-50",
  intermediate: "text-amber-600 bg-amber-50",
  advanced: "text-red-600 bg-red-50",
};

export function CourseDetailBody() {
  const { selectedCourseId, setActivePage } = useAppStore();

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-on-surface-variant">Course not found.</p>
      </div>
    );
  }

  const totalLessons = course.sections.reduce(
    (acc, s) => acc + s.lessons.length,
    0
  );
  const completedLessons = course.sections.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.completed).length,
    0
  );

  return (
    <>
      <div className="flex min-h-screen">
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Back navigation */}
          <div className="px-container-margin md:px-xl pt-md">
            <button
              onClick={() => setActivePage("courses")}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm py-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back
              </span>
              Back to Courses
            </button>
          </div>

          <div className="flex-1 p-container-margin md:p-xl space-y-xl">
            {/* Hero section */}
            <section className="relative rounded-3xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 z-0">
                <img
                  className="w-full h-full object-cover object-center"
                  src={course.thumbnail}
                  alt={course.title}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40 z-10"></div>
              <div className="relative z-20 p-xl md:p-2xl flex flex-col items-start justify-center max-w-3xl space-y-md">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColor[course.difficulty] || "text-primary bg-primary/10"}`}
                >
                  {difficultyLabel[course.difficulty] || course.difficulty}
                </span>
                <h1 className="text-display-md text-white font-display-md">
                  {course.title}
                </h1>
                <p className="text-white/80 text-body-md max-w-xl">
                  {course.subtitle}
                </p>
                <div className="flex flex-wrap items-center gap-md text-white/90 text-body-sm">
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-amber-400 text-[18px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>
                    <span className="font-bold">{course.rating}</span>
                    <span className="text-white/60">
                      ({course.reviewsCount.toLocaleString()} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">
                      group
                    </span>
                    {course.studentsCount.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">
                      schedule
                    </span>
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">
                      menu_book
                    </span>
                    {course.modules} modules
                  </div>
                </div>
              </div>
            </section>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              {/* Main content - left 2 columns */}
              <div className="lg:col-span-2 space-y-xl">
                {/* About this course */}
                <section className="bg-surface-container rounded-2xl p-xl space-y-md">
                  <h2 className="font-title-lg text-title-lg text-on-surface">
                    About This Course
                  </h2>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-sm pt-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-caps font-label-caps"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>

                {/* What you'll learn */}
                <section className="bg-surface-container rounded-2xl p-xl space-y-md">
                  <h2 className="font-title-lg text-title-lg text-on-surface">
                    What You&apos;ll Learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                    {[
                      "Build real-world projects from scratch",
                      "Understand core concepts and best practices",
                      "Apply skills in Zambian industry contexts",
                      "Earn a certificate upon completion",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 text-body-sm text-on-surface-variant"
                      >
                        <span
                          className="material-symbols-outlined text-primary text-[20px] mt-0.5"
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          check_circle
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Course Curriculum */}
                <section className="bg-surface-container rounded-2xl p-xl space-y-md">
                  <div className="flex items-center justify-between">
                    <h2 className="font-title-lg text-title-lg text-on-surface">
                      Course Curriculum
                    </h2>
                    <span className="text-body-sm text-on-surface-variant">
                      {course.sections.length} sections &middot; {totalLessons}{" "}
                      lessons
                    </span>
                  </div>

                  {course.sections.length > 0 ? (
                    <div className="space-y-sm">
                      {course.sections.map((section, sIdx) => (
                        <div
                          key={section.id}
                          className="border border-outline-variant rounded-xl overflow-hidden"
                        >
                          <button className="w-full flex items-center justify-between p-md hover:bg-surface-variant/50 transition-colors">
                            <div className="flex items-center gap-sm">
                              <span className="text-primary font-bold text-body-sm">
                                {sIdx + 1}
                              </span>
                              <span className="font-title-sm text-title-sm text-on-surface">
                                {section.title}
                              </span>
                            </div>
                            <span className="text-body-sm text-on-surface-variant">
                              {section.lessons.length} lessons
                            </span>
                          </button>
                          <div className="border-t border-outline-variant">
                            {section.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between px-md py-sm hover:bg-surface-variant/30 transition-colors"
                              >
                                <div className="flex items-center gap-sm">
                                  <span
                                    className={`material-symbols-outlined text-[18px] ${lesson.completed ? "text-primary" : "text-on-surface-variant"}`}
                                    style={{
                                      fontVariationSettings: lesson.completed
                                        ? '"FILL" 1'
                                        : '"FILL" 0',
                                    }}
                                  >
                                    {lesson.type === "video"
                                      ? "play_circle"
                                      : lesson.type === "interactive"
                                        ? "quiz"
                                        : lesson.type === "code_editor"
                                          ? "code"
                                          : "article"}
                                  </span>
                                  <span
                                    className={`text-body-sm ${lesson.completed ? "text-primary font-medium" : "text-on-surface"}`}
                                  >
                                    {lesson.title}
                                  </span>
                                  {lesson.preview && (
                                    <span className="text-label-caps text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                      PREVIEW
                                    </span>
                                  )}
                                </div>
                                <span className="text-body-sm text-on-surface-variant">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-xl text-on-surface-variant">
                      <span className="material-symbols-outlined text-[48px] mb-sm">
                        menu_book
                      </span>
                      <p className="text-body-md">
                        Curriculum details coming soon. Enroll now to get notified
                        when lessons are published.
                      </p>
                    </div>
                  )}
                </section>
              </div>

              {/* Sidebar - right column */}
              <div className="space-y-lg">
                {/* Price & Enroll card */}
                <div className="bg-surface-container rounded-2xl p-xl space-y-md sticky top-20">
                  <div className="flex items-baseline gap-sm">
                    <span className="text-headline-lg font-bold text-on-surface">
                      {course.isFree ? "Free" : `K ${course.price.toLocaleString()}`}
                    </span>
                    {course.discount && course.discount > 0 && (
                      <>
                        <span className="text-body-md text-on-surface-variant line-through">
                          K {course.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-label-caps font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {course.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <button className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl hover:shadow-lg transition-all active:scale-95">
                    {course.isFree ? "Enroll for Free" : "Enroll Now"}
                  </button>

                  {course.certificateEnabled && (
                    <div className="flex items-center gap-sm text-body-sm text-on-surface-variant">
                      <span
                        className="material-symbols-outlined text-primary text-[18px]"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        workspace_premium
                      </span>
                      Certificate of completion included
                    </div>
                  )}

                  <div className="border-t border-outline-variant pt-md space-y-sm">
                    <h3 className="font-title-sm text-title-sm text-on-surface">
                      This course includes:
                    </h3>
                    {[
                      { icon: "play_circle", text: `${course.duration} of video content` },
                      { icon: "code", text: "Hands-on coding exercises" },
                      { icon: "quiz", text: "Quizzes & assessments" },
                      { icon: "download", text: "Downloadable resources" },
                      { icon: "all_inclusive", text: "Full lifetime access" },
                      { icon: "phone_android", text: "Access on mobile & desktop" },
                    ].map((item) => (
                      <div
                        key={item.icon}
                        className="flex items-center gap-sm text-body-sm text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {item.icon}
                        </span>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructor card */}
                <div className="bg-surface-container rounded-2xl p-xl space-y-md">
                  <h3 className="font-title-sm text-title-sm text-on-surface">
                    Your Instructor
                  </h3>
                  <div className="flex items-center gap-md">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[28px]">
                        person
                      </span>
                    </div>
                    <div>
                      <p className="font-title-sm text-title-sm text-on-surface">
                        {course.instructorName}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        Course Instructor
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress card (if enrolled) */}
                {course.progress > 0 && (
                  <div className="bg-surface-container rounded-2xl p-xl space-y-md">
                    <h3 className="font-title-sm text-title-sm text-on-surface">
                      Your Progress
                    </h3>
                    <div className="w-full bg-outline-variant rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                      <span>{course.progress}% complete</span>
                      <span>
                        {completedLessons}/{totalLessons} lessons
                      </span>
                    </div>
                    <button className="w-full h-10 bg-secondary-container text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
                      Continue Learning
                    </button>
                  </div>
                )}
              </div>
            </div>
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
    </>
  );
}
