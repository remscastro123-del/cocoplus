"use client";

// React Bits Pro features-7 (alternating rows), adapted for Cocoplus as a
// Palm Green colour block: company story with photo, then the process with
// a Sun quote panel. Sharp corners only.
import { motion } from "motion/react";
import { company, process } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function Features7() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-palm text-background">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-20 sm:gap-24">
        <motion.div {...reveal} className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="overflow-hidden aspect-[4/3] bg-background">
            <img src="/images/about-coconut.png" alt="Fresh coconut halves beside jars of virgin coconut oil" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-hand text-3xl text-accent">• EST. 2005 •</span>
            <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-background">{company.title}</h2>
            <p className="text-sm sm:text-base text-background/90 leading-relaxed max-w-xl">{company.body}</p>
            <CtaButton href="/about-us" tone="dark" className="mt-2">
              Read more
            </CtaButton>
          </div>
        </motion.div>

        <motion.div {...reveal} className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="md:order-2 bg-accent text-accent-foreground aspect-[4/3] flex flex-col justify-end p-8 sm:p-10">
            <p className="font-hand text-5xl sm:text-6xl lg:text-7xl leading-[1.02] -rotate-2">Centrifuged VCO is the premium oil!</p>
          </div>
          <div className="md:order-1 flex flex-col gap-4">
            <span className="font-hand text-3xl text-accent">{process.eyebrow}</span>
            <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-background">{process.title}</h2>
            {process.body.map((p) => (
              <p key={p} className="text-sm sm:text-base text-background/90 leading-relaxed max-w-xl">
                {p}
              </p>
            ))}
            <CtaButton href="/process" tone="dark" className="mt-2">
              About our process
            </CtaButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
