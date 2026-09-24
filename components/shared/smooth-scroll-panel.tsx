"use client";

import { ReactLenis } from "lenis/react";
import type { ComponentPropsWithoutRef } from "react";

/** Matches the site-wide feel set in providers/lenis-provider.tsx. */
const EASE_OUT_CUBIC = (t: number) => 1 - (1 - t) ** 3;

/**
 * Smooths scrolling inside a fixed-height panel (the /app content areas, the
 * sidebar conversation list, the utility panel) the same way LenisProvider
 * smooths the window — which never reaches these internal `overflow-y-auto`
 * regions. Falls back to native scrolling under `prefers-reduced-motion`.
 */
export function SmoothScrollPanel({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <ReactLenis
      className={className}
      autoRaf
      options={{
        duration: 1,
        easing: EASE_OUT_CUBIC,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        autoRaf: true,
        respectReducedMotion: false,
      }}
      {...props}
    >
      {children}
    </ReactLenis>
  );
}
