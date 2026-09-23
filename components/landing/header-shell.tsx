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
        "sticky top-0 z-40 w-full border-b transition-[background-color,border-color] duration-200",
        scrolled ? "border-border bg-background/80 backdrop-blur-md" : "border-transparent bg-background/0",
      )}
    >
      {children}
    </header>
  );
}
