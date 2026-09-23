"use client";

import { useEffect, useRef } from "react";

interface HotkeyOptions {
  /** Require ⌘ on macOS or Ctrl elsewhere. */
  mod?: boolean;
  shift?: boolean;
  /** Fire even while typing in an input or textarea. Defaults to true for mod combos. */
  allowInInputs?: boolean;
  enabled?: boolean;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/** Registers a single keyboard shortcut on `window`. */
export function useHotkey(key: string, handler: (event: KeyboardEvent) => void, options: HotkeyOptions = {}) {
  const { mod = false, shift = false, enabled = true } = options;
  const allowInInputs = options.allowInInputs ?? mod;
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (mod !== (event.metaKey || event.ctrlKey)) return;
      if (shift !== event.shiftKey) return;
      if (!allowInInputs && isTypingTarget(event.target)) return;
      event.preventDefault();
      handlerRef.current(event);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, mod, shift, allowInInputs, enabled]);
}
