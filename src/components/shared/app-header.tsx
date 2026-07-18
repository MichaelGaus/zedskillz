"use client";

import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AppHeaderProps {
  title?: string; // page title (hidden on mobile)
  brand?: "zedskillz" | "scholarconnect"; // sub-brand
  searchPlaceholder?: string;
  showSearch?: boolean;
  navLinks?: { label: string; page: string }[];
  activeNav?: string;
}

/**
 * TopAppBar — sticky 64px header with logo, nav, search, language, notifications, avatar.
 */
export function AppHeader({
  title,
  brand = "zedskillz",
  searchPlaceholder = "Search...",
  showSearch = true,
  navLinks = [
    { label: "Home", page: "landing" },
    { label: "Explore", page: "courses" },
    { label: "Ranks", page: "leaderboard" },
    { label: "Admin", page: "admin-dashboard" },
    { label: "Community", page: "community" },
  ],
  activeNav = "",
}: AppHeaderProps) {
  const { setActivePage, currentUser, unreadNotifications, theme, toggleTheme } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex items-center px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 -ml-2 hover:bg-surface-container rounded-lg"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <Icon name="menu" size={24} />
      </button>

      {/* Logo / brand */}
      <button
        onClick={() => setActivePage("landing")}
        className="flex items-center gap-2 shrink-0"
      >
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Icon name="school" filled size={22} className="text-on-primary" />
        </div>
        {brand === "scholarconnect" ? (
          <span className="font-display text-xl font-bold text-tertiary scale-125 origin-left hidden sm:block">
            ScholarConnect
          </span>
        ) : (
          <span className="font-display text-lg font-bold text-primary hidden sm:block">
            Zedskillz Hub
          </span>
        )}
      </button>

      {/* Page title (hidden on mobile) */}
      {title && (
        <h1 className="hidden lg:block font-headline text-headline text-primary ml-4 pl-4 border-l border-outline-variant">
          {title}
        </h1>
      )}

      {/* Desktop nav links */}
      <nav className="hidden md:flex items-center gap-1 ml-6">
        {navLinks.map((link) => {
          const active = activeNav === link.page || link.page === "landing" && activeNav === "landing";
          return (
            <button
              key={link.label}
              onClick={() => setActivePage(link.page)}
              className={cn(
                "px-3 py-2 text-sm font-label-caps uppercase tracking-wider transition-colors border-b-2",
                active
                  ? "text-primary font-bold border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              )}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Search (centered on course-explorer style) */}
      {showSearch && (
        <div className="hidden md:flex items-center max-w-md flex-1 mx-6">
          <div className="relative w-full">
            <Icon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onFocus={() => setActivePage("courses")}
              className="w-full h-10 pl-10 pr-4 text-sm bg-surface-container-high rounded-full border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-surface-container rounded-lg transition-colors"
          aria-label="Language"
        >
          <Icon name="language" size={22} />
        </button>
        <button className="relative p-2 hover:bg-surface-container rounded-lg transition-colors" aria-label="Notifications">
          <Icon name="notifications" size={22} />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActivePage("my-courses")}
          className="ml-2 w-9 h-9 rounded-full bg-primary-container border-2 border-outline-variant overflow-hidden"
          aria-label="Profile"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 z-30 bg-black/30"
          onClick={() => setMenuOpen(false)}
        >
          <nav className="bg-surface p-4 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setActivePage(link.page);
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium hover:bg-surface-container rounded-lg"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
