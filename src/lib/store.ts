"use client";

import { create } from "zustand";
import { currentUser } from "./mock-data";

interface AppState {
  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;

  // Authentication
  isAuthenticated: boolean;
  user: { name: string; email: string; avatar: string } | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;

  // UI State
  theme: "light" | "dark";
  toggleTheme: () => void;

  // AI Overlay (global FAB toggles this)
  aiOverlayOpen: boolean;
  setAiOverlayOpen: (open: boolean) => void;

  // User menu dropdown (topbar avatar)
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;

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

export const useAppStore = create<AppState>((set, get) => ({
  activePage: "landing",
  setActivePage: (page) => set({ activePage: page }),

  // Auth — start unauthenticated so user sees landing + can sign in
  isAuthenticated: false,
  user: null,
  signIn: (email, name) => {
    // Derive a display name from the email if not provided
    const derivedName = name || email.split("@")[0].split(/[._-]/).map(
      (s) => s.charAt(0).toUpperCase() + s.slice(1)
    ).join(" ");
    set({
      isAuthenticated: true,
      user: {
        name: derivedName,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      },
      activePage: "my-courses",
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
