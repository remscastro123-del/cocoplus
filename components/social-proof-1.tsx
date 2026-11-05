"use client";

// React Bits Pro social-proof-1, reworked for Cocoplus affiliations: a Sky
// block meeting the story on a torn edge; each logo sits on its own white
// tape strip at a small alternating angle. No rules, no cells, no hover
// (these are not links). Logos keep their own colours.
import { motion } from "motion/react";
import { affiliations } from "@/lib/content";
import { useWipeIn } from "@/lib/use-wipe-in";
import { Tape } from "@/components/tape";
import { angleAt, sideAt } from "@/lib/tape";

export default function SocialProof1() {
  const wipe = useWipeIn();

  return (
    <section className="torn-top w-full overflow-x-clip py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-sky text-foreground">
      <div className="mx-auto max-w-[1400px] flex flex-col gap-12">
        <motion.h2 {...wipe("left")} className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-foreground text-left sm:text-center">
          Affiliations
        </motion.h2>
        <ul className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-6 sm:gap-x-5 max-sm:[&>*:last-child:nth-child(odd)]:col-span-2">
          {affiliations.map((it, i) => (
            <motion.li key={it.name} {...wipe(sideAt(i), Math.min(i, 5) * 0.06)}>
              <Tape
                as="div"
                bar="bg-white"
                panel
                clip={i}
                angle={angleAt(i) * 0.6}
                inset="inset-0"
                className="flex items-center justify-center px-6 py-8 min-h-36"
              >
                <img src={it.src} alt={`${it.name} logo`} title={it.name} className="max-h-20 w-auto max-w-full object-contain" />
              </Tape>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
