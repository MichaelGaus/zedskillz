"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

const ICON_NAMES = new Set([
  "home", "explore", "school", "psychology", "leaderboard", "settings", "help",
  "menu", "search", "language", "notifications", "dashboard", "groups", "group", "public",
  "person", "person_search", "person_add", "library_books", "bookmark",
  "bookmark_border", "post_add", "add_circle", "forum", "grid_view",
  "more_vert", "more_horiz", "close", "send", "arrow_forward", "arrow_back",
  "chevron_right", "chevron_left", "keyboard_arrow_down", "keyboard_arrow_up",
  "thumb_up", "chat_bubble_outline", "share", "favorite", "favorite_border",
  "verified", "workspace_premium", "military_tech", "local_fire_department",
  "bolt", "event_available", "trending_up", "trending_down", "auto_awesome",
  "smart_toy", "translate", "track_changes", "rocket_launch", "shield",
  "lock", "mail", "visibility", "visibility_off", "download", "refresh",
  "tune", "filter_list", "sort", "star", "star_half", "star_border",
  "schedule", "signal_cellular_alt", "calculate", "code", "terminal",
  "work", "group_work", "campaign", "analytics", "cloud", "palette",
  "agriculture", "medical_services", "smartphone", "tablet", "computer",
  "image", "video", "audio", "picture_as_pdf", "description", "folder",
  "upload", "file_upload", "attach_file", "delete", "edit", "create",
  "check", "check_circle", "check_circle_outline", "cancel", "error",
  "warning", "info", "help_outline", "report", "report_problem",
  "payments", "credit_card", "account_balance", "wallet", "savings",
  "shopping_cart", "shopping_bag", "store", "sell", "paid", "receipt",
  "inventory", "warehouse", "local_shipping", "delivery_dining",
  "subject", "quiz", "assignment", "assignment_turned_in", "assignment_late",
  "assignment_return", "assignment_returned", "grade", "grading",
  "science", "history_edu", "biotech", "calculation",
  "functions", "integration_instructions", "data_object", "data_array",
  "bar_chart", "pie_chart", "show_chart", "monitoring",
  "insights", "trending_flat", "spark", "new_releases", "auto_graph",
  "auto_mode", "magic_button", "auto_fix_high", "auto_fix_off",
  "tips_and_updates", "lightbulb", "lightbulb_outline", "lightbulb_circle",
  "emoji_objects", "emoji_events",
]);

function stripIconNames(text: string): string {
  let cleaned = text;
  let changed = true;
  while (changed) {
    changed = false;
    for (const icon of ICON_NAMES) {
      if (cleaned.startsWith(icon)) {
        cleaned = cleaned.slice(icon.length);
        changed = true;
      }
      if (cleaned.endsWith(icon)) {
        cleaned = cleaned.slice(0, -icon.length);
        changed = true;
      }
    }
  }
  return cleaned.trim();
}

