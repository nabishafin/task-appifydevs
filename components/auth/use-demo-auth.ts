"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { siteConfig } from "@/constants/site";
import { sleep } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferences-store";

type AuthProvider = "email" | "google" | "github";

/**
 * Simulated authentication: waits briefly, optionally stores the profile the
 * user typed, then opens the workspace. Swap the body for a real auth client.
 */
export function useDemoAuth() {
  const router = useRouter();
  const [pending, setPending] = useState<AuthProvider | null>(null);

  async function authenticate(provider: AuthProvider, profile?: { name: string; email: string }) {
    setPending(provider);
    await sleep(900);

    if (profile) {
      // Load any saved preferences first so the new profile is merged, not overwritten later.
      await usePreferencesStore.persist.rehydrate();
      const { profile: current, setPreference } = usePreferencesStore.getState();
      setPreference("profile", { ...current, displayName: profile.name, email: profile.email });
    }

    toast.success(profile ? `Welcome to EchoGPT, ${profile.name.split(" ")[0]}!` : "Signed in", {
      description: "Demo account — no real authentication happens in this concept.",
    });
    router.push(siteConfig.links.app);
  }

  return { pending, authenticate };
}
