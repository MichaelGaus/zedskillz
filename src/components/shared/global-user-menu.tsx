"use client";

import { useAppStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react";

/**
 * GlobalUserMenu — wraps avatar clicks across all pages with a user dropdown.
 *
 * Uses event delegation: any click on an avatar image (in the topbar) opens
 * a dropdown with the user's info, profile link, and Sign Out button.
 *
 * Avatars are detected by looking for img elements with "avataaars" in src
 * (DiceBear avatars) OR specific Google AIDA avatar URLs in the topbar area.
 *
 * If not authenticated, clicking the avatar navigates to sign-in.
 */
export function GlobalUserMenu() {
  const { user, isAuthenticated, signOut, userMenuOpen, setUserMenuOpen, setActivePage } = useAppStore();
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Listen for clicks on avatar elements
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find if we clicked on an avatar (img with avataaars or in a profile circle)
      const avatarImg = target.closest("img") as HTMLImageElement | null;

      // Check if this is a topbar avatar (in header) — typically small circular images
      // with avataaars in src OR specific Google AIDA URLs that are avatars
      const isInHeader = target.closest("header");
      if (!isInHeader) return;

      // Check if the clicked element is within a profile/avatar container
      // Profile containers have rounded-full and overflow-hidden, or are inside buttons
      const profileContainer = target.closest(".rounded-full, [class*='rounded-full']");
      if (!profileContainer) return;

      // Make sure this is actually an avatar (has an img inside, or is small/circular)
      const hasImg = profileContainer.querySelector("img");
      const isAvatar =
        (avatarImg && (avatarImg.src.includes("avataaars") || avatarImg.src.includes("aida-public"))) ||
        (hasImg && (hasImg.src.includes("avataaars") || hasImg.src.includes("aida-public")));

      if (!isAvatar) return;

      // Skip if it's the user's own avatar in the dropdown menu
      if (menuRef.current && menuRef.current.contains(target)) return;

      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        // Not signed in — go to sign-in page
        setActivePage("auth");
        return;
      }

      // Open dropdown at the avatar's position
      const rect = profileContainer.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
      setUserMenuOpen(!userMenuOpen);
    };

    // Use capture phase to intercept before other handlers
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [isAuthenticated, userMenuOpen, setUserMenuOpen, setActivePage]);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      // Delay to avoid immediate close from the same click
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handler);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handler);
      };
    }
  }, [userMenuOpen, setUserMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    if (userMenuOpen) {
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [userMenuOpen, setUserMenuOpen]);

  if (!userMenuOpen || !menuPos || !isAuthenticated || !user) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
      style={{ top: menuPos.top, right: menuPos.right }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* User info header */}
      <div className="p-md flex items-center gap-md bg-surface-container-low border-b border-outline-variant">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="font-title-sm text-title-sm text-on-surface truncate">
            {user.name}
          </div>
          <div className="text-xs text-on-surface-variant truncate">
            {user.email}
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-xs">
        <button
          onClick={() => {
            setUserMenuOpen(false);
            setActivePage("profile");
          }}
          className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
          My Profile
        </button>
        <button
          onClick={() => {
            setUserMenuOpen(false);
            setActivePage("my-courses");
          }}
          className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">school</span>
          My Courses
        </button>
        <button
          onClick={() => {
            setUserMenuOpen(false);
            setActivePage("leaderboard");
          }}
          className="w-full flex items-center gap-md px-md py-sm text-body-sm text-on-surface hover:bg-surface-container transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">leaderboard</span>
          Leaderboard
        </button>
        <button
          onClick={() => {
            setUserMenuOpen(false);
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
          onClick={() => {
            signOut();
          }}
          className="w-full flex items-center gap-md px-md py-sm text-body-sm text-error hover:bg-error-container/20 transition-colors text-left font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sign Out
        </button>
      </div>
    </div>
  );
}
