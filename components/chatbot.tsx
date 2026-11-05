"use client";

// Cocoplus chatbot. Front-end only: it answers from the site's own content
// (lib/content.ts) by matching the visitor's words to a topic, and never
// makes up facts. Anything it can't answer goes to the contact details.
// Hooking it to a real assistant later only needs a new `reply()`.
//
// Look: tape language, no boxes. The launcher is the palm tree and coconuts
// from the logo (images/tree-bare.png + tree-coconuts.png, so the coconuts
// can shake every few seconds) with a speech bubble that pops out of
// it once the site is ready and stays on the tree whenever the chat is
// closed. The tree stays as it is when open; the panel's header X closes it.
// On phones and tablets (below lg) the launcher is a chat head instead,
// starting bottom right: a round Sun head with the
// tree in it, draggable, snapping to the nearest side edge; tap opens.
// The panel wipes up (clip-path), with a Lagoon header strip; bot lines sit
// on Husk strips, visitor lines on Sky.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, SendHorizontal } from "lucide-react";
import { company, certifications, contact, nav, process, products } from "@/lib/content";
import { Tape } from "@/components/tape";
import { panelClipAt, sideAt } from "@/lib/tape";
import { useSiteReady } from "@/lib/site-ready";
import { useSafeReducedMotion } from "@/lib/use-reduced-motion";

type Msg = { from: "bot" | "you"; body: React.ReactNode; key: number };

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="font-medium text-primary underline underline-offset-2">
    {children}
  </a>
);

