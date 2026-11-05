"use client";

// React Bits Pro navigation-1, reworked in the Cocoplus tape language:
// the bar is a Husk strip with a torn bottom edge (no rule), links get a Sun
// wipe on hover, dropdowns are stacks of Sky tape strips that wipe in, and
// the mobile toggle is three tape bars that fold into an X. No borders,
// shadows or transparency.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { nav } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";
import { Tape } from "@/components/tape";
import { clipAt, sideAt } from "@/lib/tape";
import { useSafeReducedMotion } from "@/lib/use-reduced-motion";
import { wipeHidden, wipeShown } from "@/lib/use-wipe-in";

type MenuKey = "products" | "company";

const menus: { key: MenuKey; label: string; items: { name: string; href: string }[] }[] = [
  { key: "products", label: "Our Products", items: nav.products },
  { key: "company", label: "Company", items: nav.company },
];

const linkType = "text-[13px] font-semibold uppercase tracking-[0.08em]";

// Dropdown / sub-menu entries: one Sky strip each, Sun wipe on hover.
function StripLinks({
  items,
  onPick,
  reduce,
  size = "text-sm",
}: {
  items: { name: string; href: string }[];
  onPick?: () => void;
  reduce: boolean;
  size?: string;
}) {
  return (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <motion.li
          key={item.name}
          initial={{ clipPath: wipeHidden[sideAt(i)] }}
          animate={{ clipPath: wipeShown }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.65, 0, 0.35, 1], delay: i * 0.04 }}
          className="-mt-0.5 first:mt-0"
        >
          <a href={item.href} onClick={onPick} className="group focus-tape block no-underline text-foreground">
            <Tape
              as="div"
              bar="bg-sky"
              wipe="bg-accent"
              clip={i}
              angle={i % 2 === 0 ? -0.8 : 0.8}
              from={sideAt(i)}
              inset="inset-x-0 inset-y-0"
              className={`px-4 py-2.5 ${size}`}
            >
              {item.name}
            </Tape>
          </a>
        </motion.li>
      ))}
    </ul>
  );
}

// Hamburger made of three tape bars; folds into an X when open.
function TapeToggle({ open }: { open: boolean }) {
  const bar = "absolute left-1.5 right-1.5 h-[5px] bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none";
  return (
    <span aria-hidden className="relative block h-11 w-11">
      <span
        style={{ clipPath: clipAt(0) }}
        className={`${bar} top-[12px] ${open ? "translate-y-[8px] rotate-45" : "-rotate-2"}`}
      />
      <span
        style={{ clipPath: clipAt(1) }}
        className={`${bar} top-[20px] origin-right ${open ? "scale-x-0" : "rotate-1"}`}
      />
      <span
        style={{ clipPath: clipAt(2) }}
        className={`${bar} top-[28px] ${open ? "-translate-y-[8px] -rotate-45" : "-rotate-1"}`}
      />
    </span>
  );
}

export default function Navigation1() {
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<MenuKey | null>(null);
  const reduce = useSafeReducedMotion();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-secondary torn-bottom px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="focus-tape relative z-50 block text-foreground" aria-label="Cocoplus home">
              <img src="/images/cocoplus-logo.png" alt="Cocoplus" data-nav-logo className="h-10 w-auto sm:h-11 [html[data-loading]_&]:invisible" />
            </Link>

            <div className="hidden items-center gap-3 lg:flex">
              {menus.map((m) => (
                <div
                  key={m.key}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(m.key)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={activeMenu === m.key}
                    onClick={() => setActiveMenu(activeMenu === m.key ? null : m.key)}
                    className={`group focus-tape flex items-center text-primary hover:text-foreground ${linkType} ${
                      activeMenu === m.key ? "text-foreground" : ""
                    }`}
                  >
                    <Tape bar="" wipe="bg-accent" active={activeMenu === m.key} className="flex items-center gap-1 px-2 py-2">
                      {m.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform motion-reduce:transition-none ${activeMenu === m.key ? "rotate-180" : ""}`}
                      />
                    </Tape>
                  </button>

                  <AnimatePresence>
                    {activeMenu === m.key && (
                      <>
                        <div className="absolute left-0 top-full h-4 w-full" />
                        <motion.div
                          initial={{ clipPath: wipeShown }}
                          animate={{ clipPath: wipeShown }}
                          exit={{ clipPath: wipeHidden.right }}
                          transition={reduce ? { duration: 0 } : { duration: 0.2, ease: "easeIn" }}
                          className="absolute left-0 top-full z-50 mt-4 w-80"
                        >
                          <StripLinks items={m.items} reduce={reduce} />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {nav.links.map((l) => (
                <a key={l.name} href={l.href} className={`group focus-tape text-primary hover:text-foreground no-underline ${linkType}`}>
                  <Tape bar="" wipe="bg-accent" from="right" clip={1} angle={1.5} className="block px-2 py-2">
                    {l.name}
                  </Tape>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <CtaButton href="/contact-us">Contact Us</CtaButton>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="focus-tape relative z-50 -mr-1.5 text-primary lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <TapeToggle open={mobileMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            exit={{ clipPath: "inset(0 100% 0 0)" }}
            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-40 bg-background lg:hidden"
          >
            <div className="relative h-[72px] bg-secondary torn-bottom" />

            <div className="mx-auto flex h-[calc(100%-72px)] max-w-[1400px] flex-col px-4 sm:px-6">
              <div data-lenis-prevent className="flex flex-1 flex-col gap-6 overflow-y-auto py-10 pb-8">
                {menus.map((m, i) => (
                  <div key={m.key}>
                    <button
                      type="button"
                      onClick={() => setMobileAccordion(mobileAccordion === m.key ? null : m.key)}
                      aria-expanded={mobileAccordion === m.key}
                      className="group focus-tape flex w-full items-center justify-between text-left font-heading text-4xl leading-none text-primary"
                    >
                      <Tape
                        bar=""
                        wipe="bg-accent"
                        active={mobileAccordion === m.key}
                        from={sideAt(i)}
                        clip={i}
                        className="px-2 pt-2 pb-1"
                      >
                        {m.label}
                      </Tape>
                      <ChevronDown
                        className={`h-6 w-6 transition-transform motion-reduce:transition-none ${mobileAccordion === m.key ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {mobileAccordion === m.key && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 pb-1 px-1">
                            <StripLinks items={m.items} reduce={reduce} size="text-base" onPick={() => setMobileMenuOpen(false)} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {nav.links.map((l, i) => (
                  <a
                    key={l.name}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group focus-tape w-fit font-heading text-4xl leading-none text-primary no-underline"
                  >
                    <Tape bar="" wipe="bg-accent" from={sideAt(i + 1)} clip={i + 2} className="block px-2 pt-2 pb-1">
                      {l.name}
                    </Tape>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
