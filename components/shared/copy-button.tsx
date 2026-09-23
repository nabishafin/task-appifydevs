"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  size?: "icon-xs" | "icon-sm";
}

export function CopyButton({ value, label = "Copy", className, size = "icon-sm" }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <TooltipIconButton
      label={copied ? "Copied" : label}
      size={size}
      className={cn(copied && "text-success hover:text-success", className)}
      onClick={() => void copy(value)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15 }}
          className="inline-flex"
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </m.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </TooltipIconButton>
  );
}
