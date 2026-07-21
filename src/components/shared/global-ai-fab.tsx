"use client";

import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

/**
 * GlobalAIFab — injects a single consistent AI Tutor floating button
 * on all pages (except auth pages).
 *
 * Mobile (< 768px): Icon only (48px circle), positioned above the bottom nav bar
 * Desktop (≥ 768px): Icon + "Ask AI Tutor" label pill, positioned at bottom-right
 *
 * Clicking opens the AI overlay (setAiOverlayOpen).
 */
export function GlobalAIFab() {
  const { activePage, setAiOverlayOpen } = useAppStore();

  useEffect(() => {
    // Don't show on auth pages
    if (activePage === "auth" || activePage === "signup") {
      const existing = document.querySelector("[data-global-ai-fab]");
      if (existing) existing.remove();
      return;
    }

    // Remove any existing FAB
    const existing = document.querySelector("[data-global-ai-fab]");
    if (existing) existing.remove();

    // Also hide any page-specific FABs to avoid duplicates
    const pageFabs = document.querySelectorAll(
      '[class*="fixed"][class*="bottom"][class*="right"][class*="ai-glow"], ' +
      '[class*="fixed"][class*="bottom"][class*="right"][class*="primary"]'
    );
    const hiddenFabs: { el: HTMLElement; display: string }[] = [];
    pageFabs.forEach((fab) => {
      const el = fab as HTMLElement;
      // Skip our own FAB and bottom nav
      if (el.hasAttribute("data-global-ai-fab")) return;
      if (el.hasAttribute("data-global-bottom-nav")) return;
      // Check if it contains "Ask" text or psychology icon
      const text = el.textContent?.trim() || "";
      const hasPsychIcon = el.querySelector('.material-symbols-outlined');
      const isAskFab = text.includes("Ask") || (hasPsychIcon && text.includes("psychology"));
      if (isAskFab) {
        hiddenFabs.push({ el, display: el.style.display });
        el.style.display = "none";
      }
    });

    // Create the global FAB
    const fab = document.createElement("button");
    fab.setAttribute("data-global-ai-fab", "true");
    fab.style.cssText = `
      position: fixed;
      z-index: 46;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary);
      color: var(--on-primary);
      box-shadow: 0 0 20px rgba(112, 0, 14, 0.15);
      transition: transform 0.2s, opacity 0.2s;
    `;
    fab.title = "Ask AI Tutor";

    // Mobile: icon only, 48px circle, above bottom nav
    // Desktop: icon + label, pill shape
    const updateFab = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        fab.style.width = "48px";
        fab.style.height = "48px";
        fab.style.borderRadius = "9999px";
        fab.style.bottom = "76px"; // 64px bottom nav + 12px gap
        fab.style.right = "16px";
        fab.innerHTML = `<span class="material-symbols-outlined" style="font-size:24px;font-variation-settings:'FILL' 1;">psychology</span>`;
      } else {
        fab.style.width = "auto";
        fab.style.height = "48px";
        fab.style.borderRadius = "9999px";
        fab.style.padding = "0 20px";
        fab.style.bottom = "24px";
        fab.style.right = "24px";
        fab.innerHTML = `
          <span class="material-symbols-outlined" style="font-size:24px;font-variation-settings:'FILL' 1;margin-right:8px;">psychology</span>
          <span style="font-weight:600;font-size:14px;white-space:nowrap;">Ask AI Tutor</span>
        `;
      }
    };

    updateFab();

    // Update on resize
    const resizeHandler = () => updateFab();
    window.addEventListener("resize", resizeHandler);

    // Click handler
    const clickHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setAiOverlayOpen(true);
    };
    fab.addEventListener("click", clickHandler);

    // Hover effect
    fab.addEventListener("mouseenter", () => {
      fab.style.transform = "scale(1.1)";
    });
    fab.addEventListener("mouseleave", () => {
      fab.style.transform = "scale(1)";
    });

    document.body.appendChild(fab);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeHandler);
      fab.removeEventListener("click", clickHandler);
      fab.remove();
      // Restore hidden page FABs
      hiddenFabs.forEach(({ el, display }) => {
        el.style.display = display;
      });
    };
  }, [activePage, setAiOverlayOpen]);

  return null;
}
