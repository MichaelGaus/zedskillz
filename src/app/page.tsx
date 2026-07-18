"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { LandingPage } from "@/components/pages/landing";
import { AuthPage } from "@/components/pages/auth";
import { SignupPage } from "@/components/pages/signup";
import { AdminDashboard } from "@/components/pages/admin-dashboard";
import { CourseExplorer } from "@/components/pages/courses-catalog";
import { MyCourses } from "@/components/pages/my-courses";
import { Leaderboard } from "@/components/pages/leaderboard";
import { CommunityPage } from "@/components/pages/community";
import { IndividualPostView } from "@/components/pages/individual-post";
import { AIOverlay } from "@/components/shared/ai-overlay";

export default function Home() {
  const { activePage, theme } = useAppStore();

  // Apply theme class
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <LandingPage />;
      case "auth":
        return <AuthPage />;
      case "signup":
        return <SignupPage />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "courses":
        return <CourseExplorer />;
      case "my-courses":
        return <MyCourses />;
      case "leaderboard":
        return <Leaderboard />;
      case "community":
        return <CommunityPage />;
      case "post":
      case "scholarconnect":
        return <IndividualPostView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <>
      {renderPage()}
      <AIOverlay />
    </>
  );
}
