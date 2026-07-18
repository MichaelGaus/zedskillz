"use client";

import { create } from "zustand";
import { currentUser } from "./mock-data";

interface AppState {
  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;

  // UI State
  theme: "light" | "dark";
  toggleTheme: () => void;

  // AI Overlay (global FAB toggles this)
  aiOverlayOpen: boolean;
  setAiOverlayOpen: (open: boolean) => void;

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
