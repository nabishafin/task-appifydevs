"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const THRESHOLD_PX = 80;

/**
 * Keeps a scroll container pinned to the bottom while new content arrives,
 * unless the user has scrolled up to read earlier messages.
 * Uses native browser scrolling for 100% responsiveness on mobile and desktop.
 */
export function useStickToBottom<T extends HTMLElement>(
  dependency: unknown,
  structuralKey: unknown,
  enabled = true,
) {
  const containerRef = useRef<T>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isAtBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const element = containerRef.current;
    if (!element) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: reduceMotion ? "auto" : behavior,
    });
  }, []);

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

  // When new messages arrive or state changes, if user was at the bottom, auto-scroll to bottom.
  useEffect(() => {
    if (!enabled) return;
    if (isAtBottomRef.current) {
      const raf = requestAnimationFrame(() => {
        scrollToBottom();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [dependency, structuralKey, scrollToBottom, enabled]);

  // When disabled (e.g. empty state / new chat), ensure container resets to top
  useEffect(() => {
    if (!enabled) {
      containerRef.current?.scrollTo({ top: 0, behavior: "auto" });
      isAtBottomRef.current = true;
    }
  }, [enabled]);

  return { containerRef, isAtBottom, scrollToBottom };
}
