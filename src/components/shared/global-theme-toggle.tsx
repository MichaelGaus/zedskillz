"use client";

import { useAppStore } from "@/lib/store";
import { useEffect, useRef } from "react";

/**
 * GlobalThemeToggle — injects a dark/light theme toggle button into the
 * topbar header of every page.
 *
 * Uses a MutationObserver to detect when the header renders (since page
 * bodies are auto-generated and re-render on navigation), then inserts
 * a theme toggle button next to the language icon.
 *
 * The button shows:
 * - dark_mode icon when in light mode (click to switch to dark)
 * - light_mode icon when in dark mode (click to switch to light)
 */
export function GlobalThemeToggle() {
  const { theme, toggleTheme } = useAppStore();
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const injectToggle = () => {
      // Find the header on the page
      const header = document.querySelector("header");
      if (!header) return;

      // Check if we already injected a theme toggle
      if (header.querySelector('[data-theme-toggle="true"]')) return;

      // Find the language button (it contains a material-symbols-outlined span with "language")
      const languageBtn = Array.from(header.querySelectorAll("button")).find((btn) => {
        const icon = btn.querySelector(".material-symbols-outlined");
        return icon && icon.textContent?.trim() === "language";
      });

      if (!languageBtn) return;

      // Create the theme toggle button
      const themeBtn = document.createElement("button");
      themeBtn.setAttribute("data-theme-toggle", "true");
      themeBtn.className = "w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors";
      themeBtn.title = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
      themeBtn.innerHTML = `<span class="material-symbols-outlined">${theme === "dark" ? "light_mode" : "dark_mode"}</span>`;

      themeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      });

      // Insert before the language button
      languageBtn.parentNode?.insertBefore(themeBtn, languageBtn);
    };

    // Inject immediately
    injectToggle();

    // Watch for DOM changes (page navigation re-renders the header)
    observerRef.current = new MutationObserver(() => {
      injectToggle();
    });
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [theme, toggleTheme]);

  // Update icon when theme changes
  useEffect(() => {
    const btn = document.querySelector('[data-theme-toggle="true"]');
    if (btn) {
      const icon = btn.querySelector(".material-symbols-outlined");
      if (icon) {
        icon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
      }
      btn.setAttribute("title", theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode");
    }
  }, [theme]);

  return null;
}
