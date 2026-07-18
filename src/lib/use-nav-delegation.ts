"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/**
 * useNavDelegation — intercepts clicks on <a> and <button> elements
 * across the page and routes to the appropriate page based on text content.
 *
 * The auto-generated body components use Material Symbols spans which contain
 * the icon name as text content (e.g. <span>home</span>), so textContent
 * returns "homeHome" for a Home link with a home icon. We strip these icon
 * name prefixes before matching.
 */

// Common Material Symbol icon names that appear as text content
const ICON_NAMES = new Set([
  "home", "explore", "school", "psychology", "leaderboard", "settings", "help",
  "menu", "search", "language", "notifications", "dashboard", "groups",
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
  "success", "danger", "primary", "secondary", "tertiary",
  "payments", "credit_card", "account_balance", "wallet", "savings",
  "shopping_cart", "shopping_bag", "store", "sell", "paid", "receipt",
  "inventory", "warehouse", "local_shipping", "delivery_dining",
  "restaurant", "fastfood", "local_cafe", "local_bar", "local_drink",
  "local_pizza", "local_dining", "room_service", "takeout_dining",
  "lunch_dining", "dinner_dining", "breakfast_dining",
  "subject", "quiz", "assignment", "assignment_turned_in", "assignment_late",
  "assignment_return", "assignment_returned", "grade", "grading",
  "school", "science", "history_edu", "biotech", "calculation",
  "functions", "integration_instructions", "data_object", "data_array",
  "stat_0", "stat_1", "stat_2", "stat_3", "stat_minus_1", "stat_minus_2",
  "stat_minus_3", "bar_chart", "pie_chart", "show_chart", "monitoring",
  "insights", "analytics", "trending_flat", "trending_up", "trending_down",
  "spark", "new_releases", "auto_graph", "auto_mode", "auto_awesome",
  "magic_button", "auto_fix_high", "auto_fix_off", "auto_fix_normal",
  "tips_and_updates", "lightbulb", "lightbulb_outline", "lightbulb_circle",
  "emoji_objects", "emoji_events", "emoji_nature", "emoji_transportation",
  "emoji_symbols", "emoji_flags", "emoji_food_beverage", "emoji_activities",
  "emoji_people", "emoji_animals_nature", "emoji_travel_places",
  "emoji_objects", "emoji_smileys_emotion",
]);

function stripIconNames(text: string): string {
  // Remove icon name prefixes/suffixes — look for known icon names
  let cleaned = text;
  for (const icon of ICON_NAMES) {
    // Remove icon name if it appears at the start
    if (cleaned.startsWith(icon)) {
      cleaned = cleaned.slice(icon.length);
    }
    // Remove icon name if it appears at the end
    if (cleaned.endsWith(icon)) {
      cleaned = cleaned.slice(0, -icon.length);
    }
  }
  return cleaned.trim();
}

