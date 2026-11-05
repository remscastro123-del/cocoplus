"use client";

// React Bits Pro features-7, reworked for Cocoplus as the company block:
// Palm Green, meeting the products on a torn edge. Lifestyle shot of the
// Organic VCO bottles (AI-generated from the packshot) taped on at two corners, company
// copy beside it. The process now lives in its own Deep Lagoon section
// (components/process-scroll.tsx) so the two read as different chapters.
import { motion } from "motion/react";
import { company } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";
import { useWipeIn } from "@/lib/use-wipe-in";
import { clipAt } from "@/lib/tape";

// Decorative tape piece holding a photo corner.
function CornerTape({ className }: { className: string }) {
  return <span aria-hidden style={{ clipPath: clipAt(3) }} className={`absolute z-10 h-7 w-24 sm:w-28 bg-accent ${className}`} />;
}

export default function Features7() {
  const wipe = useWipeIn();

  return (
    <section className="torn-top w-full overflow-x-clip py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-palm text-background">
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 lg:gap-16 items-center">
        <motion.div {...wipe("left")} className="relative">
          <CornerTape className="-top-3 -left-4 -rotate-[24deg]" />
          <CornerTape className="-bottom-3 -right-4 -rotate-[24deg]" />
          <div className="aspect-[4/3] overflow-hidden bg-background">
            <img
              src="/images/process/company.jpg"
              alt="Cocoplus Organic Virgin Coconut Oil, 250 mL and 1 L bottles, on a veranda table beside fresh coconuts, with a coconut grove behind"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        <motion.div {...wipe("right", 0.1)} className="flex flex-col gap-4">
          <span className="font-hand text-3xl text-accent">• EST. 2005 •</span>
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-background">{company.title}</h2>
          <p className="text-sm sm:text-base text-background leading-relaxed max-w-xl">{company.body}</p>
          <CtaButton href="/about-us" tone="dark" className="mt-2">
            Read more
          </CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
