"use client";

// React Bits Pro ecommerce-6 (shop-all grid with category tabs), adapted for
// Cocoplus: inverted Lagoon section, cut-out products on cream cards that
// take each pack's colour on hover (product tilts), Sun filter pill,
// sharp corners only.
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-reduced-motion";
import { productCategories, products, productsIntro, type ProductCategory } from "@/lib/content";

type Tab = "all" | ProductCategory;

export default function Ecommerce6() {
  const [active, setActive] = useState<Tab>("all");
  const reduce = useSafeReducedMotion();

  const shown = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [active],
  );

  return (
    <section
      id="products"
      className="relative w-full overflow-hidden scroll-mt-20 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground"
    >
      <div className="relative max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-start sm:items-center text-left sm:text-center gap-4 max-w-2xl sm:mx-auto"
        >
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-primary-foreground">Our Products</h2>
          {productsIntro.map((p) => (
            <p key={p} className="text-sm sm:text-base leading-relaxed text-primary-foreground/85">
              {p}
            </p>
          ))}
        </motion.div>

        {/* Category filter: scrolls sideways in one row on small screens */}
        <div className="mt-8 -mx-4 px-4 overflow-x-auto sm:mx-0 sm:px-0 sm:flex sm:justify-center">
          <div role="tablist" aria-label="Filter products" className="inline-flex items-center border-[3px] border-primary-foreground">
            {productCategories.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active === t.id}
                onClick={() => setActive(t.id)}
                className={`relative whitespace-nowrap px-5 pt-2.5 pb-2 font-heading text-lg tracking-[0.06em] uppercase leading-none transition-colors cursor-pointer ${
                  active === t.id ? "text-accent-foreground" : "text-primary-foreground hover:text-accent"
                }`}
              >
                {active === t.id && (
                  <motion.span
                    layoutId="ec6-pill"
                    className="absolute inset-0 bg-accent"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout={!reduce} className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.article
                key={p.slug}
                layout={!reduce}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  layout: { type: "spring", stiffness: 260, damping: 30 },
                  duration: 0.35,
                  delay: Math.min(i, 5) * 0.04,
                }}
                className="flex flex-col"
              >
                {/* Card: cream at rest; on hover/focus it takes the pack's colour
                    and the product tilts on a stronger pack-colour panel. */}
                <a
                  href={`/products/${p.slug}`}
                  style={{ ["--acc" as string]: p.accent, ["--acc-strong" as string]: p.accentStrong }}
                  className="group flex flex-1 flex-col bg-background text-foreground no-underline transition-colors duration-300 hover:bg-[var(--acc)] focus-visible:bg-[var(--acc)] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary transition-colors duration-300 group-hover:bg-[var(--acc-strong)] group-focus-visible:bg-[var(--acc-strong)]">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 h-full w-full object-contain p-6 sm:p-8 transition-transform duration-500 ease-out motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-[1.08] motion-safe:group-focus-visible:-rotate-6 motion-safe:group-focus-visible:scale-[1.08]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                    <h3 className="font-heading text-xl sm:text-2xl leading-[0.95] tracking-[0.02em] text-foreground">{p.name}</h3>
                    <p className="max-sm:hidden text-sm leading-relaxed text-muted-foreground line-clamp-3">{p.summary}</p>
                    <span className="mt-auto pt-1 font-heading text-lg tracking-[0.06em] uppercase text-primary underline-offset-4 group-hover:underline">
                      View Product
                    </span>
                  </div>
                </a>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
