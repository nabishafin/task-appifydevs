"use client";

import { useSyncExternalStore } from "react";
import { isMacPlatform } from "@/lib/utils";

const noopSubscribe = () => () => {};

/** Platform never changes during a session; the server assumes macOS for the first paint. */
export function useIsMac(): boolean {
  return useSyncExternalStore(noopSubscribe, isMacPlatform, () => true);
}
