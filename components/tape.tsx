// One tape strip behind a piece of content, built like a single CTA bar:
// a solid, rough-edged bar at a fixed small angle; the content on top stays
// straight. With `wipe`, a second colour wipes across the bar when the
// nearest `group` ancestor is hovered or focused (or always, when `active`).
//
// Rules: solid colours only (no alpha), no frame lines.
// Informational labels: no `wipe`, and no `group` on an ancestor.
import { clipAt, panelClipAt } from "@/lib/tape";

type Props = {
  children?: React.ReactNode;
  /** Base colour class. "" leaves only the wipe (e.g. nav links). */
  bar?: string;
  /** Wipe colour class, runs on group hover / focus-visible. */
  wipe?: string;
  /** Keeps the wipe on: selected state. */
  active?: boolean;
  from?: "left" | "right";
  clip?: number;
  /** Bar angle in degrees. */
  angle?: number;
  /** Bar position relative to the content box. */
  inset?: string;
  className?: string;
  as?: "span" | "div";
  /** Large block: shallow px tear instead of the label tear. */
  panel?: boolean;
};

export function Tape({
  children,
  bar = "bg-accent",
  wipe,
  active = false,
  from = "left",
  clip = 0,
  angle = -2,
  inset = "-inset-x-1.5 inset-y-0",
  className = "",
  as: Tag = "span",
  panel = false,
}: Props) {
  return (
    <Tag className={`relative isolate ${className}`}>
      <span
        aria-hidden
        style={{ clipPath: panel ? panelClipAt(clip) : clipAt(clip), transform: `rotate(${angle}deg)` }}
        className={`absolute -z-10 overflow-hidden ${inset} ${bar}`}
      >
        {wipe && (
          <span
            className={`absolute inset-0 ${wipe} ${from === "left" ? "origin-left" : "origin-right"} transition-transform duration-300 ease-out motion-reduce:transition-none ${
              active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
            }`}
          />
        )}
      </span>
      {children}
    </Tag>
  );
}
