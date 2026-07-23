"use client";

import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { useEffect } from "react";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_MS = 14 * 60 * 1000; // 14 minutes — show a warning toast

/**
 * Activity events that reset the idle timer.
 * mousemove and scroll are throttled to avoid excessive resets.
 */
const ACTIVITY_EVENTS = [
  "mousedown",
  "keydown",
  "touchstart",
  "click",
] as const;

const THROTTLED_EVENTS = ["mousemove", "scroll"] as const;

/**
 * AutoLogoutProvider — Signs the user out after 15 minutes of inactivity.
 *
 * Renders nothing (no UI), but listens to user activity at the app root level.
 * Shows a warning toast at 14 minutes reminding the user they'll be logged out.
 * On activity after the warning, the warning state is dismissed.
 *
 * Uses a single useEffect with one set of event listeners and two timers
 * (warning + logout) that stay perfectly in sync.
 */
export function AutoLogoutProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, signOut } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    let warningTimer: ReturnType<typeof setTimeout> | null = null;
    let logoutTimer: ReturnType<typeof setTimeout> | null = null;
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    let warningShown = false;

    const clearAllTimers = () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
      if (throttleTimer) clearTimeout(throttleTimer);
      warningTimer = null;
      logoutTimer = null;
      throttleTimer = null;
    };

    const resetTimers = () => {
      clearAllTimers();

      if (warningShown) {
        // Dismiss any visible warning toast
        toast.dismiss("idle-warning");
        warningShown = false;
      }

      // Schedule the warning toast
      warningTimer = setTimeout(() => {
        warningShown = true;
        toast.warning("Session about to expire", {
          description:
            "You'll be logged out in 1 minute due to inactivity. Move your mouse or press a key to stay signed in.",
          duration: 60_000, // Show for the full minute
          id: "idle-warning", // Prevent duplicate toasts
        });
      }, WARNING_MS);

      // Schedule the logout
      logoutTimer = setTimeout(() => {
        signOut();
        toast.error("Session expired", {
          description: "You've been logged out due to inactivity.",
          duration: 5000,
        });
      }, IDLE_TIMEOUT_MS);
    };

    // Start the initial timers
    resetTimers();

    // Bind activity listeners
    const handleImmediate = () => resetTimers();
    const handleThrottled = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          resetTimers();
        }, 500);
      }
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleImmediate, { passive: true });
    }
    for (const event of THROTTLED_EVENTS) {
      window.addEventListener(event, handleThrottled, { passive: true });
    }

    return () => {
      clearAllTimers();
      toast.dismiss("idle-warning");
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handleImmediate);
      }
      for (const event of THROTTLED_EVENTS) {
        window.removeEventListener(event, handleThrottled);
      }
    };
  }, [isAuthenticated, signOut]);

  return <>{children}</>;
}