export function useNavDelegation() {
  const { setActivePage, setAiOverlayOpen, isAuthenticated } = useAppStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("a, button, [class*='cursor-pointer'], [role='button']") as HTMLElement | null;
      if (!clickable) return;

      if (clickable.tagName === "A") {
        const href = clickable.getAttribute("href");
        if (href && href !== "#" && !href.startsWith("#")) return;
      }

      const rawText = clickable.textContent?.trim() || "";
      const text = stripIconNames(rawText);

      // Pages that require authentication — if not signed in, route to sign-in
      const authRequiredPages = ["my-courses", "admin-dashboard", "members", "post", "scholarconnect"];
      const isAuthRequired = (page: string) => authRequiredPages.includes(page);

      // Route table — action is either "page" (navigate) or "ai" (open overlay)
      const routes: { match: string; action: "page" | "ai"; page?: string }[] = [
        // Nav links
        { match: "Home", action: "page", page: "landing" },
        { match: "Explore Courses", action: "page", page: "courses" },
        { match: "Explore", action: "page", page: "courses" },
        { match: "Ranks", action: "page", page: "leaderboard" },
        { match: "National Ranks", action: "page", page: "leaderboard" },
        { match: "Leaderboard", action: "page", page: "leaderboard" },
        { match: "Admin Dashboard", action: "page", page: "admin-dashboard" },
        { match: "Admin", action: "page", page: "admin-dashboard" },
        { match: "Community Forums", action: "page", page: "community" },
        { match: "Community", action: "page", page: "community" },
        { match: "My Courses", action: "page", page: "my-courses" },
        { match: "My Learning Dashboard", action: "page", page: "my-courses" },
        { match: "Dashboard", action: "page", page: "my-courses" },
        { match: "Profile", action: "page", page: "my-courses" },
        { match: "Settings", action: "page", page: "landing" },
        { match: "Help", action: "page", page: "landing" },
        { match: "Help Center", action: "page", page: "landing" },
        { match: "Resources", action: "page", page: "landing" },
        { match: "Categories", action: "page", page: "community" },
        { match: "Members", action: "page", page: "members" },
        { match: "Members Connect", action: "page", page: "members" },
        { match: "Bookmarks", action: "page", page: "community" },
        { match: "Feed", action: "page", page: "community" },
        { match: "Study Partners", action: "page", page: "post" },
        { match: "Support", action: "page", page: "community" },
        { match: "Courses", action: "page", page: "courses" },

        // Auth
        { match: "START JOURNEY", action: "page", page: "signup" },
        { match: "Get Started for Free", action: "page", page: "signup" },
        { match: "Create an Account", action: "page", page: "signup" },
        { match: "Create Account", action: "page", page: "my-courses" },
        { match: "Sign Up", action: "page", page: "signup" },
        { match: "Sign In", action: "page", page: "auth" },
        { match: "Welcome Back", action: "page", page: "auth" },
        { match: "Continue with Google", action: "page", page: "my-courses" },
        { match: "Google", action: "page", page: "my-courses" },

        // Course actions
        { match: "Continue Learning", action: "page", page: "my-courses" },
        { match: "Resume Lesson", action: "page", page: "my-courses" },
        { match: "View all 200+ courses", action: "page", page: "courses" },
        { match: "View all", action: "page", page: "courses" },
        { match: "View All", action: "page", page: "courses" },
        { match: "View All Activity", action: "page", page: "admin-dashboard" },
        { match: "View All Discussions", action: "page", page: "community" },
        { match: "View All Credentials", action: "page", page: "my-courses" },
        { match: "View Full Leaderboard", action: "page", page: "leaderboard" },
        { match: "View Details", action: "page", page: "course-detail" },
        { match: "Start Course", action: "page", page: "course-detail" },
        { match: "Enroll Now", action: "page", page: "course-detail" },
        { match: "Course Syllabus", action: "page", page: "course-detail" },
        { match: "Sort & Filter", action: "page", page: "courses" },

        // Forum categories → post view
        { match: "General Discussion", action: "page", page: "post" },
        { match: "Programming Help", action: "page", page: "post" },
        { match: "Career Advice", action: "page", page: "post" },
        { match: "Study Groups", action: "page", page: "post" },

        // Course cards
        { match: "Full-Stack Web Development", action: "page", page: "course-detail" },
        { match: "Data Analysis", action: "page", page: "course-detail" },
        { match: "UI/UX Product Design", action: "page", page: "course-detail" },
        { match: "Cyber Defense", action: "page", page: "course-detail" },
        { match: "Flutter", action: "page", page: "course-detail" },

        // Posts
        { match: "New Post", action: "page", page: "post" },
        { match: "Create New Post", action: "page", page: "post" },
        { match: "Start a Topic", action: "page", page: "post" },
        { match: "ScholarConnect", action: "page", page: "post" },
        { match: "Post Reply", action: "page", page: "post" },
        { match: "Invite a Friend", action: "page", page: "community" },

        // AI-related → open overlay (not navigate)
        { match: "Try AI Tutor", action: "ai" },
        { match: "Ask AI Now", action: "ai" },
        { match: "Ask AI Tutor", action: "ai" },
        { match: "Ask a Question", action: "ai" },
        { match: "AI Tutor", action: "ai" },
        { match: "Talk to an Advisor", action: "ai" },
        { match: "Start AI Sprint", action: "ai" },
        { match: "Explain Memory Stacks in Detail", action: "ai" },
      ];

      for (const route of routes) {
        let matched = false;
        if (text === route.match) {
          matched = true;
        } else if (text.startsWith(route.match)) {
          const nextChar = text[route.match.length];
          if (nextChar === undefined || nextChar === " " || nextChar === nextChar.toUpperCase()) {
            matched = true;
          }
        }
        if (matched) {
          e.preventDefault();
          if (route.action === "ai") {
            // AI overlay requires auth
            if (!isAuthenticated) {
              setActivePage("auth");
            } else {
              setAiOverlayOpen(true);
            }
          } else if (route.page) {
            // Auth-gated pages: if not signed in, go to sign-in instead
            if (isAuthRequired(route.page) && !isAuthenticated) {
              setActivePage("auth");
            } else {
              setActivePage(route.page);
            }
          }
          return;
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [setActivePage, setAiOverlayOpen, isAuthenticated]);
}
