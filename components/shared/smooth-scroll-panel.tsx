"use client";

import { ReactLenis } from "lenis/react";
import type { ComponentPropsWithoutRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

/** Matches the site-wide feel set in providers/lenis-provider.tsx. */
const EASE_OUT_CUBIC = (t: number) => 1 - (1 - t) ** 3;

/**
 * Smooths scrolling inside a fixed-height panel (the /app content areas, the
 * sidebar conversation list, the utility panel) the same way LenisProvider
 * smooths the window — which never reaches these internal `overflow-y-auto`
 * regions. Falls back to native scrolling under `prefers-reduced-motion`.
 */
export function SmoothScrollPanel({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (reducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <ReactLenis
      className={className}
      options={{
        duration: 1,
        easing: EASE_OUT_CUBIC,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        autoRaf: true,
      }}
      {...props}
    >
      {children}
    </ReactLenis>
  );
}
