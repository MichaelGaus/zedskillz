"use client";

import { useAppStore } from "@/lib/store";
import { courses, landingAiChat } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { Footer } from "@/components/shared/footer";
import { AIFab } from "@/components/shared/ai-fab";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const { setActivePage } = useAppStore();
  const featuredCourses = courses.filter((c) => c.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== TopAppBar ===== */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2">
              <Icon name="menu" size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Icon name="school" filled size={24} className="text-on-primary" />
              </div>
              <span className="font-display text-xl font-bold text-primary hidden sm:block">
                Zedskillz Hub
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Home", page: "landing" },
              { label: "Explore", page: "courses" },
              { label: "Ranks", page: "leaderboard" },
              { label: "Admin", page: "admin-dashboard" },
              { label: "Community", page: "community" },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => setActivePage(link.page)}
                className="font-label-caps text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-surface-container rounded-lg">
              <Icon name="language" size={22} />
            </button>
            <button
              onClick={() => setActivePage("my-courses")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-medium hover:bg-secondary-container/80 transition-colors"
            >
              <Icon name="school" size={18} />
              My Courses
            </button>
            <button
              onClick={() => setActivePage("my-courses")}
              className="w-10 h-10 rounded-full bg-primary-container overflow-hidden"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zambian%20Scholar"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        {/* Decorative blurred circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary-fixed text-on-tertiary-fixed rounded-full mb-6">
                <Icon name="auto_awesome" filled size={16} />
                <span className="font-label-caps text-xs uppercase tracking-widest">
                  AI-Powered Education in Zambia
                </span>
              </div>

              {/* Headline with inline logo */}
              <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary leading-tight max-w-2xl">
                Master New Skills with Your Personal{" "}
                <span className="inline-flex items-center align-middle">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-on-primary rounded-lg">
                    <Icon name="psychology" filled size={28} />
                    <span className="font-display">Zambian AI Tutor</span>
                  </span>
                </span>
              </h2>

              <p className="mt-6 text-body-md text-on-surface-variant max-w-xl leading-relaxed">
                Access world-class education tailored to local Zambian contexts.
                Learn in your preferred language, track your progress on national
                leaderboards, and get instant help from our AI mentor.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setActivePage("courses")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-title text-sm font-semibold shadow-lg hover:bg-primary-container transition-colors"
                >
                  Explore Courses
                  <Icon name="arrow_forward" size={18} />
                </button>
                <button
                  onClick={() => setActivePage("ai-tutor")}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-full font-title text-sm font-semibold hover:bg-primary/5 transition-colors"
                >
                  <Icon name="psychology" filled size={18} />
                  Try AI Tutor
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`}
                      alt=""
                      className="w-9 h-9 rounded-full ring-2 ring-surface"
                    />
                  ))}
                </div>
                <div className="text-sm text-on-surface-variant">
                  <span className="font-semibold text-on-surface">Joined by 5,000+</span>{" "}
                  Zambian students this month
                </div>
              </div>
            </div>

            {/* Right: AI chat mockup */}
            <div className="relative">
              <div className="glass-surface rounded-3xl p-6 ai-glow shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="smart_toy" filled size={22} className="text-on-primary" />
                  </div>
                  <div>
                    <div className="font-title text-sm font-semibold">ZedSkillz AI Assistant</div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      {landingAiChat.status}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  {landingAiChat.messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-2",
                        m.role === "user" && "justify-end"
                      )}
                    >
                      {m.role === "ai" && (
                        <div className="w-7 h-7 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                          <Icon name="psychology" filled size={16} className="text-on-tertiary-container" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl p-3 text-sm",
                          m.role === "user"
                            ? "bg-primary text-on-primary rounded-tr-sm"
                            : "bg-surface-container-lowest border-l-4 border-primary rounded-tl-sm"
                        )}
                      >
                        {m.content}
                        {m.thinking && (
                          <span className="inline-block ml-1 opacity-60 animate-pulse">●●●</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input mockup */}
                <div className="mt-4 flex items-center gap-2 p-2 bg-surface-container-lowest rounded-full border border-outline-variant">
                  <input
                    placeholder="Ask your AI tutor anything..."
                    className="flex-1 bg-transparent px-3 text-sm outline-none"
                    disabled
                  />
                  <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="send" filled size={16} className="text-on-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Bento Value Props ===== */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-display-lg text-primary">
              Why Zambia chooses Zedskillz
            </h2>
          </div>

          <div className="bento-grid">
            {/* Localized Intelligence — col-span-8 */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 relative overflow-hidden">
              <Icon
                name="language"
                size={200}
                className="absolute -bottom-8 -right-8 text-primary opacity-[0.08] pointer-events-none"
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center mb-4">
                  <Icon name="translate" filled size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary mb-2">
                  Localized Intelligence
                </h3>
                <p className="text-body-md text-on-surface-variant max-w-lg leading-relaxed">
                  Our AI understands Zambian context, curriculum, and can translate
                  complex concepts into local languages including Bemba, Nyanja, and Tonga.
                  Get help that speaks your language.
                </p>
              </div>
            </div>

            {/* Personalized AI Paths — col-span-4, inverted primary */}
            <div className="md:col-span-4 bg-primary text-on-primary rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-on-primary/5 rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-on-primary/10 flex items-center justify-center mb-4">
                  <Icon name="track_changes" filled size={24} className="text-on-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">
                  Personalized AI Paths
                </h3>
                <p className="text-body-md opacity-90 mb-6 leading-relaxed">
                  Adaptive learning journeys tailored to your pace, goals, and ECZ exam requirements.
                </p>
                <button className="inline-flex items-center gap-1 px-4 py-2 bg-on-primary text-primary rounded-full text-sm font-semibold">
                  START JOURNEY
                  <Icon name="arrow_forward" size={16} />
                </button>
              </div>
            </div>

            {/* Gamified Learning — col-span-4 */}
            <div className="md:col-span-4 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center mb-4">
                <Icon name="military_tech" filled size={24} className="text-on-tertiary-container" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-2">
                Gamified Learning
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Earn XP, climb national leaderboards, and unlock achievements as you master new skills.
              </p>
            </div>

            {/* Peer Support Hub — col-span-8 */}
            <div className="md:col-span-8 bg-surface-container-highest rounded-3xl p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://picsum.photos/seed/zedskillz-campus/800/400)`,
                }}
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                  <Icon name="groups" filled size={24} className="text-on-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary mb-2">
                  Peer Support Hub
                </h3>
                <p className="text-body-md text-on-surface-variant max-w-lg leading-relaxed">
                  Join thousands of Zambian learners. Ask questions, share progress, and grow together
                  in our moderated community forums.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Featured Courses ===== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-display-lg text-primary">
              Featured Courses
            </h2>
            <p className="text-body-md text-on-surface-variant mt-1">
              Curated for the current Zambian Ministry of Education syllabus.
            </p>
          </div>
          <button
            onClick={() => setActivePage("courses")}
            className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
          >
            View all 200+ courses →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setActivePage("course-detail")}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative h-40">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-md">
                  {course.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-title text-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-2">
                  {course.title}
                </h3>
                <div className="text-xs text-on-surface-variant mb-3 flex items-center gap-2">
                  <Icon name="signal_cellular_alt" size={14} />
                  <span className="capitalize">{course.difficulty}</span>
                  <span>•</span>
                  <Icon name="schedule" size={14} />
                  <span>{course.modules} Modules • {course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">
                    {course.progress}% Complete
                  </span>
                  <span className="font-title text-sm font-bold text-on-surface">
                    {course.isFree ? "Free" : `K ${course.price.toLocaleString()}`}
                  </span>
                </div>
                {course.progress > 0 && (
                  <div className="mt-2 w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 pb-24">
        <div className="bg-primary-container rounded-[40px] p-12 md:p-16 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-on-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-display-lg text-on-primary-container mb-4">
              Ready to accelerate your career with AI?
            </h2>
            <p className="text-body-md text-on-primary-container/80 mb-8">
              Join thousands of students and professionals in the largest AI-driven
              educational community in Zambia.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setActivePage("signup")}
                className="px-6 py-3 bg-on-primary text-primary rounded-full font-title text-sm font-semibold shadow-lg hover:bg-on-primary/90 transition-colors"
              >
                Get Started for Free
              </button>
              <button className="px-6 py-3 border-2 border-on-primary-container/30 text-on-primary-container rounded-full font-title text-sm font-semibold hover:bg-on-primary/10 transition-colors">
                Talk to an Advisor
              </button>
            </div>
            <p className="mt-6 text-xs text-on-primary-container/60">
              No credit card required. Free tier includes 5 AI tutoring hours monthly.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <AIFab variant="gradient" />
    </div>
  );
}
