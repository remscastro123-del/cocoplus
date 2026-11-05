"use client";

// React Bits Pro blog-1 (article card grid), reworked as the homepage
// News & Events section on cream, meeting the affiliations on a torn edge.
// Each photo is taped on: a Sun strip across the top-left corner carries
// the date (informational, no hover of its own). On hover a Sun tape
// wipes under the title. Cards wipe in from alternating sides, no fades.
import { motion } from "motion/react";
import { news } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";
import { Tape } from "@/components/tape";
import { clipAt, sideAt } from "@/lib/tape";
import { useWipeIn } from "@/lib/use-wipe-in";

export function Blog1() {
  const wipe = useWipeIn();

  return (
    <section className="torn-top w-full overflow-x-clip py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-12">
        <motion.h2 {...wipe("left")} className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-primary text-left sm:text-center">
          News &amp; Events
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {news.map((a, idx) => (
            <motion.a
              key={a.slug}
              href={`/news-events/${a.slug}`}
              {...wipe(sideAt(idx), Math.min(idx % 3, 2) * 0.08)}
              className="group focus-tape flex flex-col gap-5 text-foreground no-underline"
            >
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
                {/* Date tape across the corner */}
                <span
                  style={{ clipPath: clipAt(idx) }}
                  className="absolute -top-3 -left-3 -rotate-6 px-4 pt-2 pb-1.5 bg-accent text-accent-foreground font-heading text-lg tracking-[0.06em] leading-none"
                >
                  {a.date}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="w-fit font-heading text-2xl sm:text-3xl leading-[0.95] tracking-[0.02em] text-primary">
                  <Tape
                    bar=""
                    wipe="bg-accent"
                    from={sideAt(idx + 1)}
                    clip={idx + 1}
                    angle={-0.8}
                    inset="-inset-x-1 -bottom-2 h-2 top-auto"
                    className="inline-block"
                  >
                    {a.title}
                  </Tape>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{a.excerpt}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="flex justify-start sm:justify-center">
          <CtaButton href="/news-events">All news &amp; events</CtaButton>
        </div>
      </div>
    </section>
  );
}

export default Blog1;