export function useNavDelegation() {
  const { setActivePage, setAiOverlayOpen } = useAppStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find closest clickable: a, button, or div with cursor-pointer
      const clickable = target.closest("a, button, [class*='cursor-pointer'], [role='button']");
      if (!clickable) return;

      // Skip if it's a real link with non-# href
      if (clickable.tagName === "A") {
        const href = clickable.getAttribute("href");
        if (href && href !== "#" && !href.startsWith("#")) return;
      }

      const rawText = clickable.textContent?.trim() || "";
      const text = stripIconNames(rawText);

      // Text-based routing map (exact match preferred, then starts-with)
      const routes: { match: string; page: string; isAI?: boolean }[] = [
        { match: "Home", page: "landing" },
        { match: "Explore Courses", page: "courses" },
        { match: "Explore", page: "courses" },
        { match: "Ranks", page: "leaderboard" },
        { match: "National Ranks", page: "leaderboard" },
        { match: "Leaderboard", page: "leaderboard" },
        { match: "Admin Dashboard", page: "admin-dashboard" },
        { match: "Admin", page: "admin-dashboard" },
        { match: "Community Forums", page: "community" },
        { match: "Community", page: "community" },
        { match: "My Courses", page: "my-courses" },
        { match: "My Learning Dashboard", page: "my-courses" },
        { match: "Try AI Tutor", page: "ai-tutor" },
        { match: "Ask AI Now", page: "ai-tutor" },
        { match: "Ask AI Tutor", page: "ai-tutor", isAI: true },
        { match: "Ask a Question", page: "ai-tutor", isAI: true },
        { match: "AI Tutor", page: "ai-tutor" },
        { match: "START JOURNEY", page: "signup" },
        { match: "Get Started for Free", page: "signup" },
        { match: "Create an Account", page: "signup" },
        { match: "Create Account", page: "my-courses" },
        { match: "Sign Up", page: "signup" },
        { match: "Sign In", page: "auth" },
        { match: "Welcome Back", page: "auth" },
        { match: "Continue Learning", page: "my-courses" },
        { match: "Resume Lesson", page: "my-courses" },
        { match: "View all 200+ courses", page: "courses" },
        { match: "View all", page: "courses" },
        { match: "View All", page: "courses" },
        { match: "View Details", page: "course-detail" },
        { match: "Start Course", page: "course-detail" },
        { match: "Enroll Now", page: "course-detail" },
        { match: "Talk to an Advisor", page: "ai-tutor" },
        { match: "New Post", page: "post" },
        { match: "Create New Post", page: "post" },
        { match: "Start a Topic", page: "post" },
        { match: "ScholarConnect", page: "post" },
        { match: "Dashboard", page: "my-courses" },
        { match: "Settings", page: "landing" },
        { match: "Help", page: "landing" },
        { match: "Help Center", page: "landing" },
        { match: "Resources", page: "landing" },
        { match: "Categories", page: "community" },
        { match: "Members", page: "community" },
        { match: "Bookmarks", page: "community" },
        { match: "Feed", page: "community" },
        { match: "Study Partners", page: "post" },
        { match: "Profile", page: "my-courses" },
        { match: "Continue with Google", page: "my-courses" },
        { match: "Google", page: "my-courses" },
        { match: "View All Activity", page: "admin-dashboard" },
        { match: "Start AI Sprint", page: "ai-tutor" },
        { match: "Invite a Friend", page: "community" },
        { match: "View All Discussions", page: "community" },
        { match: "Explain Memory Stacks in Detail", page: "ai-tutor" },
        { match: "Post Reply", page: "post" },
        { match: "View All Credentials", page: "my-courses" },
        { match: "View Full Leaderboard", page: "leaderboard" },
        { match: "Sort & Filter", page: "courses" },
        { match: "Course Syllabus", page: "course-detail" },
        // Forum categories -> post view
        { match: "General Discussion", page: "post" },
        { match: "Programming Help", page: "post" },
        { match: "Career Advice", page: "post" },
        { match: "Study Groups", page: "post" },
        // Course cards in catalog
        { match: "Full-Stack Web Development", page: "course-detail" },
        { match: "Data Analysis", page: "course-detail" },
        { match: "UI/UX Product Design", page: "course-detail" },
        { match: "Cyber Defense", page: "course-detail" },
        { match: "Flutter", page: "course-detail" },
      ];

      for (const route of routes) {
        // Exact match
        if (text === route.match) {
          e.preventDefault();
          if (route.isAI) setAiOverlayOpen(true);
          else setActivePage(route.page);
          return;
        }
        // Match at word boundary (next char is space, uppercase letter, or end)
        if (text.startsWith(route.match)) {
          const nextChar = text[route.match.length];
          if (nextChar === undefined || nextChar === ' ' || nextChar === nextChar.toUpperCase()) {
            e.preventDefault();
            if (route.isAI) setAiOverlayOpen(true);
            else setActivePage(route.page);
            return;
          }
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [setActivePage, setAiOverlayOpen]);
}
