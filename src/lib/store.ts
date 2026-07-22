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

  // Language
  language: string;
  setLanguage: (lang: string) => void;

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

// ---- localStorage persistence helpers ----
const STORAGE_KEY = "zedskillz_store";

function loadPersistedState(): Partial<AppState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function savePersistedState(state: { isAuthenticated: boolean; user: UserProfile | null; language: string; theme: string; activePage: string }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded or private mode */ }
}

function clearPersistedState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* noop */ }
}

// ---- Restore persisted state on load ----
const persisted = loadPersistedState();

export const useAppStore = create<AppState>((set, get) => ({
  activePage: persisted.activePage || "landing",
  setActivePage: (page) => set({ activePage: page }),

  // Auth — attempt restore from localStorage, else unauthenticated
  isAuthenticated: persisted.isAuthenticated || false,
  user: persisted.user || null,
  signIn: (email, name, selectedRole) => {
    // Derive a display name from the email if not provided
    const derivedName = name || email.split("@")[0].split(/[._-]/).map(
      (s) => s.charAt(0).toUpperCase() + s.slice(1)
    ).join(" ");

    // Detect admin role from email (overrides selected role)
    const isAdmin = email.toLowerCase().includes("admin") || email.toLowerCase().includes("grace.tembo");
    const role = isAdmin ? "admin" : (selectedRole || "student");

    const user: UserProfile = {
      ...DEFAULT_PROFILE,
      name: derivedName,
      email,
      role: role as UserProfile["role"],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    };
    const isTutor = role === "tutor";
    const activePage = isAdmin ? "admin-dashboard" : isTutor ? "tutor-dashboard" : "my-courses";

    set({ isAuthenticated: true, user, activePage });

    // Persist to localStorage
    const { language, theme } = get();
    savePersistedState({ isAuthenticated: true, user, language, theme: theme as string, activePage });
  },
  signOut: () => {
    set({
      isAuthenticated: false,
      user: null,
      activePage: "landing",
      userMenuOpen: false,
    });
    clearPersistedState();
  },
  updateProfile: (updates) => {
    const current = get().user;
    if (!current) return;
    const updatedUser = { ...current, ...updates };
    set({ user: updatedUser });
    // Persist updated profile
    const { language, theme, isAuthenticated, activePage } = get();
    savePersistedState({ isAuthenticated, user: updatedUser, language, theme: theme as string, activePage });
  },

  theme: (persisted.theme as "light" | "dark") || "light",
  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    set({ theme: next });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
    }
    // Persist
    const { isAuthenticated, user, language, activePage } = get();
    savePersistedState({ isAuthenticated, user, language, theme: next, activePage });
  },

  aiOverlayOpen: false,
  setAiOverlayOpen: (open) => set({ aiOverlayOpen: open }),

  userMenuOpen: false,
  setUserMenuOpen: (open) => set({ userMenuOpen: open }),

  sidebarExpanded: false,
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

  language: persisted.language || "English",
  setLanguage: (lang) => {
    set({ language: lang });
    // Persist
    const { isAuthenticated, user, theme, activePage } = get();
    savePersistedState({ isAuthenticated, user, language: lang, theme: theme as string, activePage });
  },

  currentUser,
}));
