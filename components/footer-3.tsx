"use client";

// React Bits Pro footer-3, adapted for Cocoplus: white footer, large logo,
// contact details as one solid Lagoon block with the Contact Us CTA, link
// columns in blue. Horizontal rules only, sharp corners.
import Link from "next/link";
import { motion } from "motion/react";
import { contact, nav } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";

const item = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export default function Footer3() {
  const columns = [
    { title: "Our Products", links: nav.products },
    { title: "Company", links: [...nav.company, ...nav.links] },
  ];

  return (
    <footer className="w-full bg-white text-foreground border-t-[3px] border-primary">
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.div {...item} className="mx-auto w-full max-w-[1400px] py-12 sm:py-16 flex flex-col gap-10 sm:gap-12">
          <Link href="/" className="w-fit" aria-label="Cocoplus home">
            <img src="/images/cocoplus-logo.png" alt="Cocoplus" className="h-24 sm:h-32 w-auto" />
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16">
            {/* Contact block */}
            <div className="bg-primary text-primary-foreground p-8 sm:p-10 flex flex-col gap-6">
              <h3 className="font-heading text-5xl sm:text-6xl leading-[0.9]">Contact Info</h3>
              <address className="not-italic text-base leading-relaxed text-primary-foreground/90">
                {contact.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-base text-primary-foreground/90">
                <dt className="font-heading text-lg tracking-[0.04em] text-sky">M</dt>
                <dd>{contact.mobile}</dd>
                <dt className="font-heading text-lg tracking-[0.04em] text-sky">P</dt>
                <dd>{contact.phone}</dd>
                <dt className="font-heading text-lg tracking-[0.04em] text-sky">F</dt>
                <dd>{contact.fax}</dd>
                <dt className="font-heading text-lg tracking-[0.04em] text-sky">E</dt>
                <dd className="select-all break-all">{contact.email}</dd>
              </dl>
              <CtaButton href="/contact-us" variant="primary" tone="dark" className="mt-2">
                Contact Us
              </CtaButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12">
              {columns.map((section) => (
                <div key={section.title}>
                  <h3 className="pb-3 mb-4 border-b-[3px] border-primary font-heading text-3xl tracking-[0.03em] text-primary">{section.title}</h3>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-sm sm:text-base text-foreground/85 underline-offset-4 hover:text-primary hover:underline">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="border-t-[3px] border-primary px-4 sm:px-6 lg:px-8">
        <p className="mx-auto w-full max-w-[1400px] py-6 text-xs sm:text-sm text-foreground/80">{contact.copyright}</p>
      </div>
    </footer>
  );
}
