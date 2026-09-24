"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";

/** Matches Motion's default easing elsewhere in the app: quick start, no overshoot. */
const EASE_OUT_CUBIC = (t: number) => 1 - (1 - t) ** 3;

/**
 * Smoothly scrolls same-page anchor links (the landing nav's `#features` etc.)
 * through Lenis instead of the browser's instant jump, so in-page navigation
 * matches the inertial feel of the rest of the scroll.
 */
function AnchorScrollBridge() {
  const lenis = useLenis();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!lenis || event.defaultPrevented) return;
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || anchor.hash.length < 2) return;
      const target = document.getElementById(anchor.hash.slice(1));
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -72 });
      history.pushState(null, "", anchor.hash);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

/**
 * Site-wide inertial smooth scrolling via Lenis.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      autoRaf
      options={{
        duration: 1.1,
        easing: EASE_OUT_CUBIC,
        wheelMultiplier: 1,
        touchMultiplier: 0,
        autoRaf: true,
        respectReducedMotion: false,
      }}
    >
      <AnchorScrollBridge />
      {children}
    </ReactLenis>
  );
}
