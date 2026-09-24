"use client";

import { PanelRight, SquareStack } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { LogoMark } from "@/components/shared/logo";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { BrowserFrame } from "@/components/shared/browser-frame";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DEMO_PAGE, QUICK_ACTIONS } from "@/data/extension";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useExtensionStore } from "@/store/extension-store";
import type { ExtensionLayout } from "@/types/extension";
import { ExtensionShell } from "./extension-shell";
import { MockWebPage } from "./mock-web-page";

const LAYOUT_OPTIONS = [
  { value: "popup", label: "Popup", icon: SquareStack },
  { value: "sidebar", label: "Sidebar", icon: PanelRight },
] as const satisfies ReadonlyArray<{ value: ExtensionLayout; label: string; icon: typeof PanelRight }>;

const PANEL_ID = "echogpt-extension-panel";

export function ExtensionDemo() {
  const layout = useExtensionStore((state) => state.layout);
  const setLayout = useExtensionStore((state) => state.setLayout);
  const popupOpen = useExtensionStore((state) => state.popupOpen);
  const setPopupOpen = useExtensionStore((state) => state.setPopupOpen);
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  const panelVisible = popupOpen || !isDesktop;

  useEffect(() => {
    void useExtensionStore.persist.rehydrate();
  }, []);

  // Alt+E (⌘⇧E on macOS) toggles the panel, as the real extension command would.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const alt = event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyE";
      const mod = (event.metaKey || event.ctrlKey) && event.shiftKey && event.code === "KeyE";
      if (!alt && !mod) return;
      event.preventDefault();
      const state = useExtensionStore.getState();
      state.setPopupOpen(!state.popupOpen);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function closePanel() {
    if (isDesktop) setPopupOpen(false);
    else
      toast.info("On a phone the demo always shows the panel", {
        description: "Open this page on a wider screen to see it in a browser.",
      });
  }

  function askAboutSelection() {
    const action = QUICK_ACTIONS.find((item) => item.id === "explain-selection");
    const state = useExtensionStore.getState();
    state.setPopupOpen(true);
    if (!action) return;
    if (state.pendingConversationId) {
      toast.info("EchoGPT is still answering", { description: "Try again once the current response finishes." });
      return;
    }
    void state.runQuickAction(action);
  }

  const toolbar = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={popupOpen ? "Hide EchoGPT extension" : "Show EchoGPT extension"}
          aria-expanded={popupOpen}
          aria-controls={PANEL_ID}
          onClick={() => setPopupOpen(!popupOpen)}
          className={cn("size-7", popupOpen && "bg-muted")}
        >
          <LogoMark className="h-4.5 w-auto" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">EchoGPT</TooltipContent>
    </Tooltip>
  );

  const isSidebar = layout === "sidebar";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          id="extension-layout"
          label="Extension layout"
          value={layout}
          onValueChange={setLayout}
          options={LAYOUT_OPTIONS}
          className="max-md:hidden"
        />
        <p className="text-xs text-muted-foreground max-md:hidden">
          Tip: select text on any page, or press <span className="font-medium text-foreground">Alt + E</span> to toggle
          the panel.
        </p>
        <p className="text-sm text-muted-foreground md:hidden">
          Showing the extension panel as it appears in Chrome. Open on a larger screen to see it beside a page.
        </p>
      </div>

      <BrowserFrame
        url={DEMO_PAGE.url.replace("https://", "")}
        toolbar={toolbar}
        className="max-md:rounded-lg max-md:[&>div:first-child]:hidden"
        contentClassName="flex h-[600px] md:h-[660px]"
      >
        <div className={cn("hidden min-w-0 flex-1 md:block", isSidebar && panelVisible && "border-r border-border")}>
          <MockWebPage onAskSelection={askAboutSelection} />
        </div>

        {!panelVisible && (
          <p className="pointer-events-none absolute top-3 right-3 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm">
            Click the EchoGPT icon in the toolbar to open the extension.
          </p>
        )}
        <AnimatePresence initial={false}>
          {panelVisible &&
            (isSidebar ? (
              <m.div
                key="sidebar"
                id={PANEL_ID}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: isDesktop ? 400 : "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="h-full shrink-0 overflow-hidden max-md:w-full!"
              >
                <ExtensionShell onClose={closePanel} className="w-full md:w-[400px]" />
              </m.div>
            ) : (
              <m.div
                key="popup"
                id={PANEL_ID}
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                style={{ transformOrigin: "top right" }}
                className="h-full w-full overflow-hidden md:absolute md:top-2 md:right-3 md:h-[600px] md:w-[380px] md:rounded-lg md:border md:border-border md:shadow-lg"
              >
                <ExtensionShell onClose={closePanel} />
              </m.div>
            ))}
        </AnimatePresence>
      </BrowserFrame>
    </div>
  );
}
