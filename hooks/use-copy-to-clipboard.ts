"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/** Copies text and exposes a short-lived `copied` flag for inline feedback. */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string, successMessage?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (successMessage) toast.success(successMessage);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetAfterMs);
        return true;
      } catch {
        toast.error("Could not copy to clipboard", {
          description: "Your browser blocked clipboard access.",
        });
        return false;
      }
    },
    [resetAfterMs],
  );

  return { copied, copy };
}
