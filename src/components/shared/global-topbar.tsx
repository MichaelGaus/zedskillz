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
    // Admin users only see Home + Admin; non-admin users see all links EXCEPT Admin
    const isAdmin = isAuthenticated && user?.role === "admin";
    const navLinks = isAdmin
      ? [
          { label: "Home", page: "landing" },
          { label: "Admin", page: "admin-dashboard" },
        ]
      : [
          { label: "Home", page: "landing" },
          { label: "Explore", page: "courses" },
          { label: "Ranks", page: "leaderboard" },
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
      <style>
        @media (min-width: 768px) {
          [data-menu-toggle] { display: none !important; }
          [data-desktop-nav] { display: flex !important; }
          [data-mobile-only] { display: none !important; }
        }
        @media (max-width: 767px) {
          [data-desktop-only] { display: none !important; }
        }
      </style>
      <div style="display:flex;align-items:center;gap:12px;">
        <!-- Hamburger menu (mobile only) -->
        <button data-menu-toggle style="display:flex;width:40px;height:40px;border-radius:8px;border:none;background:transparent;cursor:pointer;align-items:center;justify-content:center;color:var(--on-surface);flex-shrink:0;" title="Menu">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div data-nav-link data-page="landing" style="display:flex;align-items:center;gap:8px;cursor:pointer;flex-shrink:0;">
          <div style="width:36px;height:36px;border-radius:8px;background:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span class="material-symbols-outlined" style="color:var(--on-primary);font-variation-settings:'FILL' 1;font-size:22px;">school</span>
          </div>
          <span data-desktop-only style="font-weight:700;font-size:18px;color:var(--primary);white-space:nowrap;">Zedskillz Hub</span>
        </div>
        <!-- Desktop nav links -->
        <div data-desktop-nav style="display:none;align-items:center;gap:24px;margin-left:16px;">
          ${navLinks.map(({ label, page }) => {
            const isActive = activePage === page;
            return `<a href="#" data-nav-link data-page="${page}" style="font-size:14px;font-weight:${isActive ? "700" : "500"};color:${isActive ? "var(--primary)" : "var(--on-surface-variant)"};text-decoration:none;white-space:nowrap;">${label}</a>`;
          }).join("")}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:4px;">
        <button data-theme-toggle style="width:40px;height:40px;border-radius:9999px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--on-surface-variant);flex-shrink:0;" title="${theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}">
          <span class="material-symbols-outlined">${theme === "dark" ? "light_mode" : "dark_mode"}</span>
        </button>
        <button data-desktop-only style="width:40px;height:40px;border-radius:9999px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--on-surface-variant);flex-shrink:0;" title="Language">
          <span class="material-symbols-outlined">language</span>
        </button>
        <button data-auth-button data-page="${isAuthenticated ? "my-courses" : "auth"}" style="display:${isAuthenticated && !isAdmin ? "flex" : "none"};align-items:center;gap:6px;padding:8px 12px;background:var(--secondary-container);color:var(--on-secondary-container);border-radius:9999px;border:none;cursor:pointer;font-weight:600;font-size:13px;flex-shrink:0;white-space:nowrap;">
          <span class="material-symbols-outlined" style="font-size:18px;">school</span>
          <span data-desktop-only>My Courses</span>
        </button>
        ${isAuthenticated && user
          ? `<div data-avatar-container style="width:40px;height:40px;border-radius:9999px;overflow:hidden;border:2px solid var(--outline-variant);cursor:pointer;display:flex;align-items:center;justify-content:center;background:var(--primary-container);flex-shrink:0;">
              <img src="${user.avatar}" alt="${user.name}" style="width:100%;height:100%;object-fit:cover;" />
            </div>`
          : `<button data-login-button style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:var(--primary);color:var(--on-primary);border-radius:9999px;border:none;cursor:pointer;font-weight:600;font-size:13px;flex-shrink:0;white-space:nowrap;">
              <span class="material-symbols-outlined" style="font-size:18px;">login</span>
              <span>Login</span>
            </button>`}
      </div>
    `;

    document.body.insertBefore(topbar, document.body.firstChild);

    // Create mobile menu drawer (hidden by default)
    const mobileDrawer = document.createElement("div");
    mobileDrawer.setAttribute("data-mobile-drawer", "true");
    mobileDrawer.style.cssText = "position:fixed;top:64px;left:0;right:0;bottom:0;z-index:39;background:rgba(0,0,0,0.3);display:none;backdrop-filter:blur(4px);";
    mobileDrawer.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:280px;max-width:80vw;height:100%;background:var(--surface-container-lowest);border-right:1px solid var(--outline-variant);padding:16px;overflow-y:auto;box-shadow:4px 0 20px rgba(0,0,0,0.1);transform:translateX(-100%);transition:transform 0.3s ease;" data-drawer-content>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--outline-variant);">
          <span style="font-weight:700;font-size:18px;color:var(--primary);">Navigation</span>
          <button data-close-drawer style="width:36px;height:36px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--on-surface-variant);">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${navLinks.map(({ label, page }) => {
            const isActive = activePage === page;
            return `<a href="#" data-nav-link data-page="${page}" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:8px;font-size:15px;font-weight:${isActive ? "600" : "500"};color:${isActive ? "var(--primary)" : "var(--on-surface)"};background:${isActive ? "var(--secondary-container)" : "transparent"};text-decoration:none;transition:background 0.2s;">
              <span class="material-symbols-outlined" style="font-size:22px;">${page === "landing" ? "home" : page === "courses" ? "explore" : page === "leaderboard" ? "leaderboard" : page === "admin-dashboard" ? "dashboard" : "groups"}</span>
              ${label}
            </a>`;
          }).join("")}
          ${isAuthenticated && !isAdmin ? `<a href="#" data-nav-link data-page="my-courses" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:8px;font-size:15px;font-weight:500;color:var(--on-surface);text-decoration:none;transition:background 0.2s;">
            <span class="material-symbols-outlined" style="font-size:22px;">school</span>
            My Courses
          </a>` : ""}
          ${isAuthenticated ? `<a href="#" data-nav-link data-page="profile" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:8px;font-size:15px;font-weight:500;color:var(--on-surface);text-decoration:none;transition:background 0.2s;">
            <span class="material-symbols-outlined" style="font-size:22px;">person</span>
            My Profile
          </a>
          <a href="#" data-nav-link data-page="settings" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:8px;font-size:15px;font-weight:500;color:var(--on-surface);text-decoration:none;transition:background 0.2s;">
            <span class="material-symbols-outlined" style="font-size:22px;">settings</span>
            Settings
          </a>` : ""}
        </div>
      </div>
    `;
    document.body.appendChild(mobileDrawer);

    // Instead of body padding (which breaks min-h-screen / h-screen layouts),
    // we push the page content down by inserting a spacer div and adjusting
    // sticky sidebars to start below the topbar.
    
    // Fix sticky elements that should start below the topbar
    const stickyElements = document.querySelectorAll('[class*="sticky"][class*="top-0"], [style*="sticky"][style*="top: 0"]');
    stickyElements.forEach((el) => {
      if (el === topbar) return;
      const htmlEl = el as HTMLElement;
      const computed = window.getComputedStyle(htmlEl);
      if (computed.position === "sticky" && (computed.top === "0px" || htmlEl.style.top === "0" || htmlEl.style.top === "")) {
        htmlEl.style.top = "64px";
      }
    });

    // Fix h-screen elements (sidebars) to account for the topbar height
    const hScreenElements = document.querySelectorAll('[class*="h-screen"]');
    hScreenElements.forEach((el) => {
      (el as HTMLElement).style.height = "calc(100vh - 64px)";
    });

    // Add margin-top to the main page wrapper (the div with min-h-screen)
    // instead of body padding, to avoid breaking min-h-screen calculations
    const pageWrapper = document.querySelector(".min-h-screen") as HTMLElement | null;
    if (pageWrapper) {
      pageWrapper.style.marginTop = "64px";
    } else {
      // Fallback: add padding to body
      document.body.style.paddingTop = "64px";
    }

    topbarRef.current = topbar;

    // Wire up click handlers (using event delegation on the topbar + drawer)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navLink = target.closest("[data-nav-link]");
      const themeBtn = target.closest("[data-theme-toggle]");
      const avatar = target.closest("[data-avatar-container]");
      const authBtn = target.closest("[data-auth-button]");
      const loginBtn = target.closest("[data-login-button]");
      const menuToggle = target.closest("[data-menu-toggle]");
      const closeDrawer = target.closest("[data-close-drawer]");

      if (menuToggle) {
        e.preventDefault();
        e.stopPropagation();
        // Open mobile drawer
        mobileDrawer.style.display = "block";
        setTimeout(() => {
          const content = mobileDrawer.querySelector("[data-drawer-content]") as HTMLElement;
          if (content) content.style.transform = "translateX(0)";
        }, 10);
      } else if (closeDrawer) {
        e.preventDefault();
        e.stopPropagation();
        closeMobileDrawer();
      } else if (navLink) {
        e.preventDefault();
        e.stopPropagation();
        const page = navLink.getAttribute("data-page");
        if (page) setActivePage(page);
        closeMobileDrawer();
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

    const closeMobileDrawer = () => {
      const content = mobileDrawer.querySelector("[data-drawer-content]") as HTMLElement;
      if (content) content.style.transform = "translateX(-100%)";
      setTimeout(() => { mobileDrawer.style.display = "none"; }, 300);
    };

    // Close drawer when clicking outside the content
    mobileDrawer.addEventListener("click", (e) => {
      if (e.target === mobileDrawer) closeMobileDrawer();
    });

    topbar.addEventListener("click", handleClick);
    mobileDrawer.addEventListener("click", handleClick);

    // Cleanup function
    return () => {
      topbar.removeEventListener("click", handleClick);
      mobileDrawer.removeEventListener("click", handleClick);
      topbar.remove();
      mobileDrawer.remove();
      // Restore original headers
      document.querySelectorAll("header").forEach((h) => {
        (h as HTMLElement).style.display = "";
      });
      // Restore page wrapper margin
      const pageWrapper = document.querySelector(".min-h-screen") as HTMLElement | null;
      if (pageWrapper) pageWrapper.style.marginTop = "";
      document.body.style.paddingTop = "";
      // Restore sticky elements
      document.querySelectorAll('[style*="top: 64px"]').forEach((el) => {
        (el as HTMLElement).style.top = "";
      });
      // Restore h-screen elements
      document.querySelectorAll('[style*="calc(100vh - 64px)"]').forEach((el) => {
        (el as HTMLElement).style.height = "";
      });
    };
  }, [activePage, isAuthenticated, user, theme, setActivePage, toggleTheme]);

  return null;
}
