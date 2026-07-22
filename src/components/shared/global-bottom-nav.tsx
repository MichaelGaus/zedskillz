"use client";

import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

/**
 * GlobalBottomNav — injects a consistent bottom navigation bar on mobile
 * (screens < 768px) across all authenticated pages.
 *
 * The bar is fixed to the bottom of the screen with a frosted glass background.
 * Contains: Home, Explore, Ranks (center, elevated), Community.
 *
 * Admin users get: Home, Admin (center, elevated) — only 2 items.
 *
 * Does NOT show on auth pages (sign-in, sign-up).
 */
export function GlobalBottomNav() {
  const { activePage, isAuthenticated, user, setActivePage } = useAppStore();

  useEffect(() => {
    // Don't inject on auth pages
    if (activePage === "auth" || activePage === "signup") {
      const existing = document.querySelector("[data-global-bottom-nav]");
      if (existing) existing.remove();
      return;
    }

    // Remove any existing bottom nav
    const existing = document.querySelector("[data-global-bottom-nav]");
    if (existing) existing.remove();

    const isAdmin = isAuthenticated && user?.role === "admin";

    // Build nav items based on role
    const navItems = isAdmin
      ? [
          { label: "Home", icon: "home", page: "landing" },
          { label: "Admin", icon: "dashboard", page: "admin-dashboard", elevated: true },
        ]
      : [
          { label: "Home", icon: "home", page: "landing" },
          { label: "Explore", icon: "explore", page: "courses" },
          { label: "Ranks", icon: "leaderboard", page: "leaderboard", elevated: true },
          { label: "Community", icon: "groups", page: "community" },
        ];

    // Create the bottom nav
    const nav = document.createElement("nav");
    nav.setAttribute("data-global-bottom-nav", "true");
    nav.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 45;
      background: var(--surface);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid var(--outline-variant);
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 64px;
      padding-bottom: env(safe-area-inset-bottom, 0px);
    `;

    // Use a media query to only show on mobile
    const style = document.createElement("style");
    style.textContent = `
      @media (min-width: 768px) {
        [data-global-bottom-nav] { display: none !important; }
      }
      @media (max-width: 767px) {
        [data-global-bottom-nav] { display: flex !important; }
      }
    `;
    nav.appendChild(style);

    nav.innerHTML = navItems.map((item) => {
      const isActive = activePage === item.page;
      if (item.elevated) {
        return `
          <a href="#" data-nav-item data-page="${item.page}" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: ${isActive ? "var(--primary-container)" : "var(--secondary-container)"};
            color: var(--on-secondary-container);
            border-radius: 9999px;
            padding: 8px 20px;
            cursor: pointer;
            text-decoration: none;
            transition: transform 0.15s;
            transform: ${isActive ? "scale(1.05)" : "scale(1)"};
            font-weight: ${isActive ? "700" : "600"};
          " onmouseover="this.style.transform='scale(0.95)'" onmouseout="this.style.transform='${isActive ? "scale(1.05)" : "scale(1)"}'">
            <span class="material-symbols-outlined" style="font-size:22px;${isActive ? "font-variation-settings:'FILL' 1;" : ""}">${item.icon}</span>
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;">${item.label}</span>
          </a>
        `;
      }
      return `
        <a href="#" data-nav-item data-page="${item.page}" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: ${isActive ? "var(--primary)" : "var(--on-surface-variant)"};
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.15s;
          font-weight: ${isActive ? "700" : "500"};
          flex: 1;
        " onmouseover="this.style.transform='scale(0.95)'" onmouseout="this.style.transform='scale(1)'">
          <span class="material-symbols-outlined" style="font-size:22px;${isActive ? "font-variation-settings:'FILL' 1;" : ""}">${item.icon}</span>
          <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;">${item.label}</span>
        </a>
      `;
    }).join("");

    document.body.appendChild(nav);

    // Add bottom padding to page content so it isn't hidden behind the nav
    // Target [data-page-content] instead of .min-h-screen to avoid creating space below the Footer
    const pageContent = document.querySelector("[data-page-content]") as HTMLElement | null;
    if (pageContent) {
      pageContent.style.setProperty("padding-bottom", "64px", "important");
    }

    // Wire up click handler
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navItem = target.closest("[data-nav-item]");
      if (navItem) {
        e.preventDefault();
        e.stopPropagation();
        const page = navItem.getAttribute("data-page");
        if (page) setActivePage(page);
      }
    };

    nav.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      nav.removeEventListener("click", handleClick);
      nav.remove();
      if (pageContent) {
        pageContent.style.paddingBottom = "";
      }
    };
  }, [activePage, isAuthenticated, user, setActivePage]);

  return null;
}
