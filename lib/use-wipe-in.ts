"use client";

import { useSafeReducedMotion } from "@/lib/use-reduced-motion";

// Scroll/entrance reveal for the whole site: content is wiped in from one
// side with a clip-path, like the CTA colour wipe. No opacity, no rise.
// The shown inset is negative so rotated tape, tilted products and the
// focus tape under links are not cut off once the reveal has finished.
const SHOWN = "inset(-30% -30% -30% -30%)";
const HIDDEN = {
  left: "inset(-30% 130% -30% -30%)",
  right: "inset(-30% -30% -30% 130%)",
} as const;

export function useWipeIn() {
  const reduce = useSafeReducedMotion();
  return (from: "left" | "right" = "left", delay = 0) => ({
    initial: { clipPath: HIDDEN[from] },
    whileInView: { clipPath: SHOWN },
    // Vertical margin only: Chrome clips the observed box by its own
    // clip-path, so a horizontal negative margin would hide left wipes forever.
    viewport: { once: true, margin: "-60px 0px -60px 0px" },
    transition: reduce ? { duration: 0 } : { duration: 0.75, ease: [0.65, 0, 0.35, 1] as const, delay },
  });
}

export const wipeHidden = HIDDEN;
export const wipeShown = SHOWN;
