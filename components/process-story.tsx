"use client";

// Process scrollytelling. The section pins under the nav for four 100vh
// sections; the scrubbed scroll position drives one persistent Three.js
// scene (components/process-scene.ts) with a fixed camera. Every stream,
// intake and outlet sits on one vertical axis at the centre of the stage:
//   01 whole coconut rises in, pops open, shavings stream down the axis
//   02 the press rises in, catches the stream, twists, drips coconut milk
//   03 the open centrifuge rises in, fills, spins, the layers separate,
//      oil runs out
//   04 the bottle rises in under the oil, fills, cap and label go on
// The heading stays on the left with the step counter, progress and one
// short paragraph per step.
// Reduced motion: the static stacked version (ProcessScroll).
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "motion/react";
import { process } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";
import { useSafeReducedMotion } from "@/lib/use-reduced-motion";
import { wipeHidden, wipeShown } from "@/lib/use-wipe-in";
import ProcessScroll from "@/components/process-scroll";
import { panelClipAt } from "@/lib/tape";
import { createProcessScene, STORY_STEPS_AT, STORY_TOTAL } from "@/components/process-scene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");
type SceneApi = ReturnType<typeof createProcessScene>;

export default function ProcessStory() {
  const reduce = useSafeReducedMotion();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const api = useRef<SceneApi | null>(null);
  const [step, setStep] = useState(0);
  const steps = process.steps;

  // Build the 3D scene once (client only), tear it down on unmount.
  useEffect(() => {
    if (reduce || !stage.current) return;
    const css = getComputedStyle(document.documentElement);
    const c = (name: string) => css.getPropertyValue(name).trim();
    try {
      api.current = createProcessScene(stage.current, {
        machine: c("--sky"),
        shave: c("--background"),
        oil: "#f8e08a",
        glass: c("--sky"),
        cap: "#ffffff",
      });
    } catch {
      api.current = null; // no WebGL: the text still tells the story
    }
    return () => {
      api.current?.dispose();
      api.current = null;
    };
  }, [reduce]);

  useGSAP(
    () => {
      if (reduce) return;
      const proxy = { t: 0 };
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 72px",
            // four sequential 100vh sections, one per process step
            end: () => `+=${window.innerHeight * 4}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        .to(proxy, {
          t: STORY_TOTAL,
          duration: STORY_TOTAL,
          onUpdate: () => {
            api.current?.setT(proxy.t);
            let s = 0;
            STORY_STEPS_AT.forEach((at, i) => proxy.t >= at && (s = i));
            setStep((prev) => (prev === s ? prev : s));
            if (bar.current) bar.current.style.transform = `scaleX(${proxy.t / STORY_TOTAL})`;
          },
        });
    },
    { scope: root, dependencies: [reduce] },
  );

  if (reduce) return <ProcessScroll />;

  const s = steps[step];
  const last = step === steps.length - 1;
  // Block wrapper: ScrollTrigger disables pin spacing when the pinned
  // element's parent is a flex container (<main> is one).
  return (
    <div className="w-full">
      <section ref={root} id="process" className="torn-top relative w-full overflow-x-clip bg-foreground text-background">
        <div className="mx-auto grid h-[calc(100svh-72px)] w-full max-w-[1400px] grid-cols-1 grid-rows-[auto_1fr] gap-2 px-4 pt-6 pb-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-1 lg:items-center lg:gap-16 lg:px-8 lg:py-0">
          {/* Left: heading stays, one short paragraph per step */}
          <div className="flex flex-col gap-3 lg:gap-5">
            <span className="font-hand text-2xl text-accent lg:text-3xl">{process.eyebrow}</span>
            <h2 className="font-heading text-4xl leading-[0.88] text-background sm:text-5xl lg:text-7xl">{process.title}</h2>
            <div className="flex items-center gap-4">
              <span className="font-heading text-3xl leading-none text-accent lg:text-5xl">{pad(step + 1)}</span>
              <span className="font-heading text-lg leading-none text-sky lg:text-2xl">/ {pad(steps.length)}</span>
              <span aria-hidden className="relative h-2.5 max-w-xs flex-1 overflow-hidden bg-primary" style={{ clipPath: "var(--tape-thin)" }}>
                <span ref={bar} className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
              </span>
            </div>

            {/* Step text. Every step is laid out invisibly in the same grid
                cell, so the block is always as tall as the longest step and
                never runs into the stage below (stacked view) or jumps. */}
            <div className="grid" aria-live="polite">
              {steps.map((st, i) => (
                <div key={`size-${st.id}`} aria-hidden className="invisible col-start-1 row-start-1 flex flex-col gap-3">
                  <h3 className="font-heading text-3xl leading-[0.9] lg:text-5xl">{st.title}</h3>
                  <p className="max-w-md text-sm leading-relaxed lg:text-base">{st.body}</p>
                  {i === steps.length - 1 && <span className="mt-1 block h-14" />}
                </div>
              ))}
              <AnimatePresence initial={false}>
                <motion.div
                  key={s.id}
                  initial={{ clipPath: wipeHidden.left }}
                  animate={{ clipPath: wipeShown }}
                  exit={{ clipPath: wipeHidden.right }}
                  transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
                  className="col-start-1 row-start-1 flex flex-col gap-3"
                >
                  <h3 className="font-heading text-3xl leading-[0.9] text-background lg:text-5xl">{s.title}</h3>
                  <p className="max-w-md text-sm leading-relaxed text-background lg:text-base">{s.body}</p>
                  {last && (
                    <CtaButton href="/process" tone="dark" className="mt-1">
                      About our process
                    </CtaButton>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Stacked (below lg): the stage sits in a Lagoon Blue frame with a
              shallow torn top and bottom, so things enter and leave at its
              edges. Side by side (lg up) it runs the full section height. */}
          <div
            ref={stage}
            aria-hidden
            className="relative h-full min-h-0 w-full max-lg:bg-primary max-lg:[clip-path:var(--frame-clip)] lg:self-stretch"
            style={{ ["--frame-clip" as string]: panelClipAt(2) }}
          />
        </div>
      </section>
    </div>
  );
}
