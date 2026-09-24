"use client";

import { m } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface FilterChipOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterChipsProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: ReadonlyArray<FilterChipOption<T>>;
  /** Accessible name for the group. */
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/** Horizontally scrollable single-select chips with an animated active background. */
export function FilterChips<T extends string>({
  value,
  onValueChange,
  options,
  label,
  size = "md",
  className,
}: FilterChipsProps<T>) {
  const layoutId = useId();

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("-mx-1 no-scrollbar flex gap-1.5 overflow-x-auto px-1 py-0.5", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative inline-flex shrink-0 items-center gap-1.5 rounded-md border font-medium whitespace-nowrap transition-colors",
              size === "md" ? "h-8 px-3 text-sm" : "h-7 px-2.5 text-xs",
              active
                ? "border-transparent text-primary-foreground"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {active && (
              <m.span layoutId={layoutId} aria-hidden="true" className="absolute inset-0 rounded-md bg-primary" />
            )}
            <span className="relative">{option.label}</span>
            {option.count !== undefined && (
              <span
                className={cn("relative text-xs", active ? "text-primary-foreground/80" : "text-subtle-foreground")}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
