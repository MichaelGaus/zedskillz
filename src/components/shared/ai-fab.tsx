"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

interface AIFabProps {
  variant?: "solid" | "gradient" | "pulse";
  className?: string;
  tooltip?: string;
}

/**
 * Floating AI Tutor button — present on every authenticated page.
 *
 * Variants:
 * - solid: bg-primary (used on most pages, sign-in)
 * - gradient: bg-gradient-to-r from-primary to-tertiary (used on sign-up, community)
 * - pulse: solid + ping animation ring
 *
 * Clicking opens the global AI overlay (setAiOverlayOpen).
 */
export function AIFab({ variant = "solid", className, tooltip = "Need help with your studies?" }: AIFabProps) {
  const { setAiOverlayOpen } = useAppStore();
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after 5s
  useState(() => {
    if (typeof window === "undefined") return;
    setTimeout(() => setShowTooltip(false), 5000);
  });

  return (
    <div
      className={cn("fixed bottom-6 right-6 z-50 flex items-end gap-3", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Auto-dismiss tooltip */}
      {showTooltip && !hovered && (
        <div className="hidden md:block bg-primary text-white py-2 px-4 rounded-xl shadow-lg animate-bounce text-sm font-medium">
          {tooltip}
        </div>
      )}

      {/* Expandable label */}
      <button
        onClick={() => setAiOverlayOpen(true)}
        className={cn(
          "group relative flex items-center h-12 rounded-full shadow-lg overflow-hidden transition-all",
          variant === "solid" && "bg-primary text-on-primary",
          variant === "gradient" && "bg-gradient-to-r from-primary to-tertiary text-on-primary",
          variant === "pulse" && "bg-primary text-on-primary",
          hovered ? "pl-4 pr-5" : "w-12 px-0"
        )}
      >
        {/* Pulse ring */}
        {variant === "pulse" && (
          <span className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping-slow pointer-events-none" />
        )}

        <Icon name="psychology" filled size={24} className="shrink-0" />
        <span
          className={cn(
            "ml-3 text-sm font-semibold whitespace-nowrap transition-all max-w-0 group-hover:max-w-[200px] overflow-hidden"
          )}
        >
          Ask AI Tutor
        </span>

        {/* Glow */}
        <span className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </button>
    </div>
  );
}
