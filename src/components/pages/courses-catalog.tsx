"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { courses, courseCategories, aiRecommendedCourse } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { AppShell } from "@/components/shared/app-shell";
import { cn } from "@/lib/utils";

export function CourseExplorer() {
  const { setActivePage, wishlist, toggleWishlist } = useAppStore();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = courses.filter((c) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "ai") return c.category === "AI & ML" || c.tags.some((t) => t.toLowerCase().includes("ai"));
    if (activeCategory === "prog") return c.category === "Programming" || c.tags.some((t) => t.toLowerCase().includes("python") || t.toLowerCase().includes("react") || t.toLowerCase().includes("javascript"));
    if (activeCategory === "data") return c.category === "Data Science";
    if (activeCategory === "cloud") return c.category === "Cloud Computing";
    if (activeCategory === "design") return c.category === "Design";
    if (activeCategory === "cyber") return c.category === "Cybersecurity";
    if (activeCategory === "mobile") return c.category === "Mobile";
    if (activeCategory === "marketing") return c.tags.some((t) => t.toLowerCase().includes("marketing"));
    if (activeCategory === "health") return c.category === "Health";
    if (activeCategory === "vocational") return c.category === "Vocational";
    if (activeCategory === "math") return c.category === "Mathematics";
    return true;
  });

  return (
    <AppShell
      title="Explore Courses"
      searchPlaceholder="Search for courses, skills, or AI tools..."
      activeNav="courses"
      sidebarActivePage="courses"
      navLinks={[
        { label: "Home", page: "landing" },
        { label: "Explore", page: "courses" },
        { label: "Ranks", page: "leaderboard" },
        { label: "Admin", page: "admin-dashboard" },
        { label: "Community", page: "community" },
      ]}
      bottomNavItems={[
        { label: "Home", icon: "home", page: "landing" },
        { label: "Explore", icon: "explore", page: "courses" },
        { label: "AI Tutor", icon: "psychology", page: "ai-tutor", elevated: true },
        { label: "My Courses", icon: "school", page: "my-courses" },
      ]}
      bottomNavActivePage="courses"
    >
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* ===== AI Recommended Hero ===== */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-xl ai-glow cursor-pointer"
          onClick={() => setActivePage("course-detail")}
        >
          {/* Bg image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${aiRecommendedCourse.thumbnail})` }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10" />

          {/* Content */}
          <div className="relative z-20 p-6 md:p-12 lg:p-16 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed rounded-full mb-4">
              <Icon name="auto_awesome" filled size={14} />
              <span className="font-label-caps text-[10px] uppercase tracking-widest">
                AI Recommended For You
              </span>
            </div>
            <h2 className="font-display text-display-lg-mobile md:text-display-lg text-on-primary mb-3 leading-tight">
              {aiRecommendedCourse.title}
            </h2>
            <p className="text-body-md text-on-primary/80 max-w-xl mb-6">
              {aiRecommendedCourse.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePage("course-detail");
                }}
                className="px-6 py-2.5 bg-on-primary text-primary rounded-full font-title text-sm font-semibold hover:bg-on-primary/90 transition-colors"
              >
                Enroll Now
              </button>
              <button className="px-6 py-2.5 bg-on-primary/10 backdrop-blur-md text-on-primary border border-on-primary/20 rounded-full font-title text-sm font-semibold hover:bg-on-primary/20 transition-colors">
                Course Syllabus
              </button>
            </div>
          </div>
        </div>

        {/* ===== Filters ===== */}
        <div className="border-b border-outline-variant pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
              {courseCategories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap",
                      active
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80"
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-outline-variant text-sm font-medium rounded-full hover:bg-surface-container transition-colors shrink-0">
              <Icon name="tune" size={16} />
              Sort &amp; Filter
            </button>
          </div>
        </div>

        {/* ===== Course Grid ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((course) => {
            const inWishlist = wishlist.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => setActivePage("course-detail")}
                className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-44">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-wide rounded-full">
                    {course.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(course.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Icon
                      name={inWishlist ? "bookmark" : "bookmark_border"}
                      filled={inWishlist}
                      size={16}
                      className={inWishlist ? "text-primary" : "text-on-surface-variant"}
                    />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-title text-sm font-semibold text-on-surface line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                    {course.subtitle}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-3">
                    <span className="flex items-center gap-1">
                      <Icon name="signal_cellular_alt" size={14} />
                      <span className="capitalize">{course.difficulty}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="schedule" size={14} />
                      {course.duration}
                    </span>
                  </div>

                  {/* Rating + Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1 text-xs">
                      <Icon name="star" filled size={14} className="text-amber-500" />
                      <span className="font-medium text-on-surface">{course.rating}</span>
                      <span className="text-on-surface-variant">({course.reviewsCount})</span>
                    </span>
                    <span className="font-title text-sm font-bold text-on-surface">
                      {course.isFree ? "Free" : `K ${course.price.toLocaleString()}`}
                    </span>
                  </div>

                  {/* CTA */}
                  <button className="w-full py-2 bg-secondary-container text-on-secondary-container group-hover:bg-primary group-hover:text-on-primary rounded-lg text-xs font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Icon name="search_off" size={64} className="mx-auto text-on-surface-variant opacity-40 mb-3" />
            <p className="text-on-surface-variant">No courses match your filters.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
