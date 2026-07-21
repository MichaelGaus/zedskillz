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
export function GlobalAIFab() {
  const { activePage, setAiOverlayOpen } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <button
      key={activePage}
      onClick={() => setAiOverlayOpen(true)}
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
  );
}
