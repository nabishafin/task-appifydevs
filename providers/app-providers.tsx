"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { applyTheme } from "@/lib/theme";
import { useThemeStore } from "@/store/theme-store";
import { LenisProvider } from "./lenis-provider";

const loadMotionFeatures = () => import("./motion-features").then((module) => module.default);

/** Restores the saved theme preference and follows OS changes when set to "system". */
function useThemeSync() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    useThemeStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);
}

/** Root providers shared by the landing page, the web app and the extension demo. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  useThemeSync();

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", bounce: 0, duration: 0.35 }}>
        <TooltipProvider delayDuration={300}>
          <LenisProvider>{children}</LenisProvider>
          <Toaster position="bottom-right" closeButton />
        </TooltipProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
