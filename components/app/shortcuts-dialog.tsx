"use client";

import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOverlay } from "@/store/ui-store";
import { ShortcutList } from "./shortcut-list";

export function ShortcutsDialog() {
  const { open, onOpenChange } = useOverlay("shortcuts");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            Press <ShortcutKeys keys={["mod", "/"]} /> any time to open this list.
          </DialogDescription>
        </DialogHeader>
        <ShortcutList />
      </DialogContent>
    </Dialog>
  );
}
