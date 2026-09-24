"use client";

import type { ComponentPropsWithoutRef } from "react";

/**
 * A clean, high-performance scroll panel that opts out of root Lenis interception via
 * data-lenis-prevent so inner scrollable areas (models, prompts, history, settings, compare, sidebar)
 * always scroll natively, fluidly, and reliably on both desktop and mobile.
 */
export function SmoothScrollPanel({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div data-lenis-prevent className={className} {...props}>
      {children}
    </div>
  );
}
