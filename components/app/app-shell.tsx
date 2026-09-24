"use client";

import { Suspense } from "react";
import { AppHeader } from "@/components/app/app-header";
import { AppSidebar, MobileSidebar } from "@/components/app/app-sidebar";
import { GlobalHotkeys, UpgradeQueryHandler } from "@/components/app/global-hotkeys";
import { LazyOverlays } from "@/components/app/lazy-overlays";
import { usePreferencesStore } from "@/store/preferences-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const fontScale = usePreferencesStore((state) => state.fontScale);
  const density = usePreferencesStore((state) => state.density);

  return (
    <div data-lenis-prevent data-font-scale={fontScale} data-density={density} className="flex h-dvh overflow-hidden bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:shadow-md"
      >
        Skip to content
      </a>
      <AppSidebar />
      <MobileSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main id="main" className="flex min-h-0 flex-1 flex-col">
          {children}
        </main>
      </div>
      <GlobalHotkeys />
      <Suspense fallback={null}>
        <UpgradeQueryHandler />
      </Suspense>
      <LazyOverlays />
    </div>
  );
}
