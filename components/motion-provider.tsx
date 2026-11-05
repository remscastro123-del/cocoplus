"use client";

import { MotionConfig } from "motion/react";

// "user" turns transform/layout animations off for visitors who ask for
// reduced motion; opacity fades still run so scroll reveals finish.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
