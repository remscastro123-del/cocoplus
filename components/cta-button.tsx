// Cocoplus CTA: three rough-edged "tape" bars at fixed, slightly different
// angles fill the button rectangle, like the label strips on the packaging.
// On hover/focus a second colour wipes across each bar, alternating
// direction (left→right, right→left, left→right) with a small stagger.
// The button itself never tilts. No frame lines, no chevrons, sharp corners.
//
// variant "primary": Sun bars (the one main action per view).
// variant "secondary": quieter bars.
// tone: "light" for white/cream sections, "dark" for blue/green sections.

type Props = {
  href: string;
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
  { pos: "top-0 h-[44%] -left-[2%] right-[1%]", angle: "-rotate-[2deg]", from: "origin-left", delay: "delay-0", clip: "polygon(0 12%, 14% 0, 38% 8%, 61% 1%, 83% 9%, 100% 0, 99% 88%, 77% 100%, 52% 92%, 29% 100%, 6% 93%, 1% 100%)" },
  { pos: "top-[30%] h-[42%] -left-[1%] -right-[2%]", angle: "rotate-[1.5deg]", from: "origin-right", delay: "delay-75", clip: "polygon(1% 6%, 22% 0, 47% 7%, 70% 0, 100% 5%, 98% 94%, 74% 100%, 49% 93%, 24% 100%, 0 95%)" },
  { pos: "bottom-0 h-[42%] -left-[2%] -right-[1%]", angle: "-rotate-[1deg]", from: "origin-left", delay: "delay-150", clip: "polygon(0 4%, 26% 0, 51% 8%, 79% 0, 100% 6%, 100% 92%, 81% 100%, 57% 94%, 33% 100%, 9% 95%, 0 100%)" },
];

export function CtaButton({ href, children, variant = "secondary", tone = "light", className = "", fullWidthOnMobile }: Props) {
  const [bar, wipe, text, textHover] = palette[variant][tone];
  const size = variant === "primary" ? "px-10 pt-4 pb-3.5 text-2xl sm:text-3xl" : "px-8 pt-3 pb-2.5 text-xl";
  return (
    <a
      href={href}
      className={`group relative isolate inline-flex items-center justify-center font-heading uppercase tracking-[0.05em] leading-none no-underline select-none ${size} ${
        fullWidthOnMobile ? "w-full sm:w-auto" : "w-fit"
      } focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current ${className}`}
    >
      <span aria-hidden className="absolute inset-0 -z-10">
        {bars.map((b, i) => (
          <span key={i} style={{ clipPath: b.clip }} className={`absolute overflow-hidden ${b.pos} ${b.angle} ${bar}`}>
            <span
              className={`absolute inset-0 ${wipe} ${b.from} ${b.delay} scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none`}
            />
          </span>
        ))}
      </span>
      <span className={`relative transition-colors duration-300 delay-100 motion-reduce:transition-none ${text} ${textHover}`}>{children}</span>
    </a>
  );
}
