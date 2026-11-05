// Cocoplus tape language: the rough edges of the label strips on the packs.
// Every strip on the site (CTA bars, labels, nav, filters, panels) picks one
// of these clip shapes so the torn edges stay consistent.
export const stripClips = [
  "polygon(0 12%, 14% 0, 38% 8%, 61% 1%, 83% 9%, 100% 0, 99% 88%, 77% 100%, 52% 92%, 29% 100%, 6% 93%, 1% 100%)",
  "polygon(1% 6%, 22% 0, 47% 7%, 70% 0, 100% 5%, 98% 94%, 74% 100%, 49% 93%, 24% 100%, 0 95%)",
  "polygon(0 4%, 26% 0, 51% 8%, 79% 0, 100% 6%, 100% 92%, 81% 100%, 57% 94%, 33% 100%, 9% 95%, 0 100%)",
  "polygon(0 0, 18% 7%, 42% 1%, 66% 9%, 88% 2%, 100% 8%, 99% 100%, 72% 93%, 45% 100%, 21% 94%, 2% 98%)",
] as const;

export const clipAt = (i: number) => stripClips[((i % stripClips.length) + stripClips.length) % stripClips.length];

// Small fixed angles, alternated by index so neighbouring strips never match.
const angles = [-2, 1.5, -1, 2, -1.5, 1];
export const angleAt = (i: number) => angles[i % angles.length];

// Wipe direction alternates the same way the CTA bars do.
export const sideAt = (i: number): "left" | "right" => (i % 2 === 0 ? "left" : "right");

// Large panels (product strips, contact panel, quote, logo strips): the same
// torn top and bottom, but measured in px so the tear stays shallow (max 3px) however
// tall the panel is. Sides stay straight.
export const panelClips = [
  "polygon(0% 1.9px, 13% 0.9px, 20% 0.7px, 32% 0.6px, 41% 2.4px, 49% 1.9px, 62% 2.9px, 72% 0.9px, 82% 1.3px, 93% 0.8px, 100% 0.4px, 100% calc(100% - 2.3px), 94% calc(100% - 0.9px), 84% calc(100% - 1.6px), 73% calc(100% - 2.0px), 62% calc(100% - 1.1px), 49% calc(100% - 0.1px), 42% calc(100% - 1.2px), 29% calc(100% - 0.3px), 17% calc(100% - 1.9px), 4% calc(100% - 1.1px), 0% calc(100% - 2.4px))",
  "polygon(0% 0.4px, 13% 2.5px, 25% 1.7px, 35% 1.6px, 46% 1.3px, 53% 1.9px, 60% 2.5px, 72% 2.1px, 79% 2.3px, 92% 1.0px, 100% 2.8px, 100% calc(100% - 2.9px), 91% calc(100% - 1.1px), 82% calc(100% - 2.5px), 72% calc(100% - 0.1px), 61% calc(100% - 2.5px), 52% calc(100% - 0.9px), 40% calc(100% - 2.0px), 33% calc(100% - 1.9px), 23% calc(100% - 1.7px), 9% calc(100% - 0.5px), 3% calc(100% - 0.3px), 0% calc(100% - 2.7px))",
  "polygon(0% 2.1px, 11% 2.9px, 23% 2.5px, 32% 2.9px, 44% 2.1px, 57% 2.4px, 65% 2.6px, 74% 1.5px, 83% 2.9px, 96% 2.4px, 100% 2.2px, 100% calc(100% - 1.6px), 88% calc(100% - 1.7px), 82% calc(100% - 2.0px), 70% calc(100% - 2.0px), 62% calc(100% - 2.1px), 49% calc(100% - 2.9px), 36% calc(100% - 0.4px), 29% calc(100% - 1.9px), 17% calc(100% - 0.4px), 7% calc(100% - 0.8px), 0% calc(100% - 1.9px))",
  "polygon(0% 1.0px, 6% 2.1px, 13% 2.9px, 23% 1.2px, 33% 1.6px, 43% 0.4px, 53% 0.2px, 61% 2.1px, 69% 0.2px, 79% 1.7px, 87% 1.5px, 97% 0.3px, 100% 0.9px, 100% calc(100% - 0.2px), 92% calc(100% - 1.6px), 81% calc(100% - 3.0px), 71% calc(100% - 3.0px), 61% calc(100% - 2.5px), 49% calc(100% - 0.1px), 37% calc(100% - 1.1px), 29% calc(100% - 2.0px), 22% calc(100% - 1.2px), 16% calc(100% - 1.5px), 2% calc(100% - 1.2px), 0% calc(100% - 1.2px))",
] as const;

export const panelClipAt = (i: number) => panelClips[((i % panelClips.length) + panelClips.length) % panelClips.length];
