"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

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
      lenis.scrollTo(target);
      history.pushState(null, "", anchor.hash);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

/**
 * Site-wide inertial smooth scrolling. Skipped entirely under `prefers-reduced-motion`,
 * which leaves native (instant) scrolling in place — same policy as the Motion setup
 * in AppProviders. Has no visible effect on routes like /app that scroll an internal
 * panel rather than the window; it simply has nothing to smooth there.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: EASE_OUT_CUBIC,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        autoRaf: true,
      }}
    >
      <AnchorScrollBridge />
      {children}
    </ReactLenis>
  );
}
