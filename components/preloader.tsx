"use client";

// Preloader: the whole screen is the load state. Coconut silhouettes in the
// navbar colour (Husk) drop in from above under normal gravity (accelerating,
// a small bounce on landing) and stack from the bottom row up as the page's
// images and fonts load; at 100% the screen is full of coconuts.
// Then the Cocoplus logo in the centre travels to its place in the navbar
// while the coconut field folds up into the navbar strip. No numbers.
// Reduced motion: no falling or travel; the cover simply clears when loaded.
// <html data-loading> (set in layout) hides the navbar logo and locks
// scroll until the hand-over; a <noscript> style removes the cover.
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markSiteReady } from "@/lib/site-ready";

const MIN_MS = 1600; // long enough to read as a moment
const MAX_MS = 6000; // never hold the page hostage
const G = 2600; // px/s², "normal" gravity at screen scale

// Coconut silhouette: rounded husk with a slight point. Solid, no eyes.
const COCONUT = "M50 4 C64 4 80 17 86 35 C94 60 84 92 50 96 C16 92 6 60 14 35 C20 17 36 4 50 4 Z";

type Nut = { x: number; y: number; r: number; size: number };

function layout(w: number, h: number): Nut[] {
  const cell = w < 640 ? 56 : 72;
  const size = Math.round(cell * 1.55);
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 1;
  const nuts: Nut[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nuts.push({
        x: c * cell + (r % 2 ? cell / 2 : 0) + (Math.random() - 0.5) * cell * 0.3,
        y: r * cell + (Math.random() - 0.5) * cell * 0.3,
        r: Math.round((Math.random() - 0.5) * 70),
        size,
      });
    }
  }
  // Fill order: bottom rows first (they land on the floor, the next rows
  // land on them), random within a row, with a little overlap between rows.
  return nuts
    .map((n) => ({ n, k: -n.y + Math.random() * cell * 1.2 }))
    .sort((a, b) => a.k - b.k)
    .map(({ n }) => n);
}

export function Preloader() {
  const [nuts, setNuts] = useState<Nut[]>([]);
  const [done, setDone] = useState(false);
  const cover = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const field = useRef<HTMLDivElement>(null);

  // Layout needs the real viewport, so it is built on the first frame.
  useEffect(() => {
    const id = requestAnimationFrame(() => setNuts(layout(window.innerWidth, window.innerHeight)));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!nuts.length || !cover.current || !field.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Dev-only review aid: ?slowload plays the preloader at quarter speed.
    const slow = process.env.NODE_ENV !== "production" && new URLSearchParams(location.search).has("slowload") ? 4 : 1;
    if (slow > 1) gsap.globalTimeline.timeScale(1 / slow);
    const els = Array.from(field.current.children) as HTMLElement[];
    const start = performance.now();
    let shown = 0;
    let landAt = 0;
    let finished = false;

    // Real progress: images in the document + fonts + window load.
    // Lazy images never load under the cover, so they don't count.
    const imgs = Array.from(document.images).filter((i) => i.loading !== "lazy");
    let loaded = imgs.filter((i) => i.complete).length;
    let fontsDone = false;
    let pageDone = document.readyState === "complete";
    const onImg = () => (loaded += 1);
    imgs.filter((i) => !i.complete).forEach((i) => {
      i.addEventListener("load", onImg, { once: true });
      i.addEventListener("error", onImg, { once: true });
    });
    document.fonts?.ready.then(() => (fontsDone = true));
    const onLoad = () => (pageDone = true);
    window.addEventListener("load", onLoad, { once: true });

    const real = () => {
      const parts = imgs.length ? loaded / imgs.length : 1;
      return Math.min(1, parts * 0.8 + (fontsDone ? 0.1 : 0) + (pageDone ? 0.1 : 0));
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      gsap.ticker.remove(tick);
      // Screen is full: the ground turns Husk so the gaps between nuts close.
      cover.current!.style.background = "var(--secondary)";
      const handOver = () => {
        gsap.globalTimeline.timeScale(1);
        document.documentElement.removeAttribute("data-loading");
        markSiteReady();
        setDone(true);
        // The scrollbar is back now: re-measure pins (process story).
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const target = document.querySelector<HTMLImageElement>("[data-nav-logo]");
      const nav = document.querySelector("nav");
      if (reduce || !target || !logo.current || !nav) return handOver();

      const from = logo.current.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const navH = nav.getBoundingClientRect().height;
      // The hero starts its entrance as the cover lifts, so the page is
      // revealed underneath rather than after.
      const tl = gsap.timeline({ delay: 0.15, onStart: markSiteReady, onComplete: handOver });
      tl.to(logo.current, {
        x: to.left - from.left,
        y: to.top - from.top,
        scale: to.height / from.height,
        transformOrigin: "0 0",
        duration: 0.9,
        ease: "power3.inOut",
      }).to(cover.current, { clipPath: `inset(0px 0px calc(100% - ${navH}px) 0px)`, duration: 0.9, ease: "power3.inOut" }, 0);
    };

    function tick() {
      const t = performance.now() - start;
      const timeCap = Math.min(1, t / (MIN_MS * slow));
      const p = t > MAX_MS * slow ? 1 : Math.min(real(), timeCap);
      const want = Math.floor(p * els.length);
      while (shown < want) {
        const i = shown++;
        const el = els[i];
        const n = nuts[i];
        if (reduce) {
          gsap.set(el, { y: 0, rotation: n.r });
          continue;
        }
        // Free fall from just above the screen: t = sqrt(2d / g).
        const drop = n.y + n.size + Math.random() * 120;
        const fall = Math.sqrt((2 * drop) / G);
        landAt = Math.max(landAt, performance.now() + (fall + 0.25) * 1000 * slow);
        gsap
          .timeline()
          .fromTo(el, { y: -drop, rotation: n.r - 120 + Math.random() * 60 }, { y: 0, rotation: n.r, duration: fall, ease: "power2.in" })
          .to(el, { y: -Math.min(14, drop * 0.02), duration: 0.1, ease: "power1.out" })
          .to(el, { y: 0, duration: 0.12, ease: "power1.in" });
      }
      if (shown >= els.length && performance.now() >= landAt) finish();
    }
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      imgs.forEach((i) => {
        i.removeEventListener("load", onImg);
        i.removeEventListener("error", onImg);
      });
    };
  }, [nuts]);

  if (done) return null;

  return (
    <div ref={cover} data-preloader className="fixed inset-0 z-[100] overflow-hidden bg-white" aria-hidden>
      <div ref={field} className="absolute inset-0">
        {nuts.map((n, i) => (
          <svg
            key={i}
            viewBox="0 0 100 100"
            width={n.size}
            height={n.size}
            className="absolute fill-secondary"
            style={{ left: n.x - n.size / 2, top: n.y - n.size / 2, transform: "translateY(-150vh)" }}
          >
            <path d={COCONUT} />
          </svg>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img ref={logo} src="/images/cocoplus-logo.png" alt="" className="relative h-16 w-auto sm:h-24" />
      </div>
    </div>
  );
}
