"use client";

import { MARKETING_NAV } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { useActiveSection } from "./use-active-section";

const SECTION_IDS = MARKETING_NAV.map((item) => item.href.slice(1));

export function DesktopNav() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {MARKETING_NAV.map((item) => {
          const active = activeId === item.href.slice(1);
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "relative inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3 -bottom-4 h-px rounded-full bg-primary transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
