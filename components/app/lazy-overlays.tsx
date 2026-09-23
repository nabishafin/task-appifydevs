"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useUIStore, type OverlayId } from "@/store/ui-store";

// Dialogs are split into their own chunks and fetched the first time they open.
const CommandPalette = dynamic(() => import("./command-palette").then((module) => module.CommandPalette));
const SearchDialog = dynamic(() => import("./search-dialog").then((module) => module.SearchDialog));
const ShortcutsDialog = dynamic(() => import("./shortcuts-dialog").then((module) => module.ShortcutsDialog));
const UpgradeDialog = dynamic(() => import("./upgrade-dialog").then((module) => module.UpgradeDialog));

const OVERLAYS: Partial<Record<OverlayId, React.ComponentType>> = {
  command: CommandPalette,
  search: SearchDialog,
  shortcuts: ShortcutsDialog,
  upgrade: UpgradeDialog,
};

export function LazyOverlays() {
  const overlay = useUIStore((state) => state.overlay);
  // Once loaded, keep a dialog mounted so its exit animation can play.
  const [loaded, setLoaded] = useState<OverlayId[]>([]);

  if (overlay && OVERLAYS[overlay] && !loaded.includes(overlay)) {
    setLoaded([...loaded, overlay]);
  }

  return (
    <>
      {loaded.map((id) => {
        const Overlay = OVERLAYS[id];
        return Overlay ? <Overlay key={id} /> : null;
      })}
    </>
  );
}
