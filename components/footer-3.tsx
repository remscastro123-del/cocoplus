"use client";

// React Bits Pro footer-3, reworked for Cocoplus as one open Lagoon block
// (torn top edge, no boxes, no rules):
// 1. closing line + the one main CTA;
// 2. contact details as plain columns (Visit / Call / Write / Company),
//    phone and email are real tel:/mailto: links;
// 3. products as a wrapping row of links;
// 4. white strip: the large logo, copyright, back to top.
// On mobile each column group is a toggle (closed by default); from sm up
// every group is open and the headings are plain labels.
// Links get a Sun tape wiping in underneath on hover/focus.
import { useId, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { contact, nav } from "@/lib/content";
import { CtaButton } from "@/components/cta-button";
import { Tape } from "@/components/tape";
import { sideAt } from "@/lib/tape";
import { useWipeIn } from "@/lib/use-wipe-in";

const label = "font-heading text-xl tracking-[0.08em] uppercase leading-none text-sky";

function FooterLink({ href, children, i = 0 }: { href: string; children: React.ReactNode; i?: number }) {
  return (
    <a href={href} className="group focus-tape inline-block text-base text-primary-foreground no-underline">
      <Tape bar="" wipe="bg-accent" from={sideAt(i)} clip={i} angle={0} inset="-inset-x-0.5 -bottom-1 h-1.5 top-auto">
        {children}
      </Tape>
    </a>
  );
}

// Column group: a toggle on mobile, always open from sm up.
function Group({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={`flex flex-col sm:gap-4 ${className}`}>
      <h3 className={label}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between py-3 text-left sm:hidden"
        >
          {title}
          <ChevronDown className={`h-5 w-5 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} strokeWidth={2.5} />
        </button>
        <span className="hidden sm:inline">{title}</span>
      </h3>
      <div id={id} className={`${open ? "block" : "hidden"} pb-4 sm:block sm:pb-0`}>
        {children}
      </div>
    </div>
  );
}

const tel = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;

export default function Footer3() {
  const wipe = useWipeIn();

  return (
    <footer className="torn-top w-full bg-primary text-primary-foreground">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px] pt-16 pb-12 sm:pt-24 sm:pb-20 flex flex-col gap-10 sm:gap-20">
          {/* 1. Closing line + main CTA */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <motion.h2 {...wipe("left")} className="font-heading text-6xl sm:text-7xl lg:text-9xl leading-[0.86] text-primary-foreground max-w-4xl">
              From the Tree of Life to your table
            </motion.h2>
            <motion.div {...wipe("right", 0.1)} className="shrink-0">
              <CtaButton href="/contact-us" variant="primary" tone="dark" fullWidthOnMobile>
                Contact Us
              </CtaButton>
            </motion.div>
          </div>

          {/* 2. Contact + company */}
          <motion.div {...wipe("left", 0.05)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-10 lg:gap-12">
            <Group title="Visit">
              <address className="not-italic text-base leading-relaxed text-primary-foreground">
                {contact.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </Group>
            <Group title="Call">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-base">
                <dt className="text-sky">Mobile</dt>
                <dd>
                  <FooterLink href={tel(contact.mobile)}>{contact.mobile}</FooterLink>
                </dd>
                <dt className="text-sky">Phone</dt>
                <dd>
                  <FooterLink href={tel(contact.phone)} i={1}>
                    {contact.phone}
                  </FooterLink>
                </dd>
                <dt className="text-sky">Fax</dt>
                <dd className="text-primary-foreground">{contact.fax}</dd>
              </dl>
            </Group>
            <Group title="Write">
              <div className="break-all">
                <FooterLink href={`mailto:${contact.email}`}>{contact.email}</FooterLink>
              </div>
            </Group>
            <Group title="Company">
              <ul className="flex flex-col gap-2">
                {[...nav.company, ...nav.links].map((l, i) => (
                  <li key={l.name}>
                    <FooterLink href={l.href} i={i}>
                      {l.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </Group>
          </motion.div>

          {/* 3. Products */}
          <motion.div {...wipe("right", 0.05)} className="-mt-10 sm:mt-0">
            <Group title="Our products" className="sm:gap-5">
              <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
                {nav.products.map((l, i) => (
                  <li key={l.name}>
                    <FooterLink href={l.href} i={i}>
                      {l.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </Group>
          </motion.div>
        </div>
      </div>

      {/* 4. Bottom strip */}
      <div className="torn-top bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px] py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="focus-tape block w-fit" aria-label="Cocoplus home">
            <img src="/images/cocoplus-logo.png" alt="Cocoplus" className="h-20 w-auto sm:h-24" />
          </Link>
          <p className="text-sm text-foreground">{contact.copyright}</p>
          <a href="#" className="group focus-tape inline-flex w-fit items-center gap-2 font-heading text-lg tracking-[0.08em] uppercase leading-none text-foreground no-underline">
            <Tape bar="" wipe="bg-accent" from="right" clip={2} angle={-1} className="inline-flex items-center gap-2 px-2 pt-1.5 pb-1 group-hover:text-foreground group-focus-visible:text-foreground">
              Back to top
              <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
            </Tape>
          </a>
        </div>
      </div>
    </footer>
  );
}
