"use client";

import type { LucideIcon } from "lucide-react";
import { m } from "motion/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
  /** Small trailing hint, e.g. "-25%". */
  badge?: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: ReadonlyArray<SegmentedOption<T>>;
  /** Accessible name for the group. */
  label: string;
  /** Unique per instance so the animated indicator never jumps between controls. */
  id: string;
  size?: "sm" | "md";
  className?: string;
}

/** Radio group styled as a segmented control, with arrow-key navigation from Radix. */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  label,
  id,
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  return (
    <RadioGroup.Root
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        const option = options.find((item) => item.value === next);
        if (option) onValueChange(option.value);
      }}
      orientation="horizontal"
      className={cn("inline-flex rounded-lg border border-border bg-background-subtle p-0.5", className)}
    >
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon, badge }) => {
        const selected = optionValue === value;
        return (
          <RadioGroup.Item
            key={optionValue}
            value={optionValue}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              size === "md" ? "h-8 px-3 text-sm" : "h-7 px-2.5 text-xs",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected && (
              <m.span
                layoutId={`${id}-segment`}
                aria-hidden="true"
                className="absolute inset-0 rounded-md border border-border bg-card shadow-xs"
              />
            )}
            {Icon && <Icon className="relative size-3.5" aria-hidden="true" />}
            <span className="relative">{optionLabel}</span>
            {badge && (
              <span className="relative rounded-md bg-primary/12 px-1.5 py-px text-[10px] font-semibold text-primary-text">
                {badge}
              </span>
            )}
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}
