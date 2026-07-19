"use client";

import { useAppStore } from "@/lib/store";
import { useEffect, useRef } from "react";

/**
 * GlobalTopbar — injects a consistent topbar across all pages.
 *
 * Hides the page-specific <header> elements and injects a single consistent
 * topbar with: logo + nav links (Home, Explore, Ranks, Admin, Community) on
 * the left, and theme toggle + language + My Courses (auth-gated) + avatar
 * on the right.
 *
 * Does NOT show on auth pages (sign-in, sign-up).
 */
export function GlobalTopbar() {
  const { isAuthenticated, user, setActivePage, theme, toggleTheme, activePage } = useAppStore();
  const topbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Don't inject on auth pages
    if (activePage === "auth" || activePage === "signup") {
      // Remove existing topbar if present
      const existing = document.querySelector("[data-global-topbar]");
      if (existing) existing.remove();
      // Restore body padding
      document.body.style.paddingTop = "";
      // Restore original headers
      document.querySelectorAll("header").forEach((h) => {
        (h as HTMLElement).style.display = "";
      });
      return;
    }

    // Remove any existing global topbar
    const existing = document.querySelector("[data-global-topbar]");
    if (existing) existing.remove();

    // Hide all page-specific headers
    document.querySelectorAll("header").forEach((h) => {
      (h as HTMLElement).style.display = "none";
    });

    // Build the topbar HTML
    const navLinks = [
      { label: "Home", page: "landing" },
      { label: "Explore", page: "courses" },
      { label: "Ranks", page: "leaderboard" },
      { label: "Admin", page: "admin-dashboard" },
      { label: "Community", page: "community" },
    ];

    const topbar = document.createElement("div");
    topbar.setAttribute("data-global-topbar", "true");
    topbar.className = "fixed top-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm";
    topbar.style.height = "64px";
    topbar.style.display = "flex";
    topbar.style.alignItems = "center";
    topbar.style.justifyContent = "space-between";
    topbar.style.padding = "0 16px";

    topbar.innerHTML = `
      <div style="display:flex;align-items:center;gap:24px;">
        <div data-nav-link data-page="landing" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <div style="width:36px;height:36px;border-radius:8px;background:var(--primary);display:flex;align-items:center;justify-content:center;">
            <span class="material-symbols-outlined" style="color:var(--on-primary);font-variation-settings:'FILL' 1;font-size:22px;">school</span>
          </div>
          <span style="font-weight:700;font-size:18px;color:var(--primary);display:none;" class="sm:inline">Zedskillz Hub</span>
        </div>
        <div style="display:none;align-items:center;gap:24px;" class="md:flex">
          ${navLinks.map(({ label, page }) => {
            const isActive = activePage === page;
            return `<a href="#" data-nav-link data-page="${page}" style="font-size:14px;font-weight:${isActive ? "700" : "500"};color:${isActive ? "var(--primary)" : "var(--on-surface-variant)"};text-decoration:none;">${label}</a>`;
          }).join("")}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button data-theme-toggle style="width:40px;height:40px;border-radius:9999px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--on-surface-variant);" title="${theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}">
          <span class="material-symbols-outlined">${theme === "dark" ? "light_mode" : "dark_mode"}</span>
        </button>
        <button style="width:40px;height:40px;border-radius:9999px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--on-surface-variant);" title="Language">
          <span class="material-symbols-outlined">language</span>
        </button>
        <button data-auth-button data-page="${isAuthenticated ? "my-courses" : "auth"}" style="display:${isAuthenticated ? "flex" : "none"};align-items:center;gap:8px;padding:8px 16px;background:var(--secondary-container);color:var(--on-secondary-container);border-radius:9999px;border:none;cursor:pointer;font-weight:600;font-size:14px;">
          <span class="material-symbols-outlined" style="font-size:18px;">school</span>
          <span>My Courses</span>
        </button>
        ${isAuthenticated && user
          ? `<div data-avatar-container style="width:40px;height:40px;border-radius:9999px;overflow:hidden;border:2px solid var(--outline-variant);cursor:pointer;display:flex;align-items:center;justify-content:center;background:var(--primary-container);">
              <img src="${user.avatar}" alt="${user.name}" style="width:100%;height:100%;object-fit:cover;" />
            </div>`
          : `<button data-login-button style="display:flex;align-items:center;gap:6px;padding:8px 20px;background:var(--primary);color:var(--on-primary);border-radius:9999px;border:none;cursor:pointer;font-weight:600;font-size:14px;transition:opacity 0.2s;">
              <span class="material-symbols-outlined" style="font-size:18px;">login</span>
              <span>Login</span>
            </button>`}
      </div>
    `;

    document.body.insertBefore(topbar, document.body.firstChild);
    document.body.style.paddingTop = "64px";
    topbarRef.current = topbar;

    // Wire up click handlers (using event delegation on the topbar)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navLink = target.closest("[data-nav-link]");
      const themeBtn = target.closest("[data-theme-toggle]");
      const avatar = target.closest("[data-avatar-container]");
      const authBtn = target.closest("[data-auth-button]");
      const loginBtn = target.closest("[data-login-button]");

      if (navLink) {
        e.preventDefault();
        e.stopPropagation();
        const page = navLink.getAttribute("data-page");
        if (page) setActivePage(page);
      } else if (themeBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      } else if (avatar) {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) {
          const rect = avatar.getBoundingClientRect();
          window.dispatchEvent(new CustomEvent("global-user-menu-open", {
            detail: { top: rect.bottom + 8, right: window.innerWidth - rect.right }
          }));
        }
      } else if (authBtn) {
        e.preventDefault();
        e.stopPropagation();
        const page = authBtn.getAttribute("data-page");
        if (page) setActivePage(page);
      } else if (loginBtn) {
        e.preventDefault();
        e.stopPropagation();
        setActivePage("auth");
      }
    };

    topbar.addEventListener("click", handleClick);

    // Cleanup function
    return () => {
      topbar.removeEventListener("click", handleClick);
      topbar.remove();
      // Restore original headers
      document.querySelectorAll("header").forEach((h) => {
        (h as HTMLElement).style.display = "";
      });
      document.body.style.paddingTop = "";
    };
  }, [activePage, isAuthenticated, user, theme, setActivePage, toggleTheme]);

  return null;
}
