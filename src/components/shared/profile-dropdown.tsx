"use client";

import { useAppStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";

interface ProfileDropdownProps {
  sizeClass?: string;
}

/**
 * ProfileDropdown — renders a small avatar button that opens a dropdown
 * with the user's info, navigation links, and Sign Out.
 *
 * Uses `data-profile-dropdown` attribute so the nav delegation handler
 * skips clicks inside this component.
 */
export function ProfileDropdown({ sizeClass = "w-8 h-8" }: ProfileDropdownProps) {
  const { user, isAuthenticated, signOut, setActivePage } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const displayName = user?.name ?? "Zambian Scholar";
  const displayInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "ZS";

  // Not authenticated — clicking avatar goes to sign-in (no specific intended page)
  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => {
          useAppStore.getState().setIntendedPage(null);
          useAppStore.getState().setIntendedAiOverlay(false);
          setActivePage("auth");
        }}
        className={`${sizeClass} rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm hover:ring-2 hover:ring-primary transition-all`}
        title="Sign In"
      >
        {displayInitials}
      </button>
    );
  }

  return (
    <div ref={ref} data-profile-dropdown className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={`${sizeClass} rounded-full overflow-hidden border-2 border-primary flex items-center justify-center hover:ring-2 hover:ring-primary transition-all active:scale-95`}
        aria-label="Profile menu"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
            {displayInitials}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl z-[100] overflow-hidden">
          {/* User info header */}
          <div className="p-md flex items-center gap-md bg-surface-container-low border-b border-outline-variant">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">{displayInitials}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-title-sm text-title-sm text-on-surface truncate">{displayName}</div>
              <div className="text-xs text-on-surface-variant truncate">{user?.email}</div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setActivePage("profile");
              }}
              className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
              My Profile
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setActivePage("my-courses");
              }}
              className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">school</span>
              My Courses
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setActivePage("leaderboard");
              }}
              className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">leaderboard</span>
              Leaderboard
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setActivePage("community");
              }}
              className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">groups</span>
              Community
            </button>
          </div>

          {/* Sign out */}
          <div className="border-t border-outline-variant py-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-md px-md py-sm text-body-sm text-error hover:bg-error-container/20 transition-colors text-left font-medium"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
