"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useNavDelegation } from "@/lib/use-nav-delegation";
import { AIOverlay } from "@/components/shared/ai-overlay";
import { GlobalUserMenu } from "@/components/shared/global-user-menu";
import { GlobalTopbar } from "@/components/shared/global-topbar";
import { GlobalBottomNav } from "@/components/shared/global-bottom-nav";
import { GlobalAIFab } from "@/components/shared/global-ai-fab";
import { Footer } from "@/components/shared/footer";

// Page body components (auto-generated from design HTML)
import { LandingBody } from "@/components/pages/landing-body";
import { SigninPage } from "@/components/pages/signin-page";
import { SignupPage } from "@/components/pages/signup-page";
import { AdminBody } from "@/components/pages/admin-body";
import { TutorBody } from "@/components/pages/tutor-body";
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
      case "tutor-dashboard":
        // Only tutors can access the tutor dashboard
        if (!isAuthenticated || user?.role !== "tutor") {
          return <LandingBody />;
        }
        return <TutorBody />;
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
            ${isAuthenticated ? `
              /* Collapsed (68px icons): sidebar sits beside content, content shifted right */
              /* Expanded (288px full): sidebar pushes content to the right (no stacking, no overlay) */
              [data-page-main],
              .lg\\:ml-72 { margin-left: ${sidebarExpanded ? "288px" : "68px"} !important; }
              .lg\\:ml-64 { margin-left: ${sidebarExpanded ? "256px" : "68px"} !important; }
              .md\\:pl-72 { padding-left: ${sidebarExpanded ? "288px" : "68px"} !important; }
              .md\\:left-72 { left: ${sidebarExpanded ? "288px" : "68px"} !important; }
              /* Smooth transitions so content slides alongside the sidebar animation */
              [data-page-main] { transition: margin-left 0.3s ease !important; }
              .lg\\:ml-72,
              .lg\\:ml-64 { transition: margin-left 0.3s ease !important; }
              .md\\:pl-72 { transition: padding-left 0.3s ease !important; }
              .md\\:left-72 { transition: left 0.3s ease !important; }
            ` : `
              /* Higher-specificity selectors (body prefix) to override page-body sidebar margins/padding */
              body [data-page-main],
              body .lg\\:ml-72,
              body .lg\\:ml-64 { margin-left: 0 !important; }
              body .md\\:pl-72 { padding-left: 0 !important; }
              body .md\\:left-72 { left: 0 !important; }
            `}
          }
        `}</style>
      )}
      {showGlobalTopbar && <GlobalTopbar />}
      {/* data-page-content wrapper — GlobalBottomNav adds bottom padding here
          to prevent content from being hidden behind the fixed bottom nav,
          without creating empty space below the Footer */}
      <div data-page-content className="flex flex-col">
        {renderPage()}
      </div>
      {/* Shared footer — mt-auto pushes it below viewport on short pages;
          on pages with their own min-h-screen (like courses), it sits naturally after content */}
      {showGlobalTopbar && <Footer className="mt-auto" />}
      <AIOverlay />
      <GlobalUserMenu />
      {showGlobalTopbar && <GlobalBottomNav />}
      {/* GlobalAIFab renders on all pages, including auth pages */}
      <GlobalAIFab />
    </div>
  );
}
