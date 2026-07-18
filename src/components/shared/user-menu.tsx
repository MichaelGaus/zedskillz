"use client";

import { useAppStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";

/**
 * UserMenu — wraps the topbar avatar and shows a dropdown on click
 * with the user's name/email, profile link, and Sign Out button.
 *
 * Renders the children (the avatar/button) and wraps it with click handling.
 */
export function UserMenu({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, signOut, setUserMenuOpen, userMenuOpen, setActivePage } = useAppStore();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }
  }, [userMenuOpen, setUserMenuOpen]);

  if (!isAuthenticated) {
    // Not signed in — clicking the avatar goes to sign-in
    return (
      <div
        onClick={() => setActivePage("auth")}
        className="cursor-pointer"
        title="Sign In"
      >
        {children}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setUserMenuOpen(!userMenuOpen);
        }}
        className="cursor-pointer"
        title={user?.name}
      >
        {children}
      </div>

      {userMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* User info header */}
          <div className="p-md flex items-center gap-md bg-surface-container-low border-b border-outline-variant">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="font-title-sm text-title-sm text-on-surface truncate">
                {user?.name}
              </div>
              <div className="text-xs text-on-surface-variant truncate">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(false);
                setActivePage("my-courses");
              }}
              className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
              My Profile
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(false);
                setActivePage("my-courses");
              }}
              className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">school</span>
              My Courses
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(false);
                setActivePage("settings");
              }}
              className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">settings</span>
              Settings
            </button>
          </div>

          {/* Sign out */}
          <div className="border-t border-outline-variant py-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
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
