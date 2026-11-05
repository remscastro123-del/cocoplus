"use client";

import { MotionConfig } from "motion/react";

// "user" turns transform/layout animations off for visitors who ask for
// reduced motion. Clip-path wipes (lib/use-wipe-in.ts) set their own
// duration to 0 for those visitors so content still appears.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
