"use client";

import { create } from "zustand";
import type { UserRole, User } from "./types";
import { currentUser, users } from "./mock-data";

interface AppState {
  // Auth
  currentRole: UserRole;
  currentUser: User;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  login: () => void;
  logout: () => void;

  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Selected entities
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;

  // Cart / Wishlist
  wishlist: string[];
  toggleWishlist: (courseId: string) => void;

  // Notifications
  unreadNotifications: number;
  markAllNotificationsRead: () => void;
}

// Pick a default user for each role
const roleUsers: Record<UserRole, User> = {
  student: users.find((u) => u.id === "u-student-1")!,
  instructor: users.find((u) => u.id === "u-instr-1")!,
  admin: users.find((u) => u.id === "u-admin-1")!,
  parent: users.find((u) => u.id === "u-parent-1")!,
  super_admin: users.find((u) => u.id === "u-admin-1")!,
  school: users.find((u) => u.id === "u-admin-1")!,
  organization: users.find((u) => u.id === "u-admin-1")!,
  guest: {
    ...currentUser,
    id: "guest",
    name: "Guest User",
    email: "guest@zedskillz.com",
    role: "guest",
  },
};

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: "student",
  currentUser: roleUsers.student,
  isAuthenticated: true,
  setRole: (role) => set({ currentRole: role, currentUser: roleUsers[role], activePage: defaultPageForRole(role) }),
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),

  activePage: "landing",
  setActivePage: (page) => set({ activePage: page }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  theme: "light",
  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    set({ theme: next });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
    }
  },

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

  unreadNotifications: 4,
  markAllNotificationsRead: () => set({ unreadNotifications: 0 }),
}));

export function defaultPageForRole(role: UserRole): string {
  switch (role) {
    case "student":
      return "student-dashboard";
    case "instructor":
      return "instructor-dashboard";
    case "admin":
    case "super_admin":
      return "admin-dashboard";
    case "parent":
      return "parent-portal";
    case "school":
    case "organization":
      return "admin-dashboard";
    case "guest":
      return "landing";
    default:
      return "landing";
  }
}
