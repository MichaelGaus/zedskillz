"use client";

import { create } from "zustand";
import { currentUser } from "./mock-data";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: "student" | "admin" | "parent" | "tutor" | "school";
  bio: string;
  dateOfBirth: string;
  location: string;
  province: string;
  phone: string;
  gender: string;
  age: number;
  education: string;
  school: string;
  interests: string[];
  skills: string[];
  languages: string[];
  socialLinks: { platform: string; url: string }[];
}

interface AppState {
  // Hydration guard — prevents rendering until localStorage state is restored
  _hydrated: boolean;

  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;

  // Authentication
  isAuthenticated: boolean;
  user: UserProfile | null;
  signIn: (email: string, name?: string, role?: string) => void;
  signUp: (data: {
    firstName: string;
    surname: string;
    email: string;
    role: UserProfile["role"];
    gender: string;
    age: number;
    province: string;
  }) => void;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // UI State
  theme: "light" | "dark";
  toggleTheme: () => void;

  // AI Overlay (global FAB toggles this)
  aiOverlayOpen: boolean;
  setAiOverlayOpen: (open: boolean) => void;

  // Redirect-after-login: store the page/action the user was trying to reach
  intendedPage: string | null;
  setIntendedPage: (page: string | null) => void;
  intendedAiOverlay: boolean;
  setIntendedAiOverlay: (open: boolean) => void;

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
  age: 0,
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

function savePersistedState(state: { isAuthenticated: boolean; user: UserProfile | null; language: string; theme: string; activePage: string; intendedPage?: string | null; intendedAiOverlay?: boolean }) {
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

// ---- SSR-safe defaults (no localStorage access) ----
// During SSR, localStorage is unavailable so we use safe defaults.
// On the client, we immediately rehydrate from localStorage.

export const useAppStore = create<AppState>((set, get) => ({
  // Start unhydrated — the page will defer rendering until this is true
  _hydrated: false,

  // Safe defaults for SSR (will be overwritten by rehydrate on client)
  activePage: "landing",
  setActivePage: (page) => set({ activePage: page }),

  isAuthenticated: false,
  user: null,
  signIn: (email, name, selectedRole) => {
    // Derive a display name from the email if not provided
    const derivedName = name || email.split("@")[0].split(/[._-]/).map(
      (s) => s.charAt(0).toUpperCase() + s.slice(1)
    ).join(" ");

    // Detect admin/tutor role from email (overrides selected role)
    const isAdmin = email.toLowerCase().includes("admin") || email.toLowerCase().includes("grace.tembo");
    const role = isAdmin ? "admin" : (email.toLowerCase().includes("tutor") ? "tutor" : (selectedRole || "student"));

    const user: UserProfile = {
      ...DEFAULT_PROFILE,
      name: derivedName,
      email,
      role: role as UserProfile["role"],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    };
    const isTutor = role === "tutor";

    // Check if user was trying to reach a specific page before being redirected to login
    const { intendedPage, intendedAiOverlay } = get();
    let activePage: string;

    if (intendedPage) {
      // Redirect to the page the user originally wanted to visit
      // But validate role-based restrictions:
      // - Admin users can only access admin-dashboard and landing
      // - Tutor users can only access tutor-dashboard and non-admin pages
      if (isAdmin && intendedPage !== "admin-dashboard" && intendedPage !== "landing") {
        activePage = "admin-dashboard";
      } else if (isTutor && intendedPage === "admin-dashboard") {
        activePage = "tutor-dashboard";
      } else {
        activePage = intendedPage;
      }
    } else {
      // No intended destination — use the default page based on role
      activePage = isAdmin ? "admin-dashboard" : isTutor ? "tutor-dashboard" : "my-courses";
    }

    set({
      isAuthenticated: true,
      user,
      activePage,
      intendedPage: null,  // Clear after use
      intendedAiOverlay: false,  // Will be handled separately below
    });

    // Persist to localStorage (intendedPage/intendedAiOverlay are cleared on successful login)
    const { language, theme } = get();
    savePersistedState({ isAuthenticated: true, user, language, theme: theme as string, activePage, intendedPage: null, intendedAiOverlay: false });

    // If user was trying to open the AI overlay, open it after successful login
    if (intendedAiOverlay) {
      // Small delay to let the page render first
      setTimeout(() => {
        useAppStore.getState().setAiOverlayOpen(true);
      }, 300);
    }
  },
  signUp: ({ firstName, surname, email, role, gender, age, province }) => {
    const name = `${firstName} ${surname}`.trim();
    const derivedRole = email.toLowerCase().includes("admin") || email.toLowerCase().includes("grace.tembo")
      ? "admin" as const
      : email.toLowerCase().includes("tutor")
        ? "tutor" as const
        : role;

    const user: UserProfile = {
      ...DEFAULT_PROFILE,
      name,
      email,
      gender,
      age,
      province,
      role: derivedRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    };

    const activePage = derivedRole === "admin" ? "admin-dashboard"
      : derivedRole === "tutor" ? "tutor-dashboard"
      : "my-courses";

    set({
      isAuthenticated: true,
      user,
      activePage,
      intendedPage: null,
      intendedAiOverlay: false,
    });

    const { language, theme } = get();
    savePersistedState({ isAuthenticated: true, user, language, theme: theme as string, activePage, intendedPage: null, intendedAiOverlay: false });
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

  theme: "light",
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

  intendedPage: null,
  setIntendedPage: (page) => {
    set({ intendedPage: page });
    // Persist intendedPage so it survives page refreshes during the auth flow
    const { isAuthenticated, user, language, theme, activePage, intendedAiOverlay } = get();
    savePersistedState({ isAuthenticated, user, language, theme: theme as string, activePage, intendedPage: page, intendedAiOverlay });
  },
  intendedAiOverlay: false,
  setIntendedAiOverlay: (open) => {
    set({ intendedAiOverlay: open });
    const { isAuthenticated, user, language, theme, activePage, intendedPage } = get();
    savePersistedState({ isAuthenticated, user, language, theme: theme as string, activePage, intendedPage, intendedAiOverlay: open });
  },

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

  language: "English",
  setLanguage: (lang) => {
    set({ language: lang });
    // Persist
    const { isAuthenticated, user, theme, activePage } = get();
    savePersistedState({ isAuthenticated, user, language: lang, theme: theme as string, activePage });
  },

  currentUser,
}));

// ---- Rehydrate from localStorage on the client ----
// NOTE: We do NOT set _hydrated = true here during module init.
// Doing so causes a hydration mismatch because SSR renders the loading
// spinner (_hydrated=false) while the client would render the real page
// (_hydrated=true) — React hydration fails when DOM doesn't match.
//
// Instead, the page component handles rehydration in a useEffect
// (which runs AFTER hydration completes), setting _hydrated=true there.
// This ensures both SSR and client first-render produce identical output
// (the loading spinner), then the useEffect swaps in the real state.
