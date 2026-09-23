"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useStartNewChat } from "@/features/chat/hooks/use-start-new-chat";
import { useHotkey } from "@/hooks/use-hotkey";
import { useUIStore } from "@/store/ui-store";

/** App-wide keyboard shortcuts. Chat-specific keys live in the chat workspace. */
export function GlobalHotkeys() {
  const openOverlay = useUIStore((state) => state.openOverlay);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const startNewChat = useStartNewChat();

  useHotkey("k", () => openOverlay("command"), { mod: true });
  useHotkey("/", () => openOverlay("shortcuts"), { mod: true });
  useHotkey("b", toggleSidebar, { mod: true });
  useHotkey("o", () => startNewChat(), { mod: true, shift: true });

  return null;
}

/** Opens the upgrade dialog when arriving from a pricing CTA (/app?upgrade=pro). */
export function UpgradeQueryHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const openOverlay = useUIStore((state) => state.openOverlay);
  const upgrade = searchParams.get("upgrade");

  useEffect(() => {
    if (!upgrade) return;
    openOverlay("upgrade");
    router.replace("/app", { scroll: false });
  }, [upgrade, openOverlay, router]);

  return null;
}
