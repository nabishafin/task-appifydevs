"use client";

import { ExternalLink, Keyboard, MoreHorizontal, PanelRight, SquarePen, SquareStack, X } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/shared/logo";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ModelSelector } from "@/features/models/components/model-selector";
import type { ExtensionLayout } from "@/types/extension";

interface ExtensionHeaderProps {
  modelId: string;
  onModelChange: (modelId: string) => void;
  onNewChat: () => void;
  layout: ExtensionLayout;
  onLayoutChange: (layout: ExtensionLayout) => void;
  onOpenShortcuts: () => void;
  onClose: () => void;
}

export function ExtensionHeader({
  modelId,
  onModelChange,
  onNewChat,
  layout,
  onLayoutChange,
  onOpenShortcuts,
  onClose,
}: ExtensionHeaderProps) {
  const otherLayout: ExtensionLayout = layout === "popup" ? "sidebar" : "popup";

  return (
    <header className="flex h-12 shrink-0 items-center gap-1.5 border-b border-border bg-background-subtle px-3">
      <div className="flex min-w-0 items-center gap-2">
        <LogoMark className="size-6" />
        <span className="truncate text-sm font-semibold tracking-tight">EchoGPT</span>
      </div>
      <div className="ml-auto flex items-center gap-0.5">
        <ModelSelector value={modelId} onValueChange={onModelChange} variant="compact" align="end" side="bottom" />
        <TooltipIconButton label="New chat" side="bottom" onClick={onNewChat}>
          <SquarePen aria-hidden="true" />
        </TooltipIconButton>
        <DropdownMenu>
          <TooltipIconButton label="More options" side="bottom" asMenuTrigger>
            <MoreHorizontal aria-hidden="true" />
          </TooltipIconButton>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onSelect={() => onLayoutChange(otherLayout)}>
              {otherLayout === "sidebar" ? <PanelRight aria-hidden="true" /> : <SquareStack aria-hidden="true" />}
              {otherLayout === "sidebar" ? "Dock as sidebar" : "Show as popup"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onOpenShortcuts}>
              <Keyboard aria-hidden="true" />
              Keyboard shortcuts
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app">
                <ExternalLink aria-hidden="true" />
                Open web app
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onClose}>
              <X aria-hidden="true" />
              Close panel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
