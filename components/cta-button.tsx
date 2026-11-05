// Cocoplus CTA: three rough-edged "tape" bars at fixed, slightly different
// angles fill the button rectangle, like the label strips on the packaging.
// On hover/focus a second colour wipes across each bar, alternating
// direction (left→right, right→left, left→right) with a small stagger.
// The button itself never tilts. No frame lines, no chevrons, sharp corners.
//
// Bar shapes come from lib/tape.ts, shared with every other strip on the site.
// Focus = the same wipe plus a tape bar underneath (.focus-tape), no box.
//
// variant "primary": Sun bars (the one main action per view).
// variant "secondary": quieter bars.
// tone: "light" for white/cream sections, "dark" for blue/green sections.
import { clipAt } from "@/lib/tape";

type Props = {
  /** Link target. Without it the CTA renders as a <button> (use onClick). */
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  tone?: "light" | "dark";
  className?: string;
  fullWidthOnMobile?: boolean;
};

// [bar colour, wipe colour, text, text once wiped]
const palette = {
  primary: {
    light: ["bg-accent", "bg-primary", "text-primary", "group-hover:text-primary-foreground group-focus-visible:text-primary-foreground"],
    dark: ["bg-accent", "bg-white", "text-foreground", "group-hover:text-primary group-focus-visible:text-primary"],
  },
  secondary: {
    light: ["bg-sky", "bg-accent", "text-foreground", "group-hover:text-primary group-focus-visible:text-primary"],
    dark: ["bg-background", "bg-accent", "text-foreground", "group-hover:text-foreground"],
  },
} as const;

// Rough tape edges (polygon), fixed angle, wipe origin, stagger.
const bars = [
  { pos: "top-0 h-[50%] -left-[2%] right-[1%]", angle: "-rotate-[2deg]", from: "origin-left", delay: "delay-0" },
  { pos: "top-[25%] h-[50%] -left-[1%] -right-[2%]", angle: "rotate-[1.5deg]", from: "origin-right", delay: "delay-75" },
  { pos: "bottom-0 h-[50%] -left-[2%] -right-[1%]", angle: "-rotate-[1deg]", from: "origin-left", delay: "delay-150" },
];

export function CtaButton({ href, onClick, children, variant = "secondary", tone = "light", className = "", fullWidthOnMobile }: Props) {
  const [bar, wipe, text, textHover] = palette[variant][tone];
  const size = variant === "primary" ? "px-10 pt-4 pb-3.5 text-2xl sm:text-3xl" : "px-8 pt-3 pb-2.5 text-xl";
  const Tag = href ? "a" : "button";
  return (
    <Tag
      {...(href ? { href } : { type: "button" as const, onClick })}
      className={`group relative isolate inline-flex items-center justify-center font-heading uppercase tracking-[0.05em] leading-none no-underline select-none ${size} ${
        fullWidthOnMobile ? "w-full sm:w-auto" : "w-fit"
      } focus-tape ${className}`}
    >
      <span aria-hidden className="absolute inset-0 -z-10">
        {bars.map((b, i) => (
          <span key={i} style={{ clipPath: clipAt(i) }} className={`absolute overflow-hidden ${b.pos} ${b.angle} ${bar}`}>
            <span
              className={`absolute inset-0 ${wipe} ${b.from} ${b.delay} scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none`}
            />
          </span>
        ))}
      </span>
      <span className={`relative transition-colors duration-300 delay-100 motion-reduce:transition-none ${text} ${textHover}`}>{children}</span>
    </Tag>
  );
}
