"use client";

import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * GlobalAIFab — a consistent AI Tutor floating button rendered as a proper
 * React component using Tailwind classes.
 *
 * Mobile (< 768px): Icon only (48px circle), positioned above the bottom nav bar
 * Desktop (≥ 768px): Icon + "Ask AI Tutor" label pill, positioned at bottom-right
 *
 * Clicking opens the AI overlay (setAiOverlayOpen).
 */
const TOOLTIP_STORAGE_KEY = "zedskillz_ai_fab_tooltip_seen";
const TOOLTIP_DELAY_MS = 5000;

/**
 * First-visit tooltip that auto-dismisses, persisted in localStorage.
 */
function useFirstVisitTooltip() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on desktop — mobile has icon-only FAB
    if (window.innerWidth < 768) return;

    const seen = localStorage.getItem(TOOLTIP_STORAGE_KEY);
    if (seen === "true") return;

    // Show tooltip after a brief pause so the FAB entrance animation plays first
    const showTimer = setTimeout(() => setShow(true), 1200);

    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      setShow(false);
      localStorage.setItem(TOOLTIP_STORAGE_KEY, "true");
    }, TOOLTIP_DELAY_MS);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(TOOLTIP_STORAGE_KEY, "true");
  };

  return { show, dismiss };
}

export function GlobalAIFab() {
  const { activePage, setAiOverlayOpen } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);
  const { show: showTooltip, dismiss: dismissTooltip } = useFirstVisitTooltip();

  // Responsive detection using CSS media query (avoids resize thrashing)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auth pages (signin/signup) don't render the bottom nav, so position closer to edge
  const hasBottomNav = activePage !== "auth" && activePage !== "signup";

  const handleFabClick = () => {
    dismissTooltip();
    setAiOverlayOpen(true);
  };

  return (
    <>
      {/* First-visit tooltip — desktop only, positioned to the left of the FAB */}
      {showTooltip && !isMobile && (
        <div
          className={cn(
            "fixed z-50 flex items-center gap-2",
            "animate-in fade-in slide-in-from-right-2 duration-300 ease-out",
            hasBottomNav ? "bottom-[88px]" : "bottom-[72px]",
            "right-6"
          )}
        >
          <div className="relative bg-primary text-on-primary text-xs font-medium px-3 py-2 rounded-xl shadow-lg whitespace-nowrap">
            <span>{activePage === "auth" || activePage === "signup" ? "Need help signing in? Ask the AI Tutor!" : "Ask me anything about your courses!"}</span>
            {/* Arrow pointing down toward the FAB */}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-primary" />
          </div>
          <button
            onClick={dismissTooltip}
            className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            aria-label="Dismiss tooltip"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <button
        key={activePage}
        onClick={handleFabClick}
        className={cn(
          "fixed z-50 flex items-center justify-center gap-2 rounded-full bg-primary text-on-primary shadow-[0_0_20px_rgba(112,0,14,0.15)] transition-transform duration-200 hover:scale-110 active:scale-95",
          "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out",
          isMobile ? "right-4 h-12 w-12" : "bottom-6 right-6 h-12 px-5",
          isMobile && (hasBottomNav ? "bottom-20" : "bottom-4")
        )}
        title="Ask AI Tutor"
        aria-label="Ask AI Tutor"
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          psychology
        </span>
        {!isMobile && (
          <span className="text-sm font-semibold whitespace-nowrap">
            Ask AI Tutor
          </span>
        )}
      </button>
    </>
  );
}
