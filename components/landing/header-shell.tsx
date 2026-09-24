"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky header wrapper that gains a border and blurred surface once the page scrolls. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-200",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-xs"
          : "bg-background/90 backdrop-blur-md",
      )}
    >
      {children}
    </header>
  );
}
