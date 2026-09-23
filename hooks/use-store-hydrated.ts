"use client";

import { useSyncExternalStore } from "react";

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
}

/**
 * True once a persisted zustand store has loaded from localStorage. Server
 * rendering always reports false, so persisted UI renders only on the client
 * and never causes a hydration mismatch.
 */
export function useStoreHydrated(store: { persist: PersistApi }): boolean {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
