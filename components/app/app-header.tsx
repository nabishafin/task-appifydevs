"use client";

import { Keyboard, Menu, PanelRight, Search, SquarePen, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { APP_PAGE_TITLES } from "@/constants/app-navigation";
import { useStartNewChat } from "@/features/chat/hooks/use-start-new-chat";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";
import { selectActiveConversation, useChatStore } from "@/store/chat-store";
import { useUIStore } from "@/store/ui-store";

export function AppHeader() {
  const pathname = usePathname();
  const hydrated = useStoreHydrated(useChatStore);
  const activeConversation = useChatStore(selectActiveConversation);
  const toggleFavorite = useChatStore((state) => state.toggleFavorite);
  const startNewChat = useStartNewChat();
  const setMobileSidebarOpen = useUIStore((state) => state.setMobileSidebarOpen);
  const openOverlay = useUIStore((state) => state.openOverlay);
  const utilityPanelOpen = useUIStore((state) => state.utilityPanelOpen);
  const toggleUtilityPanel = useUIStore((state) => state.toggleUtilityPanel);

  const isChat = pathname === "/app";
  const conversation = isChat && hydrated ? activeConversation : undefined;
  const title = isChat ? (conversation?.title ?? "New chat") : (APP_PAGE_TITLES[pathname] ?? "EchoGPT");

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 sm:px-6 lg:px-8">
      <TooltipIconButton label="Open navigation" className="md:hidden" onClick={() => setMobileSidebarOpen(true)}>
        <Menu aria-hidden="true" />
      </TooltipIconButton>

      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <h1 className="truncate text-sm font-medium text-foreground">{title}</h1>
        {conversation && (
          <TooltipIconButton
            label={conversation.isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={conversation.isFavorite}
            size="icon-xs"
            onClick={() => toggleFavorite(conversation.id)}
            className={cn(conversation.isFavorite && "text-warning hover:text-warning")}
          >
            <Star className={cn(conversation.isFavorite && "fill-current")} aria-hidden="true" />
          </TooltipIconButton>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        <TooltipIconButton label="Search" shortcut={["mod", "K"]} onClick={() => openOverlay("command")}>
          <Search aria-hidden="true" />
        </TooltipIconButton>
        <TooltipIconButton
          label="Keyboard shortcuts"
          shortcut={["mod", "/"]}
          className="hidden sm:inline-flex"
          onClick={() => openOverlay("shortcuts")}
        >
          <Keyboard aria-hidden="true" />
        </TooltipIconButton>
        <ThemeToggle />
        {isChat && (
          <TooltipIconButton
            label={utilityPanelOpen ? "Hide details panel" : "Show details panel"}
            aria-pressed={utilityPanelOpen}
            className="hidden xl:inline-flex"
            onClick={toggleUtilityPanel}
          >
            <PanelRight aria-hidden="true" />
          </TooltipIconButton>
        )}
        <TooltipIconButton label="New chat" className="md:hidden" onClick={() => startNewChat()}>
          <SquarePen aria-hidden="true" />
        </TooltipIconButton>
      </div>
    </header>
  );
}
