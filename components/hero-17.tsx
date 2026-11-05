"use client";

// React Bits Pro hero-17, reworked for Cocoplus: centred copy, main CTA,
// certifications directly under the CTA (above the fold), then the full
// product lineup on white (the photo's own background). Sharp corners only.
import { motion } from "motion/react";
import { hero, certifications } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";

export function Hero17() {
  // Reduced motion is handled by <MotionConfig reducedMotion="user">.
  const enter = (y: number, delay: number) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay },
  });

  return (
    <section className="relative w-full overflow-hidden bg-white pt-10 sm:pt-14 lg:pt-16 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-[1400px] mx-auto w-full flex flex-col items-start sm:items-center text-left sm:text-center gap-5 sm:gap-6">
        <motion.div {...enter(-8, 0.1)}>
          {/* Sticker: informational only, not clickable */}
          <span className="inline-flex -rotate-3 items-center px-4 pt-2 pb-1.5 bg-accent text-accent-foreground font-hand text-2xl leading-none select-none">
            {hero.eyebrow}
          </span>
        </motion.div>

        <motion.h1 {...enter(18, 0.2)} className="font-heading text-6xl sm:text-7xl lg:text-9xl leading-[0.88] text-primary">
          {hero.title}
        </motion.h1>

        <motion.p {...enter(12, 0.35)} className="text-base sm:text-lg text-foreground/85 leading-relaxed max-w-2xl">
          {hero.body}
        </motion.p>

        <motion.div {...enter(12, 0.45)} className="w-full sm:w-auto pt-1">
          <CtaButton href="#products" variant="primary" fullWidthOnMobile>
            View our products
          </CtaButton>
        </motion.div>

        {/* Certifications, above the fold */}
        <motion.div
          {...enter(10, 0.55)}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 pt-3"
        >
          <ul className="flex items-center gap-4 sm:gap-5 order-2 sm:order-1" aria-label={certifications.title}>
            {certifications.logos.map((c) => (
              <li key={c.name}>
                <img src={c.src} alt={`${c.name} certified`} title={c.name} className="h-11 sm:h-12 w-auto object-contain" />
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-start text-left order-1 sm:order-2 sm:border-l-[3px] sm:border-primary sm:pl-6">
            <span className="font-heading text-2xl text-primary leading-none tracking-[0.02em]">{certifications.note}</span>
            <span className="text-sm text-foreground/80 mt-1">{certifications.cuNumber}</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="relative mx-auto mt-6 sm:mt-8 w-full max-w-[1200px]"
      >
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
