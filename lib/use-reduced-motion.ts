"use client";

import { useSyncExternalStore } from "react";

// Reads prefers-reduced-motion without a hydration mismatch: the server
// snapshot is always false, the client snapshot follows the media query.
// Only use it for non-visibility choices (springs, layout animation);
// fades and reveals are handled by <MotionConfig reducedMotion="user">.
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useSafeReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
