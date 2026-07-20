"use client";

import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

/**
 * GlobalTopbar — consistent topbar across all pages.
 *
 * Hides page-specific <header> elements and renders a single topbar with:
 * - Left: hamburger menu + logo + desktop nav links
 * - Right: theme toggle + language + My Courses (auth-gated) + avatar/login
 *
 * Does NOT show on auth pages (sign-in, sign-up).
 */
export function GlobalTopbar() {
  const { isAuthenticated, user, setActivePage, theme, toggleTheme, activePage } = useAppStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Don't render on auth pages
  if (activePage === "auth" || activePage === "signup") {
    return null;
  }

  // Build nav links based on role
  const isAdmin = isAuthenticated && user?.role === "admin";
  const navLinks = isAdmin
    ? [
        { label: "Home", page: "landing", icon: "home" },
        { label: "Admin", page: "admin-dashboard", icon: "dashboard" },
      ]
    : [
        { label: "Home", page: "landing", icon: "home" },
        { label: "Explore", page: "courses", icon: "explore" },
        { label: "Ranks", page: "leaderboard", icon: "leaderboard" },
        { label: "Community", page: "community", icon: "groups" },
      ];

  const handleNavClick = (page: string) => {
    setActivePage(page);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Topbar — uses div instead of header to avoid being hidden by the global CSS rule that hides page-specific headers */}
      <div data-global-topbar className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm flex items-center justify-between px-4">
        {/* Left section: hamburger + logo + desktop nav */}
        <div className="flex items-center gap-3">
          {/* Hamburger menu — visible on all screen sizes */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer text-on-surface shrink-0 hover:bg-surface-container transition-colors"
            aria-label="Open navigation menu"
          >
            <Icon name="menu" size={24} />
          </button>

          {/* Logo */}
          <button
            onClick={() => handleNavClick("landing")}
            className="flex items-center gap-2 shrink-0 cursor-pointer bg-transparent border-none"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Icon name="school" filled size={22} className="text-on-primary" />
            </div>
            <span className="font-bold text-lg text-primary whitespace-nowrap hidden sm:block">
              Zedskillz Hub
            </span>
          </button>

          {/* Desktop nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6 ml-4">
            {navLinks.map(({ label, page }) => {
              const isActive = activePage === page;
              return (
                <button
                  key={page}
                  onClick={() => handleNavClick(page)}
                  className={cn(
                    "text-sm whitespace-nowrap bg-transparent border-none cursor-pointer transition-colors",
                    isActive
                      ? "font-bold text-primary"
                      : "font-medium text-on-surface-variant hover:text-primary"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right section: actions */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center text-on-surface-variant shrink-0 hover:bg-surface-container transition-colors"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} size={22} />
          </button>

          {/* Language — desktop only */}
          <button
            className="hidden md:flex w-10 h-10 rounded-full border-none bg-transparent cursor-pointer items-center justify-center text-on-surface-variant shrink-0 hover:bg-surface-container transition-colors"
            title="Language"
            aria-label="Language"
          >
            <Icon name="language" size={22} />
          </button>

          {/* My Courses button — auth-gated, non-admin only */}
          {isAuthenticated && !isAdmin && (
            <button
              onClick={() => handleNavClick("my-courses")}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-secondary-container text-on-secondary-container rounded-full border-none cursor-pointer font-semibold text-sm shrink-0 whitespace-nowrap hover:bg-secondary-container/80 transition-colors"
            >
              <Icon name="school" size={18} />
              <span>My Courses</span>
            </button>
          )}

          {/* Avatar or Login */}
          {isAuthenticated && user ? (
            <button
              onClick={() => {
                const event = new CustomEvent("global-user-menu-open", {
                  detail: { top: 72, right: 16 },
                });
                window.dispatchEvent(event);
              }}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant cursor-pointer flex items-center justify-center bg-primary-container shrink-0 hover:opacity-80 transition-opacity"
              aria-label="User menu"
            >
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </button>
          ) : (
            <button
              onClick={() => setActivePage("auth")}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-full border-none cursor-pointer font-semibold text-sm shrink-0 whitespace-nowrap hover:bg-primary/90 transition-colors"
            >
              <Icon name="login" size={18} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Spacer to push content below the fixed topbar */}
      <div className="h-16" />

      {/* Navigation Drawer (Sheet) — slides in from left */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-[280px] max-w-[80vw] p-0 bg-surface-container-lowest">
          <SheetHeader className="flex flex-row items-center justify-between p-4 pb-3 border-b border-outline-variant">
            <SheetTitle className="font-bold text-lg text-primary m-0">Navigation</SheetTitle>
            <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
          </SheetHeader>

          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map(({ label, page, icon }) => {
              const isActive = activePage === page;
              return (
                <button
                  key={page}
                  onClick={() => handleNavClick(page)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none bg-transparent w-full text-left",
                    isActive
                      ? "bg-secondary-container text-on-secondary-container font-semibold"
                      : "text-on-surface hover:bg-surface-container"
                  )}
                >
                  <Icon name={icon} size={22} filled={isActive} className={isActive ? "text-primary" : ""} />
                  {label}
                </button>
              );
            })}

            {/* Authenticated-only links */}
            {isAuthenticated && !isAdmin && (
              <button
                onClick={() => handleNavClick("my-courses")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none bg-transparent w-full text-left",
                  activePage === "my-courses"
                    ? "bg-secondary-container text-on-secondary-container font-semibold"
                    : "text-on-surface hover:bg-surface-container"
                )}
              >
                <Icon name="school" size={22} filled={activePage === "my-courses"} className={activePage === "my-courses" ? "text-primary" : ""} />
                My Courses
              </button>
            )}

            {isAuthenticated && (
              <>
                <button
                  onClick={() => handleNavClick("profile")}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none bg-transparent w-full text-left",
                    activePage === "profile"
                      ? "bg-secondary-container text-on-secondary-container font-semibold"
                      : "text-on-surface hover:bg-surface-container"
                  )}
                >
                  <Icon name="person" size={22} filled={activePage === "profile"} className={activePage === "profile" ? "text-primary" : ""} />
                  My Profile
                </button>
                <button
                  onClick={() => handleNavClick("settings")}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none bg-transparent w-full text-left",
                    activePage === "settings"
                      ? "bg-secondary-container text-on-secondary-container font-semibold"
                      : "text-on-surface hover:bg-surface-container"
                  )}
                >
                  <Icon name="settings" size={22} filled={activePage === "settings"} className={activePage === "settings" ? "text-primary" : ""} />
                  Settings
                </button>
              </>
            )}

            {/* Divider + theme toggle in drawer */}
            <div className="border-t border-outline-variant my-3" />
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent w-full text-left"
            >
              <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} size={22} />
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
