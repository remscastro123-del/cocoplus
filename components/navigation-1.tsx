"use client";

// React Bits Pro navigation-1, adapted for Cocoplus: product dropdown,
// company dropdown, brand tokens, light mode only.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { nav } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";

type MenuKey = "products" | "company";

const menus: { key: MenuKey; label: string; items: { name: string; href: string }[] }[] = [
  { key: "products", label: "Our Products", items: nav.products },
  { key: "company", label: "Company", items: nav.company },
];

export default function Navigation1() {
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<MenuKey | null>(null);

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
    <nav className="sticky top-0 z-50 w-full bg-white px-4 sm:px-6 lg:px-8 py-3.5 border-b-[3px] border-primary">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center gap-8">
            <Link href="/" className="relative z-50 block" aria-label="Cocoplus home">
              <img src="/images/cocoplus-logo.png" alt="Cocoplus" className="h-10 w-auto sm:h-11" />
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
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
                    className="flex items-center gap-1 rounded-none px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary hover:text-foreground"
                  >
                    {m.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${activeMenu === m.key ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeMenu === m.key && (
                      <>
                        <div className="absolute left-0 top-full h-2 w-full" />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-none border border-border bg-popover shadow-lg"
                        >
                          <div className="p-2">
                            {m.items.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="block rounded-none px-4 py-2.5 text-sm text-foreground/85 hover:bg-secondary hover:text-foreground no-underline"
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {nav.links.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  className="rounded-none px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary hover:text-foreground no-underline"
                >
                  {l.name}
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
              className="relative z-50 flex h-11 w-11 items-center justify-center bg-primary text-primary-foreground lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileMenuOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            <div className="h-[75px] border-b-[3px] border-primary" />

            <div className="mx-auto flex h-[calc(100%-75px)] max-w-[1400px] flex-col px-4 sm:px-6">
              <div className="flex flex-1 flex-col gap-7 overflow-y-auto py-8 pb-0">
                {menus.map((m) => (
                  <div key={m.key}>
                    <button
                      type="button"
                      onClick={() => setMobileAccordion(mobileAccordion === m.key ? null : m.key)}
                      aria-expanded={mobileAccordion === m.key}
                      className="flex w-full items-center justify-between text-left font-heading text-4xl text-primary"
                    >
                      {m.label}
                      <ChevronDown
                        className={`h-6 w-6 transition-transform ${mobileAccordion === m.key ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileAccordion === m.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 pt-3">
                            {m.items.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-none px-3 py-2.5 text-base text-foreground/85 hover:bg-secondary no-underline"
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {nav.links.map((l) => (
                  <a
                    key={l.name}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-heading text-4xl text-primary no-underline"
                  >
                    {l.name}
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
