"use client";

// React Bits Pro social-proof-1, adapted for Cocoplus affiliations: plain
// white section, logos separated by horizontal rules only (no cell fills,
// no vertical lines). Logos keep their own colours. Sharp corners only.
import { motion } from "motion/react";
import { affiliations } from "@/lib/content";

export default function SocialProof1() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-[1400px] flex flex-col gap-10">
        <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-primary text-left sm:text-center">Affiliations</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-5 border-t-[3px] border-primary max-sm:[&>*:last-child:nth-child(odd)]:col-span-2">
          {affiliations.map((it, i) => (
            <motion.li
              key={it.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.06 }}
              className="flex items-center justify-center px-6 py-8 min-h-36 border-b-[3px] border-primary"
            >
              <img src={it.src} alt={`${it.name} logo`} title={it.name} className="max-h-20 w-auto max-w-full object-contain" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
