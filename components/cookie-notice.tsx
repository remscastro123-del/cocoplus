"use client";

// Cookie statement, pinned to the bottom of the screen until the visitor
// chooses. On brand: a Deep Lagoon strip with a torn top edge that wipes up,
// a Caveat eyebrow, and the tape CTAs ("Accept all" is the one main CTA).
//
// The choice is stored per browser (localStorage "cocoplus-cookie-consent")
// and published as <html data-cookie-consent="all|essential">. The site sets
// no optional cookies yet: any analytics added later must check for "all"
// before loading.
//
// While open, the strip's height is published as --cookie-h on <html> so the
// chat launcher sits above it (a "cookie-offset" event fires on change).
import { useEffect, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CtaButton } from "@/components/cta-button";
import { useSiteReady } from "@/lib/site-ready";

const KEY = "cocoplus-cookie-consent";
type Choice = "all" | "essential";

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? (JSON.parse(raw) as { choice?: Choice }).choice : null;
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

// Tiny store over localStorage; the server snapshot is "unknown" so the
// strip never renders during SSR.
const listeners = new Set<() => void>();
let cached: Choice | null | undefined;
const snapshot = () => (cached === undefined ? (cached = readChoice()) : cached);
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export function CookieNotice() {
  const ready = useSiteReady();
  const choice = useSyncExternalStore(subscribe, snapshot, () => undefined);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (choice) document.documentElement.dataset.cookieConsent = choice;
  }, [choice]);

  const open = ready && choice === null;

  // Publish the strip height for the chat launcher; clean up on close.
  useEffect(() => {
    const el = strip.current;
    const root = document.documentElement;
    if (!open || !el) return;
    const ro = new ResizeObserver(() => {
      root.style.setProperty("--cookie-h", `${el.offsetHeight}px`);
      window.dispatchEvent(new Event("cookie-offset"));
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--cookie-h");
      window.dispatchEvent(new Event("cookie-offset"));
    };
  }, [open]);

  const decide = (c: Choice) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice: c, at: new Date().toISOString() }));
    } catch {
      // storage blocked: the choice still applies for this visit
    }
    cached = c;
    listeners.forEach((fn) => fn());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cookies"
          ref={strip}
          role="region"
          aria-label="Cookie statement"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(-12px 0 0 0)" }}
          exit={{ clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-x-0 bottom-0 z-[55]"
        >
          <div className="torn-top bg-foreground px-4 text-primary-foreground sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="flex max-w-3xl flex-col gap-1.5">
                <p className="font-hand text-2xl leading-none text-accent">A little note on cookies</p>
                <p className="text-sm leading-relaxed sm:text-base">
                  We use essential cookies to keep this site working. With your OK we may also use optional cookies to learn which pages help visitors most. You can change your mind
                  any time on our{" "}
                  <a href="/privacy-policy" className="font-medium text-sky underline underline-offset-2">
                    privacy page
                  </a>
                  .
                </p>
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-4 sm:flex sm:items-center">
                <CtaButton onClick={() => decide("essential")} tone="dark" className="w-full whitespace-nowrap !px-3 !text-lg sm:w-auto sm:!px-8 sm:!text-xl">
                  Essential only
                </CtaButton>
                <CtaButton onClick={() => decide("all")} variant="primary" tone="dark" className="w-full whitespace-nowrap !px-3 !text-lg sm:w-auto sm:!px-6 sm:!text-2xl">
                  Accept all
                </CtaButton>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
