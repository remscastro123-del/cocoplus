"use client";

// React Bits Pro blog-1 (article card grid), adapted as the homepage
// News & Events section: six latest posts, centred heading, centred
// "see all" CTA under the grid. Sharp corners only.
import { motion } from "motion/react";
import { news } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";

export function Blog1() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-10">
        <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-primary text-left sm:text-center">
          News &amp; Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {news.map((a, idx) => (
            <motion.a
              key={a.slug}
              href={`/news-events/${a.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: Math.min(idx, 5) * 0.06 }}
              className="group flex flex-col gap-4 no-underline"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
                {/* Date chip: informational, not clickable on its own */}
                <span className="absolute top-0 left-0 px-3 pt-1.5 pb-1 bg-accent text-accent-foreground font-heading text-lg tracking-[0.06em] leading-none">
                  {a.date}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading text-2xl sm:text-3xl leading-[0.95] tracking-[0.02em] text-primary group-hover:underline underline-offset-4">
                  {a.title}
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
