"use client";

import { m } from "motion/react";
import { SidebarContent } from "@/components/app/sidebar-content";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useUIStore } from "@/store/ui-store";

const EXPANDED_WIDTH = 272;
const COLLAPSED_WIDTH = 64;

/** Desktop sidebar (md and up). Collapses to an icon rail. */
export function AppSidebar() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  // Skip the width animation while the persisted state is restored on load.
  const hydrated = useStoreHydrated(useUIStore);

  return (
    <m.aside
      aria-label="Sidebar"
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={hydrated ? { type: "spring", bounce: 0, duration: 0.3 } : { duration: 0 }}
      className="relative hidden h-full shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar md:block"
    >
      <div className="h-full" style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}>
        <SidebarContent collapsed={collapsed} collapsible layoutScope="desktop" />
      </div>
    </m.aside>
  );
}

/** Mobile drawer version of the sidebar. */
export function MobileSidebar() {
  const open = useUIStore((state) => state.mobileSidebarOpen);
  const setOpen = useUIStore((state) => state.setMobileSidebarOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[min(20rem,85vw)] gap-0 bg-sidebar p-0 md:hidden">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Workspace navigation and recent conversations</SheetDescription>
        <SidebarContent layoutScope="mobile" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
