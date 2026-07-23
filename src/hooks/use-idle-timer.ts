"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * useIdleTimer — Fires `onIdle` after `timeout` ms of user inactivity.
 *
 * Resets the timer on any of these events: mousedown, keydown, touchstart,
 * scroll, mousemove, wheel, click.
 *
 * If `enabled` is false, the timer is not started and the idle callback
 * will never fire.
 */
export function useIdleTimer(
  timeout: number,
  onIdle: () => void,
  enabled = true
): { resetTimer: () => void } {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);
  const enabledRef = useRef(enabled);

  // Keep refs up to date so we don't re-bind event listeners on every render
  onIdleRef.current = onIdle;
  enabledRef.current = enabled;

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (enabledRef.current) {
      timerRef.current = setTimeout(() => {
        onIdleRef.current();
      }, timeout);
    }
  }, [timeout]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start the initial timer
    resetTimer();

    // User activity events — anything that indicates the user is present
    const activityEvents = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "mousemove",
      "wheel",
      "click",
    ];

    const handleActivity = () => resetTimer();

    // Throttle mousemove/scroll so we're not resetting the timer hundreds of times
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const throttledActivity = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          resetTimer();
        }, 500);
      }
    };

    for (const event of activityEvents) {
      if (event === "mousemove" || event === "scroll") {
        window.addEventListener(event, throttledActivity, { passive: true });
      } else {
        window.addEventListener(event, handleActivity, { passive: true });
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
      for (const event of activityEvents) {
        if (event === "mousemove" || event === "scroll") {
          window.removeEventListener(event, throttledActivity);
        } else {
          window.removeEventListener(event, handleActivity);
        }
      }
    };
  }, [enabled, timeout, resetTimer]);

  return { resetTimer };
}
