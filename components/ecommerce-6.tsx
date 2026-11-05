"use client";

// React Bits Pro ecommerce-6, reworked for Cocoplus as a horizontal product
// slider on the off-white (cream) block, torn top edge, no rules:
// - header: heading left, intro text right (stacked on mobile);
// - filters are loose tape labels: Husk at rest, Sky wipe on hover, Sun
//   when selected;
// - each product is a square white image port. On hover/focus the pack's
//   strong colour wipes in on three bars in alternating directions with a
//   stagger (the CTA's wipe), and the pack tilts. Text stays plain;
// - native scroll with snap (touch/trackpad), plus prev/next tape buttons.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWipeIn, wipeHidden, wipeShown } from "@/lib/use-wipe-in";
import { useSafeReducedMotion } from "@/lib/use-reduced-motion";
import { Tape } from "@/components/tape";
import { angleAt, panelClipAt, sideAt } from "@/lib/tape";
import { productCategories, products, productsIntro, type ProductCategory } from "@/lib/content";

type Tab = "all" | ProductCategory;

// The CTA's three bars, sized for the square port (oversized so the small
// angles never leave gaps at the edges).
const portBars = [
  { pos: "top-0 h-[36%]", angle: "-rotate-[2deg]", delay: "delay-0" },
  { pos: "top-[32%] h-[36%]", angle: "rotate-[1.5deg]", delay: "delay-75" },
  { pos: "bottom-0 h-[36%]", angle: "-rotate-[1deg]", delay: "delay-150" },
];

function SlideButton({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "Previous products" : "Next products"}
      aria-disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={`group focus-tape text-foreground ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      <Tape
        bar={disabled ? "bg-secondary" : "bg-accent"}
        wipe={disabled ? undefined : "bg-primary"}
        from={dir === "prev" ? "right" : "left"}
        clip={dir === "prev" ? 1 : 2}
        angle={dir === "prev" ? -2 : 2}
        inset="inset-0"
        className={`flex h-12 w-14 items-center justify-center transition-colors duration-300 ${
          disabled ? "text-muted-foreground" : "text-foreground group-hover:text-primary-foreground group-focus-visible:text-primary-foreground"
        }`}
      >
        <Icon className="h-6 w-6" strokeWidth={2.5} />
      </Tape>
    </button>
  );
}

export default function Ecommerce6() {
  const [active, setActive] = useState<Tab>("all");
  const [edges, setEdges] = useState({ start: true, end: false });
  const track = useRef<HTMLUListElement>(null);
  const reduce = useSafeReducedMotion();
  const wipe = useWipeIn();

  const shown = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [active],
  );

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  // Track scroll position for the prev/next states; clean up on unmount.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollLeft = 0;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure, shown]);

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      id="products"
      className="torn-top w-full overflow-x-clip scroll-mt-20 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background text-foreground"
    >
      <div className="relative max-w-[1400px] mx-auto w-full">
        {/* Header: heading left, text right */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-5 md:gap-16 md:items-end">
          <motion.h2 {...wipe("left")} className="font-heading text-5xl sm:text-6xl lg:text-8xl leading-[0.88] text-primary">
            Our Products
          </motion.h2>
          <motion.div {...wipe("right", 0.1)} className="flex flex-col gap-3 max-w-2xl">
            {productsIntro.map((p) => (
              <p key={p} className="text-sm sm:text-base leading-relaxed text-foreground">
                {p}
              </p>
            ))}
          </motion.div>
        </div>

        {/* Filters (left) and slider controls (right) */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-4 px-4 overflow-x-auto sm:mx-0 sm:px-0 sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div role="tablist" aria-label="Filter products" className="flex w-max sm:w-auto sm:flex-wrap gap-3 py-3">
              {productCategories.map((t, i) => {
                const selected = active === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(t.id)}
                    className="group focus-tape whitespace-nowrap text-foreground cursor-pointer"
                  >
                    <Tape
                      bar="bg-secondary"
                      wipe={selected ? "bg-accent" : "bg-sky"}
                      active={selected}
                      from={sideAt(i)}
                      clip={i}
                      angle={angleAt(i) * 0.75}
                      inset="inset-0"
                      className="block px-5 pt-2.5 pb-2 font-heading text-lg tracking-[0.06em] uppercase leading-none text-foreground"
                    >
                      {t.label}
                    </Tape>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <SlideButton dir="prev" disabled={edges.start} onClick={() => slide(-1)} />
            <SlideButton dir="next" disabled={edges.end} onClick={() => slide(1)} />
          </div>
        </div>

        <ul
          key={active}
          ref={track}
          aria-label="Products"
          className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-pl-4 sm:scroll-pl-0 flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shown.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={{ clipPath: wipeHidden[sideAt(i)] }}
              animate={{ clipPath: wipeShown }}
              transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.65, 0, 0.35, 1], delay: Math.min(i, 4) * 0.05 }}
              className="snap-start shrink-0 w-[78%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <a
                href={`/products/${p.slug}`}
                style={{ ["--acc-strong" as string]: p.accentStrong }}
                className="group focus-tape flex h-full flex-col gap-4 text-foreground no-underline"
              >
                {/* Square white image port; pack colour wipes in on 3 bars */}
                <div className="relative aspect-square">
                  <span aria-hidden style={{ clipPath: panelClipAt(i) }} className="absolute inset-0 overflow-hidden bg-white">
                    {portBars.map((b, bi) => (
                      <span
                        key={bi}
                        className={`absolute -left-[4%] -right-[4%] ${b.pos} ${b.angle} ${b.delay} bg-[var(--acc-strong)] ${
                          sideAt(bi) === "left" ? "origin-left" : "origin-right"
                        } scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none`}
                      />
                    ))}
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-contain p-6 sm:p-9 transition-transform duration-500 ease-out motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-[1.08] motion-safe:group-focus-visible:-rotate-6 motion-safe:group-focus-visible:scale-[1.08]"
                  />
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl leading-[0.95] tracking-[0.02em] text-foreground">{p.name}</h3>
                <p className="max-sm:hidden text-sm leading-relaxed text-muted-foreground line-clamp-3">{p.summary}</p>
                <span className="mt-auto font-heading text-lg tracking-[0.06em] uppercase leading-none text-primary">View Product</span>
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Mobile: controls under the slider */}
        <div className="mt-6 flex sm:hidden items-center gap-3">
          <SlideButton dir="prev" disabled={edges.start} onClick={() => slide(-1)} />
          <SlideButton dir="next" disabled={edges.end} onClick={() => slide(1)} />
        </div>
      </div>
    </section>
  );
}
