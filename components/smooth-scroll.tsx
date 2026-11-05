"use client";

// Lenis smooth scroll (wheel inertia), driven by GSAP's ticker so the
// ScrollTrigger pin in the process story stays in sync. Off for visitors who
// prefer reduced motion. Stopped until the preloader hands over.
// Nested scrollers that should keep native wheel scrolling carry
// data-lenis-prevent (mobile menu).
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isSiteReady, onSiteReady } from "@/lib/site-ready";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ anchors: { offset: -80 }, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (!isSiteReady()) lenis.stop();
    const off = onSiteReady(() => lenis.start());

    return () => {
      off();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
