"use client";

import { useAppStore } from "@/lib/store";
import { useEffect, useRef } from "react";

/**
 * GlobalAuthVisibility — toggles visibility of authentication-dependent
 * elements in the topbar based on the user's authentication state.
 *
 * Currently handles:
 * - "My Courses" button (the pill button with school icon in the topbar)
 *   → Hidden when not signed in, shown when signed in
 *
 * Uses a MutationObserver to detect when the header re-renders (since page
 * bodies are auto-generated and re-render on navigation).
 */
export function GlobalAuthVisibility() {
  const { isAuthenticated } = useAppStore();
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const updateVisibility = () => {
      // Find the header
      const header = document.querySelector("header");
      if (!header) return;

      // Find the "My Courses" button — it contains a school icon + "My Courses" text
      // It's typically a <button> with class containing "bg-secondary-container"
      // (the pill style)
      const buttons = header.querySelectorAll("button");
      buttons.forEach((btn) => {
        const text = btn.textContent?.trim() || "";
        const hasSchoolIcon = btn.querySelector(".material-symbols-outlined")?.textContent?.trim() === "school";
        const isMyCoursesBtn = text.includes("My Courses") && hasSchoolIcon;

        if (isMyCoursesBtn) {
          if (isAuthenticated) {
            // Show the button
            btn.style.display = "";
            btn.removeAttribute("data-auth-hidden");
          } else {
            // Hide the button
            btn.style.display = "none";
            btn.setAttribute("data-auth-hidden", "true");
          }
        }
      });
    };

    // Run immediately
    updateVisibility();

    // Watch for DOM changes (page navigation re-renders the header)
    observerRef.current = new MutationObserver(() => {
      updateVisibility();
    });
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isAuthenticated]);

  return null;
}
