import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage";

export type OverlayId = "command" | "shortcuts" | "search" | "model" | "upgrade";

interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  utilityPanelOpen: boolean;
  overlay: OverlayId | null;
  /** Text handed to the chat composer from other pages (prompt library, compare). */
  composerDraft: string | null;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleUtilityPanel: () => void;
  openOverlay: (overlay: OverlayId) => void;
  closeOverlay: () => void;
  setComposerDraft: (draft: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      utilityPanelOpen: true,
      overlay: null,
      composerDraft: null,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
      toggleUtilityPanel: () => set((state) => ({ utilityPanelOpen: !state.utilityPanelOpen })),
      openOverlay: (overlay) => set({ overlay }),
      closeOverlay: () => set({ overlay: null }),
      setComposerDraft: (composerDraft) => set({ composerDraft }),
    }),
    {
      name: STORAGE_KEYS.ui,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        utilityPanelOpen: state.utilityPanelOpen,
      }),
      skipHydration: true,
    },
  ),
);

/** Controlled open-state helper for dialogs driven by the store. */
export function useOverlay(id: OverlayId) {
  const open = useUIStore((state) => state.overlay === id);
  const openOverlay = useUIStore((state) => state.openOverlay);
  const closeOverlay = useUIStore((state) => state.closeOverlay);
  return {
    open,
    onOpenChange: (next: boolean) => (next ? openOverlay(id) : closeOverlay()),
  };
}
