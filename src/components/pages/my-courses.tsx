"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  currentUser,
  myActiveCourses,
  suggestedCourses,
  miniLeaderboard,
} from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { AppShell } from "@/components/shared/app-shell";
import { cn } from "@/lib/utils";

export function MyCourses() {
  const { setActivePage } = useAppStore();
  // Animate progress bars on mount — start at 0, then animate to actual values via CSS transition
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AppShell
      title="My Learning Dashboard"
      searchPlaceholder="Search courses..."
      activeNav="my-courses"
      sidebarActivePage="my-courses"
      navLinks={[
        { label: "Home", page: "landing" },
        { label: "Explore", page: "courses" },
        { label: "Ranks", page: "leaderboard" },
        { label: "Admin", page: "admin-dashboard" },
        { label: "Community", page: "community" },
      ]}
      footerVariant="rounded"
      bottomNavItems={[
        { label: "Home", icon: "home", page: "landing" },
        { label: "Explore", icon: "explore", page: "courses" },
        { label: "AI Tutor", icon: "psychology", page: "ai-tutor", elevated: true },
        { label: "My Courses", icon: "school", page: "my-courses" },
      ]}
      bottomNavActivePage="my-courses"
    >
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* ===== Welcome Banner ===== */}
        <div className="relative rounded-3xl overflow-hidden h-56 md:h-64 flex items-center px-6 md:px-12 shadow-lg">
          {/* Bg image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://picsum.photos/seed/zedskillz-welcome/1600/400)` }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-container to-transparent opacity-90" />

          <div className="relative max-w-xl text-on-primary">
            <h2 className="font-display text-display-lg-mobile md:text-display-lg mb-2">
              Welcome back, Scholar!
            </h2>
            <p className="text-body-md opacity-90 mb-5">
              You&apos;ve completed {currentUser.weeklyGoalProgress}% of your weekly goal.
              Keep going to unlock the &apos;AI Pioneer&apos; badge today.
            </p>
            <button
              onClick={() => setActivePage("course-player")}
              className="px-6 py-2.5 bg-surface text-primary rounded-full font-title text-sm font-semibold shadow hover:bg-surface-container-lowest transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>

        {/* ===== Bento Grid ===== */}
        <div className="bento-grid">
          {/* Active Courses — col-span-8 */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-headline text-on-surface">Active Courses</h3>
              <button className="text-sm text-primary hover:underline">View all</button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {myActiveCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActivePage("course-player")}
                >
                  <div className="relative h-36">
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                    <span
                      className={cn(
                        "absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full",
                        course.difficulty === "advanced"
                          ? "bg-on-tertiary-container text-white"
                          : "bg-primary/90 text-white"
                      )}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-title text-sm font-semibold text-on-surface line-clamp-1 mb-1">
                      {course.title}
                    </h4>
                    <div className="text-xs text-on-surface-variant mb-2">
                      Module {course.module} of {course.totalModules}
                    </div>
                    <div className="text-xs text-on-surface-variant mb-3">
                      {course.progress}% Complete
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${mounted ? course.progress : 0}%` }}
                      />
                    </div>
                    <button className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors">
                      Resume Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested for You — carousel */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline text-headline text-on-surface">Suggested for You</h3>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container">
                    <Icon name="chevron_left" size={18} />
                  </button>
                  <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container">
                    <Icon name="chevron_right" size={18} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {suggestedCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setActivePage("course-detail")}
                    className={cn(
                      "min-w-[280px] w-[280px] bg-surface-container-lowest rounded-2xl border overflow-hidden cursor-pointer hover:shadow-md transition-shadow shrink-0",
                      course.aiRecommended ? "border-primary/20 ai-glow" : "border-outline-variant/30"
                    )}
                  >
                    <div className="relative h-32">
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                      {course.aiRecommended && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 bg-primary/95 text-on-primary rounded-full text-[10px] font-bold uppercase">
                          <Icon name="auto_awesome" filled size={12} />
                          AI Recommended
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-title text-sm font-semibold text-on-surface line-clamp-1 mb-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                        {course.subtitle}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] px-2 py-1 rounded-full font-medium",
                            course.isFree
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-secondary-container text-on-secondary-container"
                          )}
                        >
                          {course.isFree ? "Free" : `K ${course.price}`}
                        </span>
                        <span className="text-xs text-on-surface-variant">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — col-span-4 */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Learning Assistant */}
            <div className="glass-card rounded-2xl p-5 border-primary/20 ai-glow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Icon name="psychology" filled size={24} className="text-on-primary" />
                </div>
                <div>
                  <div className="font-title text-sm font-semibold">AI Learning Assistant</div>
                  <div className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Online &amp; ready to help
                  </div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant italic mb-4">
                &quot;You&apos;ve been studying hard today! Want me to summarize the key
                points from your last Python module?&quot;
              </p>
              <button
                onClick={() => setActivePage("ai-tutor")}
                className="w-full py-2.5 bg-gradient-to-r from-primary to-tertiary-container text-on-primary rounded-lg text-sm font-semibold shadow hover:opacity-90 transition-opacity"
              >
                Ask AI Now
              </button>
            </div>

            {/* Recent Certifications */}
            <div className="bg-surface-container rounded-2xl p-5">
              <h3 className="font-title text-sm font-semibold mb-4">Recent Certifications</h3>
              <div className="space-y-3">
                {currentUser.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-high cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center shrink-0">
                      <Icon name="verified" filled size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-1">{cert.title}</div>
                      <div className="text-xs text-on-surface-variant">
                        Issued {cert.issuedAt}
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-surface-container rounded">
                      <Icon name="download" size={18} className="text-on-surface-variant" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-xs text-primary hover:underline">
                View All Credentials →
              </button>
            </div>

            {/* Mini Leaderboard */}
            <div className="bg-surface-container-highest rounded-2xl p-5">
              <h3 className="font-title text-sm font-semibold mb-4 flex items-center gap-2">
                <Icon name="leaderboard" size={18} className="text-primary" />
                Leaderboard
              </h3>
              <div className="space-y-2">
                {miniLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg",
                      entry.isMe && "bg-primary/10"
                    )}
                  >
                    <span
                      className={cn(
                        "font-display text-sm font-bold w-6 text-center",
                        entry.isMe ? "text-primary" : "text-on-surface-variant"
                      )}
                    >
                      {entry.rank}
                    </span>
                    <img
                      src={entry.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="flex-1 text-sm font-medium">
                      {entry.name}
                      {entry.isMe && (
                        <span className="ml-1 text-[10px] text-primary">(You)</span>
                      )}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActivePage("leaderboard")}
                className="mt-3 text-xs text-primary hover:underline"
              >
                View Full Leaderboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