const topics = [
  {
    id: "products",
    label: "Your products",
    keys: ["product", "sell", "range", "oil", "soap", "sugar", "milk", "collagen", "massage", "catalog"],
    answer: () => (
      <>
        We make {products.length} products:
        <ul className="mt-2 flex flex-col gap-1">
          {nav.products.map((p) => (
            <li key={p.href}>
              <A href={p.href}>{p.name}</A>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "process",
    label: "How VCO is made",
    keys: ["process", "made", "make", "centrifuge", "method", "extract", "how"],
    answer: () => (
      <>
        We use the {process.title.toLowerCase()}:
        <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5">
          {process.steps.map((s) => (
            <li key={s.id}>{s.title}</li>
          ))}
        </ol>
        <span className="mt-2 block">
          More on the <A href="/process">process page</A>.
        </span>
      </>
    ),
  },
  {
    id: "certs",
    label: "Certifications",
    keys: ["certif", "organic", "halal", "fda", "gmp", "usda", "control union"],
    answer: () => (
      <>
        {certifications.note} ({certifications.cuNumber}). We also hold {certifications.logos.map((l) => l.name).join(", ")} certification.
      </>
    ),
  },
  {
    id: "buy",
    label: "Order or wholesale",
    keys: ["buy", "order", "price", "wholesale", "bulk", "distribut", "export", "ship"],
    answer: () => (
      <>
        For orders, prices and wholesale, our team will help directly: <A href={`mailto:${contact.email}`}>{contact.email}</A> or {contact.phone}. You can also use the{" "}
        <A href="/contact-us">contact page</A>.
      </>
    ),
  },
  {
    id: "contact",
    label: "Contact details",
    keys: ["contact", "phone", "call", "email", "address", "where", "visit", "located"],
    answer: () => (
      <>
        {contact.address.join(", ")}.
        <span className="mt-1 block">
          Phone {contact.phone} · Mobile {contact.mobile}
        </span>
        <span className="block">
          <A href={`mailto:${contact.email}`}>{contact.email}</A>
        </span>
      </>
    ),
  },
  {
    id: "about",
    label: "About Cocoplus",
    keys: ["about", "company", "who", "capacity", "liters", "litres"],
    answer: () => (
      <>
        {company.title}: {company.body}
      </>
    ),
  },
];

function reply(text: string): React.ReactNode {
  const t = text.toLowerCase();
  const hit = topics.find((tp) => tp.keys.some((k) => t.includes(k)));
  if (hit) return hit.answer();
  return (
    <>
      I can help with our products, how our oil is made, certifications and contact details. For anything else, write to{" "}
      <A href={`mailto:${contact.email}`}>{contact.email}</A>.
    </>
  );
}

// Phone chat head: drag anywhere, snaps to the nearest side, tap to open.
const HEAD = 64;
const EDGE = 10;
const TOP_SAFE = 80; // clear of the navbar

function cookieOffset() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--cookie-h")) || 0;
}
function snap(x: number, y: number) {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  return {
    x: x + HEAD / 2 < w / 2 ? EDGE : w - HEAD - EDGE,
    y: Math.min(Math.max(y, TOP_SAFE), h - HEAD - EDGE - cookieOffset()),
  };
}

function ChatHead({ hidden, onOpen, reduce, nudge, onDismiss }: { hidden: boolean; onOpen: () => void; reduce: boolean; nudge: boolean; onDismiss: () => void }) {
  // Only rendered on the client (after the preloader), so window is there.
  // starts bottom right
  const [pos, setPos] = useState(() => snap(document.documentElement.clientWidth, document.documentElement.clientHeight));
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ sx: number; sy: number; px: number; py: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  // Stay on screen when the viewport or the cookie strip changes.
  useEffect(() => {
    const keepIn = () => setPos((p) => snap(p.x, p.y));
    window.addEventListener("resize", keepIn);
    window.addEventListener("cookie-offset", keepIn);
    const ro = new ResizeObserver(keepIn);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", keepIn);
      window.removeEventListener("cookie-offset", keepIn);
      ro.disconnect();
    };
  }, []);

  const onRight = pos.x > document.documentElement.clientWidth / 2;

  return (
    // the wrapper is positioned (focus-tape sets position: relative on the button)
    <div
      className={`fixed z-[54] lg:hidden ${hidden ? "pointer-events-none scale-0" : "scale-100"}`}
      style={{
        left: pos.x,
        top: pos.y,
        transitionProperty: dragging || reduce ? "transform" : "left, top, transform",
        transitionDuration: reduce ? "0ms" : "300ms",
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
    <button
      type="button"
      aria-label="Chat with Cocoplus"
      aria-controls="cocoplus-chat"
      aria-expanded={hidden}
      className="group focus-tape block touch-none select-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y, moved: false };
        setDragging(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.sx;
        const dy = e.clientY - d.sy;
        if (Math.hypot(dx, dy) > 6) d.moved = true;
        if (d.moved) setPos({ x: d.px + dx, y: d.py + dy });
      }}
      onPointerUp={() => {
        const d = drag.current;
        drag.current = null;
        setDragging(false);
        if (d?.moved) {
          suppressClick.current = true;
          setPos((p) => snap(p.x, p.y));
        }
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
        setPos((p) => snap(p.x, p.y));
      }}
      onClick={() => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        onOpen();
      }}
    >
      {/* the head: Sun disc with the logo tree planted in it */}
      <span className={`relative block overflow-hidden rounded-full bg-accent transition-transform duration-200 ${dragging ? "scale-110" : ""}`} style={{ width: HEAD, height: HEAD }}>
        <TreeMark className="absolute -bottom-2 left-1/2 h-[88%] w-[88%] -translate-x-1/2" />
      </span>
    </button>
    {/* nudge on top of the head, aligned to the side it is docked on */}
    <div className={`absolute bottom-full mb-4 ${onRight ? "right-0" : "left-0"}`}>
      <AnimatePresence>
        {nudge && !hidden && !dragging && <Nudge key="nudge" onOpen={onOpen} onDismiss={onDismiss} reduce={reduce} tail={onRight ? "right" : "left"} />}
      </AnimatePresence>
    </div>
    </div>
  );
}

// The logo tree, with its coconut cluster as a separate layer that shakes
// every few seconds (.coconut-shake in globals.css; off for reduced motion).
// `outline` adds a white keyline so it stays visible on the green sections.
function TreeMark({ className = "", outline = false }: { className?: string; outline?: boolean }) {
  return (
    <span className={`block ${outline ? "tree-outline" : ""} ${className}`}>
      <img src="/images/tree-bare.png" alt="" draggable={false} className="absolute inset-0 h-full w-full object-contain" />
      <img src="/images/tree-coconuts.png" alt="" draggable={false} className="coconut-shake absolute inset-0 h-full w-full object-contain" />
    </span>
  );
}

// "Hi! Ask me anything" nudge: sits on top of the tree / head with its tail
// pointing down at it. The text opens the chat; the X dismisses the nudge
// for good (remembered in this browser).
const NUDGE_KEY = "cocoplus-chat-nudge-off";
function readNudgeOff() {
  try {
    return localStorage.getItem(NUDGE_KEY) === "1";
  } catch {
    return false;
  }
}

function Nudge({ onOpen, onDismiss, reduce, tail }: { onOpen: () => void; onDismiss: () => void; reduce: boolean; tail: "center" | "left" | "right" }) {
  const tailPos = tail === "center" ? "left-1/2 -translate-x-1/2" : tail === "right" ? "right-6" : "left-6";
  const origin = tail === "center" ? "50% 100%" : tail === "right" ? "90% 100%" : "10% 100%";
  return (
    <motion.div
      initial={reduce ? false : { scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 16, delay: 0.4 }}
      style={{ transformOrigin: origin }}
      className="relative"
    >
      <button type="button" onClick={onOpen} className="group focus-tape block">
        <Tape bar="bg-accent" wipe="bg-white" clip={1} angle={-2} inset="inset-0" className="block whitespace-nowrap px-3.5 pt-2 pb-1.5 font-hand text-lg leading-none text-foreground">
          Hi! Ask me anything
        </Tape>
      </button>
      {/* dismiss: a small tab stuck on the bubble's upper-right corner */}
      {/* (positioned wrapper: focus-tape sets position: relative on buttons) */}
      <span className="absolute -top-3 -right-3 z-10 block">
        <button type="button" onClick={onDismiss} aria-label="Dismiss chat message" className="group focus-tape block">
          <Tape bar="bg-foreground" wipe="bg-primary" clip={2} angle={4} inset="inset-0" className="flex h-6 w-6 items-center justify-center text-primary-foreground">
            <X className="h-3.5 w-3.5" strokeWidth={3} />
          </Tape>
        </button>
      </span>
      {/* tail, pointing down at the tree */}
      <span aria-hidden className={`absolute -bottom-2.5 h-3 w-4 bg-accent [clip-path:polygon(0_0,100%_0,50%_100%)] ${tailPos}`} />
    </motion.div>
  );
}

const GREETING: Msg = {
  from: "bot",
  key: 0,
  body: "Hi! I'm the Cocoplus helper. Ask me about our virgin coconut oil, products or how to reach us.",
};

export function Chatbot() {
  const ready = useSiteReady();
  const reduce = useSafeReducedMotion();
  const [open, setOpen] = useState(false);
  const [nudgeOff, setNudgeOff] = useState(readNudgeOff);
  const dismissNudge = () => {
    setNudgeOff(true);
    try {
      localStorage.setItem(NUDGE_KEY, "1");
    } catch {
      // storage blocked: dismissed for this visit only
    }
  };
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [text, setText] = useState("");
  const [hint, setHint] = useState("");
  const seq = useRef(1);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [msgs, open]);

  // Phones: the chat is fullscreen, so the page behind must not scroll.
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 639px)").matches) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    input.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = (q: string, answer?: React.ReactNode) => {
    const you: Msg = { from: "you", body: q, key: seq.current++ };
    const bot: Msg = { from: "bot", body: answer ?? reply(q), key: seq.current++ };
    setMsgs((m) => [...m, you, bot]);
  };

  const send = () => {
    const q = text.trim();
    if (!q) {
      setHint("Type a question first.");
      return;
    }
    setHint("");
    setText("");
    ask(q);
  };

  if (!ready) return null;

  return (
    <>
    <ChatHead hidden={open} onOpen={() => setOpen(true)} reduce={reduce} nudge={!nudgeOff} onDismiss={dismissNudge} />
    {/* above the cookie strip while open (phones: the chat is fullscreen) */}
    <div className={`fixed right-4 flex flex-col items-end gap-3 sm:right-6 ${open ? "z-[70]" : "z-[54]"}`} style={{ bottom: "var(--cookie-h, 0px)" }}>
      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            id="cocoplus-chat"
            aria-label="Cocoplus chat"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            exit={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            // phones: fullscreen; sm up: a torn-edge panel with a Deep Lagoon border
            className="max-sm:fixed max-sm:inset-0 max-sm:h-dvh max-sm:w-full sm:h-[var(--panel-h)] sm:w-[380px]"
            style={{
              ["--panel-h" as string]: "min(560px, calc(100svh - 9rem - var(--cookie-h, 0px)))",
              ["--panel-clip" as string]: panelClipAt(1),
            }}
          >
            <div className="h-full sm:bg-foreground sm:p-[3px] sm:[clip-path:var(--panel-clip)]">
            <div className="flex h-full flex-col bg-background sm:[clip-path:var(--panel-clip)]">
            {/* header strip */}
            <header className="flex items-center justify-between gap-3 bg-primary px-5 py-4 text-primary-foreground max-sm:pt-[max(1rem,env(safe-area-inset-top))]">
              <div>
                <p className="font-hand text-xl leading-none text-accent">Ask us</p>
                <h2 className="font-heading text-3xl leading-none">Cocoplus helper</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="group focus-tape p-1">
                <X className="h-6 w-6" strokeWidth={2.5} />
              </button>
            </header>

            {/* messages */}
            <div ref={list} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite" data-lenis-prevent>
              {msgs.map((m, i) => (
                <div key={m.key} className={`max-w-[88%] ${m.from === "you" ? "self-end" : "self-start"}`}>
                  <Tape
                    as="div"
                    bar={m.from === "you" ? "bg-sky" : "bg-secondary"}
                    panel
                    clip={i}
                    angle={0}
                    inset="inset-0"
                    className="block px-4 py-3 text-sm leading-relaxed text-foreground"
                  >
                    {m.body}
                  </Tape>
                </div>
              ))}
            </div>

            {/* quick questions: one sideways row */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-lenis-prevent>
              {topics.map((tp, i) => (
                <button key={tp.id} type="button" onClick={() => ask(tp.label, tp.answer())} className="group focus-tape shrink-0">
                  <Tape bar="bg-sky" wipe="bg-accent" from={sideAt(i)} clip={i} angle={0} inset="inset-0" className="block whitespace-nowrap px-3 py-1.5 text-sm font-medium text-foreground">
                    {tp.label}
                  </Tape>
                </button>
              ))}
            </div>

            {/* input */}
            <form
              className="flex items-stretch gap-2 bg-secondary px-4 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <label htmlFor="cocoplus-chat-input" className="sr-only">
                Your question
              </label>
              <input
                ref={input}
                id="cocoplus-chat-input"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (hint) setHint("");
                }}
                placeholder="Ask about our oil…"
                autoComplete="off"
                className="min-w-0 flex-1 bg-white px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:shadow-[inset_0_-3px_0_var(--primary)]"
              />
              <button type="submit" aria-disabled={!text.trim()} aria-label="Send" className="group focus-tape">
                <Tape bar="bg-accent" wipe="bg-primary" clip={2} angle={-1.5} inset="inset-0" className="flex h-full items-center px-3 text-foreground group-hover:text-primary-foreground">
                  <SendHorizontal className="h-5 w-5" strokeWidth={2.5} />
                </Tape>
              </button>
            </form>
            {hint && (
              <p role="status" className="bg-secondary px-4 pb-3 text-sm text-foreground">
                {hint}
              </p>
            )}
            </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* launcher (lg up): the logo's palm tree, planted; the nudge sits on
          top of it. The panel has its own X. */}
      <div className="relative hidden lg:block">
        <div className="absolute bottom-[calc(100%-1.75rem)] left-1/2 z-10 -translate-x-1/2">
          <AnimatePresence>{!open && !nudgeOff && <Nudge key="nudge" onOpen={() => setOpen(true)} onDismiss={dismissNudge} reduce={reduce} tail="center" />}</AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="cocoplus-chat"
          aria-label={open ? "Close chat" : "Chat with Cocoplus"}
          className="group focus-tape relative flex items-end"
        >
          {/* planted: the trunk runs off the bottom edge (or into the cookie strip) */}
          <span className="relative -mb-4 block h-40 w-40">
            <TreeMark outline className="absolute inset-0 origin-bottom transition-transform duration-300 ease-out group-hover:-rotate-3 motion-reduce:transition-none" />
          </span>
        </button>
      </div>
    </div>
    </>
  );
}
