"use client";

import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";

const THRESHOLD_PX = 80;

/** Matches the site-wide feel set in providers/lenis-provider.tsx. */
const EASE_OUT_CUBIC = (t: number) => 1 - (1 - t) ** 3;

/**
 * Keeps a scroll container pinned to the bottom while new content arrives,
 * unless the user has scrolled up to read earlier messages. Also owns the
 * inertial smooth-scroll for this panel, since it's an internal `overflow-y-auto`
 * region that the window-level Lenis instance in LenisProvider never reaches.
 *
 * `structuralKey` should change only when the container's single child swaps
 * to a different element (e.g. skeleton -> message list -> empty state), so
 * Lenis re-measures against the right content node without restarting mid-stream.
 */
export function useStickToBottom<T extends HTMLElement>(dependency: unknown, structuralKey: unknown) {
  const containerRef = useRef<T>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isAtBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const element = containerRef.current;
    if (!element) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenisRef.current && !reduceMotion) {
      // Lenis re-measures scrollHeight via a debounced ResizeObserver, which lags
      // a tick behind a just-appended message. Force a synchronous remeasure so
      // "bottom" resolves against the current height, not a stale, shorter one.
      lenisRef.current.resize();
      lenisRef.current.scrollTo("bottom", { immediate: behavior !== "smooth" });
      return;
    }
    element.scrollTo({ top: element.scrollHeight, behavior: reduceMotion ? "auto" : behavior });
  }, []);

  useEffect(() => {
    const wrapper = containerRef.current;
    const content = wrapper?.firstElementChild;
    if (!wrapper || !(content instanceof HTMLElement)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 0.9,
      easing: EASE_OUT_CUBIC,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      autoRaf: true,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [structuralKey]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    function onScroll() {
      if (!element) return;
      const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight < THRESHOLD_PX;
      isAtBottomRef.current = atBottom;
      setIsAtBottom(atBottom);
    }
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) scrollToBottom();
  }, [dependency, scrollToBottom]);

  return { containerRef, isAtBottom, scrollToBottom };
}
