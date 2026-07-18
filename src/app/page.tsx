"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { LandingPage } from "@/components/pages/landing";
import { AuthPage } from "@/components/pages/auth";
import { AppShell } from "@/components/shell/app-shell";
import { StudentDashboard } from "@/components/pages/student-dashboard";
import { InstructorDashboard } from "@/components/pages/instructor-dashboard";
import { AdminDashboard } from "@/components/pages/admin-dashboard";
import { ParentPortal } from "@/components/pages/parent-portal";
import { CoursesCatalog } from "@/components/pages/courses-catalog";
import { CourseDetail } from "@/components/pages/course-detail";
import { CoursePlayer } from "@/components/pages/course-player";
import { SocialFeed } from "@/components/pages/social-feed";
import { MessagingPage } from "@/components/pages/messaging";
import { LeaderboardPage } from "@/components/pages/leaderboard";
import { ProfilePage } from "@/components/pages/profile";
import { SettingsPage } from "@/components/pages/settings";
import { AITutorPage } from "@/components/pages/ai-tutor";
import { LiveClassesPage } from "@/components/pages/live-classes";

export default function Home() {
  const { activePage, isAuthenticated, theme } = useAppStore();

  // Apply theme class on mount and whenever theme changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Unauthenticated users only see auth or landing
  if (!isAuthenticated && activePage !== "landing" && activePage !== "auth") {
    return <AuthPage />;
  }

  // Public pages (no shell)
  if (activePage === "landing") return <LandingPage />;
  if (activePage === "auth") return <AuthPage />;

  // All other pages render inside the app shell
  const renderPage = () => {
    switch (activePage) {
      case "student-dashboard":
        return <StudentDashboard />;
      case "instructor-dashboard":
        return <InstructorDashboard />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "parent-portal":
        return <ParentPortal />;
      case "courses":
        return <CoursesCatalog />;
      case "course-detail":
        return <CourseDetail />;
      case "course-player":
        return <CoursePlayer />;
      case "social":
        return <SocialFeed />;
      case "messaging":
        return <MessagingPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "ai-tutor":
        return <AITutorPage />;
      case "live-classes":
        return <LiveClassesPage />;
      default:
        return <StudentDashboard />;
    }
  };

  return <AppShell>{renderPage()}</AppShell>;
}
