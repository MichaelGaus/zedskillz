"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useNavDelegation } from "@/lib/use-nav-delegation";
import { AIOverlay } from "@/components/shared/ai-overlay";
import { GlobalUserMenu } from "@/components/shared/global-user-menu";
import { GlobalTopbar } from "@/components/shared/global-topbar";
import { GlobalBottomNav } from "@/components/shared/global-bottom-nav";
import { GlobalAIFab } from "@/components/shared/global-ai-fab";

// Page body components (auto-generated from design HTML)
import { LandingBody } from "@/components/pages/landing-body";
import { SigninPage } from "@/components/pages/signin-page";
import { SignupPage } from "@/components/pages/signup-page";
import { AdminBody } from "@/components/pages/admin-body";
import { CoursesBody } from "@/components/pages/courses-body";
import { MyCoursesBody } from "@/components/pages/my-courses-body";
import { LeaderboardBody } from "@/components/pages/leaderboard-body";
import { CommunityBody } from "@/components/pages/community-body";
import { PostBody } from "@/components/pages/post-body";
import { MembersBody } from "@/components/pages/members-body";
import { ProfilePage } from "@/components/pages/profile-page";
import { SettingsPage } from "@/components/pages/settings-page";

export default function Home() {
  const { activePage, theme, isAuthenticated, user, sidebarExpanded } = useAppStore();
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
      case "course-detail":
        return <CoursesBody />;
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
      {showGlobalTopbar && (
        <style>{`
          header { display: none !important; }
          @media (min-width: 768px) {
            [data-page-main],
            .lg\\:ml-72 { margin-left: ${sidebarExpanded ? "288px" : "68px"} !important; }
            .lg\\:ml-64 { margin-left: ${sidebarExpanded ? "256px" : "68px"} !important; }
            .md\\:pl-72 { padding-left: ${sidebarExpanded ? "288px" : "68px"} !important; }
            .md\\:left-72 { left: ${sidebarExpanded ? "288px" : "68px"} !important; }
          }
        `}</style>
      )}
      {showGlobalTopbar && <GlobalTopbar />}
      {renderPage()}
      <AIOverlay />
      <GlobalUserMenu />
      {showGlobalTopbar && <GlobalBottomNav />}
      {/* GlobalAIFab renders on all pages, including auth pages */}
      <GlobalAIFab />
    </div>
  );
}
