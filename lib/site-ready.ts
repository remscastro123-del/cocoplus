"use client";

import { useSyncExternalStore } from "react";

// "Site ready" = the preloader has finished and handed over to the page.
// The hero waits for it before its entrance wipes, and Lenis stays stopped
// until then. Server snapshot is always false.
let ready = false;
const subs = new Set<() => void>();

export function markSiteReady() {
  if (ready) return;
  ready = true;
  subs.forEach((fn) => fn());
}

export function isSiteReady() {
  return ready;
}

export function onSiteReady(fn: () => void) {
  if (ready) {
    fn();
    return () => {};
  }
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

function subscribe(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function useSiteReady() {
  return useSyncExternalStore(subscribe, () => ready, () => false);
}
