"use client";

// Process section: Deep Lagoon block, distinct from the green company block.
// Desktop: the left column (eyebrow, heading, intro, step index, progress)
// stays pinned while the right column scrolls through the four steps of the
// fresh wet centrifuge method, each with a figure and a small spec sheet.
// The step crossing the middle of the screen becomes active: its index
// entry and number get a Sun tape wiped in, and the progress tape fills.
// Mobile: no pinning; steps simply stack.
// Tape language only: solid colours, wipes, no lines, no transparency.
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { process } from "@/lib/content";
import { Tape } from "@/components/tape";
import { CtaButton } from "@/components/cta-button";
import { clipAt, panelClipAt, sideAt } from "@/lib/tape";
import { useWipeIn } from "@/lib/use-wipe-in";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProcessScroll() {
  const steps = process.steps;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const wipe = useWipeIn();

  // Active step = the one crossing the vertical middle of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="torn-top w-full overflow-x-clip px-4 sm:px-6 lg:px-8 bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20">
        {/* Pinned column */}
        <div className="pt-16 sm:pt-20 lg:pt-0 lg:self-start lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:flex lg:flex-col lg:justify-center">
          <motion.div {...wipe("left")} className="flex flex-col gap-4">
            <span className="font-hand text-3xl text-accent">{process.eyebrow}</span>
            <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.88] text-background">{process.title}</h2>
            <p className="text-sm sm:text-base leading-relaxed text-background max-w-md">{process.body[0]}</p>
          </motion.div>

          {/* Step index + progress: desktop only */}
          <div className="hidden lg:block mt-8">
            <div className="flex items-baseline gap-3 font-heading leading-none">
              <span className="text-5xl text-accent">{pad(active + 1)}</span>
              <span className="text-2xl text-sky">/ {pad(steps.length)}</span>
            </div>
            <div aria-hidden className="mt-4 flex gap-2 max-w-md">
              {steps.map((s, i) => (
                <span key={s.id} style={{ clipPath: clipAt(i) }} className="relative h-2.5 flex-1 overflow-hidden bg-primary">
                  <span
                    className={`absolute inset-0 bg-accent origin-left transition-transform duration-500 ease-out motion-reduce:transition-none ${
                      i <= active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </span>
              ))}
            </div>
            <ol className="mt-5 flex flex-col gap-1">
              {steps.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#step-${s.id}`}
                    aria-current={i === active ? "step" : undefined}
                    className={`group focus-tape inline-flex font-heading text-2xl tracking-[0.03em] leading-none no-underline transition-colors duration-300 ${
                      i === active ? "text-foreground" : "text-sky hover:text-foreground"
                    }`}
                  >
                    <Tape bar="" wipe="bg-accent" active={i === active} from={sideAt(i)} clip={i} angle={i % 2 ? 1 : -1} className="px-2 pt-1.5 pb-1">
                      {pad(i + 1)} · {s.title}
                    </Tape>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Scrolling column */}
        <ol className="flex flex-col gap-20 lg:gap-0 pb-20 sm:pb-24 lg:py-[18vh]">
          {steps.map((s, i) => (
            <li
              key={s.id}
              id={`step-${s.id}`}
              data-index={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="scroll-mt-24 lg:min-h-[82vh] lg:flex lg:flex-col lg:justify-center"
            >
              <motion.div {...wipe(sideAt(i))} className="grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-4">
                <Tape
                  bar="bg-primary"
                  wipe="bg-accent"
                  active={i === active}
                  from={sideAt(i)}
                  clip={i + 1}
                  angle={-2}
                  inset="inset-0"
                  className={`self-start w-fit px-3 pt-2 pb-1 font-heading text-6xl leading-none transition-colors duration-300 ${
                    i === active ? "text-foreground" : "text-background"
                  }`}
                >
                  {pad(i + 1)}
                </Tape>
                <div className="flex flex-col gap-4">
                  <h3 className="font-heading text-4xl sm:text-5xl leading-[0.9] text-background">{s.title}</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-background max-w-xl">{s.body}</p>
                  <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-1.5 text-sm sm:text-base">
                    {s.specs.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="font-heading text-lg tracking-[0.08em] uppercase leading-snug text-sky">{k}</dt>
                        <dd className="leading-snug text-background">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {"quote" in s && s.quote && (
                    <Tape bar="bg-accent" angle={-1.5} clip={3} inset="inset-0" className="mt-2 w-fit px-5 pt-3 pb-2">
                      <span className="block font-hand text-3xl sm:text-4xl leading-[1.05] text-accent-foreground">{s.quote}</span>
                    </Tape>
                  )}
                </div>
              </motion.div>

              <motion.figure {...wipe(sideAt(i + 1), 0.1)} className="relative mt-8">
                <div style={{ clipPath: panelClipAt(i) }} className="aspect-[4/3] overflow-hidden bg-background">
                  <img src={s.image} alt={s.alt} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <figcaption className="mt-3 font-heading text-lg tracking-[0.08em] uppercase text-sky">
                  Fig. {pad(i + 1)} · {s.title}
                </figcaption>
              </motion.figure>
              {i === steps.length - 1 && (
                <CtaButton href="/process" tone="dark" className="mt-10">
                  About our process
                </CtaButton>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
