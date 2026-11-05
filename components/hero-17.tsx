"use client";

// React Bits Pro hero-17, reworked for Cocoplus: centred copy, main CTA,
// certifications directly under the CTA (above the fold), then the full
// product lineup on white (the photo's own background). Everything enters
// with the tape wipe (alternating sides), no fades. Sharp corners, no rules.
import { motion } from "motion/react";
import { hero, certifications } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";
import { Tape } from "@/components/tape";
import { wipeHidden, wipeShown } from "@/lib/use-wipe-in";
import { useSafeReducedMotion } from "@/lib/use-reduced-motion";
import { useSiteReady } from "@/lib/site-ready";

export function Hero17() {
  // Entrance waits for the preloader hand-over (above the fold).
  const ready = useSiteReady();
  const reduce = useSafeReducedMotion();
  const wipe = (from: "left" | "right", delay = 0) => ({
    initial: { clipPath: wipeHidden[from] },
    animate: ready ? { clipPath: wipeShown } : undefined,
    transition: reduce ? { duration: 0 } : { duration: 0.75, ease: [0.65, 0, 0.35, 1] as const, delay },
  });

  return (
    <section className="relative w-full overflow-x-clip bg-white pt-12 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-[1400px] mx-auto w-full flex flex-col items-start sm:items-center text-left sm:text-center gap-5 sm:gap-6">
        <motion.div {...wipe("left", 0.05)}>
          {/* Informational label: one strip, no hover */}
          <Tape angle={-3} clip={3} className="inline-flex px-4 pt-2 pb-1.5 font-hand text-2xl leading-none text-accent-foreground select-none">
            {hero.eyebrow}
          </Tape>
        </motion.div>

        <motion.h1 {...wipe("right", 0.15)} className="font-heading text-6xl sm:text-7xl lg:text-9xl leading-[0.88] text-primary">
          {hero.title}
        </motion.h1>

        <motion.p {...wipe("left", 0.3)} className="text-base sm:text-lg text-foreground leading-relaxed max-w-2xl">
          {hero.body}
        </motion.p>

        <motion.div {...wipe("right", 0.4)} className="w-full sm:w-auto pt-1">
          <CtaButton href="#products" variant="primary" fullWidthOnMobile>
            View our products
          </CtaButton>
        </motion.div>

        {/* Certifications, above the fold. Plain text note, no strip or rule. */}
        <motion.div
          {...wipe("left", 0.5)}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-7 pt-4"
        >
          <ul className="flex items-center gap-4 sm:gap-5 order-2 sm:order-1" aria-label={certifications.title}>
            {certifications.logos.map((c) => (
              <li key={c.name}>
                <img src={c.src} alt={`${c.name} certified`} title={c.name} className="h-11 sm:h-12 w-auto object-contain" />
              </li>
            ))}
          </ul>
          <div className="order-1 sm:order-2 flex flex-col items-start text-left">
            <span className="font-heading text-2xl text-primary leading-none tracking-[0.02em]">{certifications.note}</span>
            <span className="text-sm text-muted-foreground mt-1">{certifications.cuNumber}</span>
          </div>
        </motion.div>
      </div>

      <motion.div {...wipe("right", 0.35)} className="relative mx-auto mt-8 sm:mt-10 w-full max-w-[1200px]">
        <img
          src="/images/hero-lineup.jpg"
          alt="The Cocoplus range: organic coconut cooking oil, virgin coconut oil, coconut sugar, coconut milk powder, skimmed coconut milk and Mix & Cream"
          className="w-full h-auto"
          width={2400}
          height={1180}
        />
      </motion.div>
    </section>
  );
}

export default Hero17;
