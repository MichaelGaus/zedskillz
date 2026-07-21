"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useNavDelegation } from "@/lib/use-nav-delegation";
import { AIOverlay } from "@/components/shared/ai-overlay";
import { GlobalUserMenu } from "@/components/shared/global-user-menu";
import { GlobalTopbar } from "@/components/shared/global-topbar";

// Page body components (auto-generated from design HTML)
import { LandingBody } from "@/components/pages/landing-body";
import { SigninPage } from "@/components/pages/signin-page";
import { SignupPage } from "@/components/pages/signup-page";
import { AdminBody } from "@/components/pages/admin-body";
import { CoursesBody } from "@/components/pages/courses-body";
import { CourseDetailBody } from "@/components/pages/course-detail-body";
import { MyCoursesBody } from "@/components/pages/my-courses-body";
import { LeaderboardBody } from "@/components/pages/leaderboard-body";
import { CommunityBody } from "@/components/pages/community-body";
import { PostBody } from "@/components/pages/post-body";
import { MembersBody } from "@/components/pages/members-body";
import { ProfilePage } from "@/components/pages/profile-page";
import { SettingsPage } from "@/components/pages/settings-page";

export default function Home() {
  const { activePage, theme, isAuthenticated, user } = useAppStore();
  useNavDelegation();

  // Apply theme class
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <LandingBody />;
      case "auth":
        return <SigninPage />;
      case "signup":
        return <SignupPage />;
      case "admin-dashboard":
        // Only admins can access the admin dashboard
        if (!isAuthenticated || user?.role !== "admin") {
          return <LandingBody />;
        }
        return <AdminBody />;
      case "courses":
        return <CoursesBody />;
      case "course-detail":
        return <CourseDetailBody />;
      case "my-courses":
        return <MyCoursesBody />;
      case "leaderboard":
        return <LeaderboardBody />;
      case "community":
        return <CommunityBody />;
      case "members":
        return <MembersBody />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "post":
      case "scholarconnect":
        return <PostBody />;
      default:
        return <LandingBody />;
    }
  };

  // Don't show the global topbar on auth pages (they have their own full-screen layout)
  const showGlobalTopbar = activePage !== "auth" && activePage !== "signup";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showGlobalTopbar && <GlobalTopbar />}
      {renderPage()}
      <AIOverlay />
      <GlobalUserMenu />
    </div>
  );
}
