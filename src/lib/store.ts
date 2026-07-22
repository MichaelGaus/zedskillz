"use client";

import { create } from "zustand";
import { currentUser } from "./mock-data";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: "student" | "admin" | "instructor" | "parent" | "tutor" | "school";
  bio: string;
  dateOfBirth: string;
  location: string;
  province: string;
  phone: string;
  gender: string;
  education: string;
  school: string;
  interests: string[];
  skills: string[];
  languages: string[];
  socialLinks: { platform: string; url: string }[];
}

interface AppState {
  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;

  // Authentication
  isAuthenticated: boolean;
  user: UserProfile | null;
  signIn: (email: string, name?: string, role?: string) => void;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // UI State
  theme: "light" | "dark";
  toggleTheme: () => void;

  // AI Overlay (global FAB toggles this)
  aiOverlayOpen: boolean;
  setAiOverlayOpen: (open: boolean) => void;

  // User menu dropdown (topbar avatar)
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;

  // Sidebar drawer
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;

  // Selected entities
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;

  // Cart / Wishlist
  wishlist: string[];
  toggleWishlist: (courseId: string) => void;

  // Notifications
  unreadNotifications: number;
  markAllNotificationsRead: () => void;

  // Convenience getters
  currentUser: typeof currentUser;
}

const DEFAULT_PROFILE: Omit<UserProfile, "name" | "email" | "avatar"> = {
  role: "student",
  bio: "",
  dateOfBirth: "",
  location: "",
  province: "",
  phone: "",
  gender: "",
  education: "",
  school: "",
  interests: [],
  skills: [],
  languages: ["English"],
  socialLinks: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  activePage: "landing",
  setActivePage: (page) => set({ activePage: page }),

  // Auth — start unauthenticated so user sees landing + can sign in
  isAuthenticated: false,
  user: null,
  signIn: (email, name, selectedRole) => {
    // Derive a display name from the email if not provided
    const derivedName = name || email.split("@")[0].split(/[._-]/).map(
      (s) => s.charAt(0).toUpperCase() + s.slice(1)
    ).join(" ");

    // Detect admin role from email (overrides selected role)
    const isAdmin = email.toLowerCase().includes("admin") || email.toLowerCase().includes("grace.tembo");
    const role = isAdmin ? "admin" : (selectedRole || "student");

    set({
      isAuthenticated: true,
      user: {
        ...DEFAULT_PROFILE,
        name: derivedName,
        email,
        role: role as UserProfile["role"],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      },
      activePage: isAdmin ? "admin-dashboard" : "my-courses",
    });
  },
  signOut: () => {
    set({
      isAuthenticated: false,
      user: null,
      activePage: "landing",
      userMenuOpen: false,
    });
  },
  updateProfile: (updates) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...updates } });
  },

  theme: "light",
  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    set({ theme: next });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
    }
  },

  aiOverlayOpen: false,
  setAiOverlayOpen: (open) => set({ aiOverlayOpen: open }),

  userMenuOpen: false,
  setUserMenuOpen: (open) => set({ userMenuOpen: open }),

  sidebarExpanded: true,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

  selectedCourseId: null,
  setSelectedCourseId: (id) => set({ selectedCourseId: id }),

  wishlist: ["c2", "c4"],
  toggleWishlist: (courseId) => {
    const list = get().wishlist;
    set({
      wishlist: list.includes(courseId)
        ? list.filter((id) => id !== courseId)
        : [...list, courseId],
    });
  },

  unreadNotifications: 3,
  markAllNotificationsRead: () => set({ unreadNotifications: 0 }),

  currentUser,
}));
