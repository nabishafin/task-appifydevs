"use client";

import { PanelLeftClose, PanelLeftOpen, Search, SquarePen, Zap } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RecentConversations } from "@/components/app/recent-conversations";
import { UserMenu } from "@/components/app/user-menu";
import { Logo } from "@/components/shared/logo";
import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_NAV, isNavItemActive, SETTINGS_NAV_ITEM, type AppNavItem } from "@/constants/app-navigation";
import { useStartNewChat } from "@/features/chat/hooks/use-start-new-chat";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

interface SidebarContentProps {
  collapsed?: boolean;
  /** Called after navigation, used by the mobile drawer to close itself. */
  onNavigate?: () => void;
  /** Desktop only: shows the collapse toggle. */
  collapsible?: boolean;
  /** Distinguishes the animated active indicator between desktop and mobile instances. */
  layoutScope: string;
}

function SidebarNavLink({
  item,
  active,
  collapsed,
  layoutScope,
  onNavigate,
}: {
  item: AppNavItem;
  active: boolean;
  collapsed: boolean;
  layoutScope: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        "relative flex h-9 items-center gap-2.5 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        collapsed ? "w-9 justify-center" : "px-2.5",
        active ? "text-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      {active && (
        <m.span
          layoutId={`${layoutScope}-nav-active`}
          aria-hidden="true"
          className="absolute inset-0 rounded-lg border border-border bg-card shadow-xs"
        />
      )}
      <Icon className={cn("relative size-4 shrink-0", active && "text-primary-text")} aria-hidden="true" />
      {!collapsed && <span className="relative truncate">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export function SidebarContent({
  collapsed = false,
  onNavigate,
  collapsible = false,
  layoutScope,
}: SidebarContentProps) {
  const pathname = usePathname();
  const startNewChat = useStartNewChat();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const openOverlay = useUIStore((state) => state.openOverlay);

  function handleNewChat() {
    startNewChat();
    onNavigate?.();
  }

  function handleSearch() {
    onNavigate?.();
    openOverlay("search");
  }

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-14 shrink-0 items-center px-3", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && <Logo href="/" />}
        {collapsible && (
          <TooltipIconButton
            label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            shortcut={["mod", "B"]}
            side="right"
            onClick={toggleSidebar}
          >
            {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
          </TooltipIconButton>
        )}
      </div>

      <div className={cn("space-y-1 px-2", collapsed && "flex flex-col items-center")}>
        {collapsed ? (
          <>
            <TooltipIconButton
              label="New chat"
              shortcut={["mod", "Shift", "O"]}
              side="right"
              size="icon"
              variant="outline"
              onClick={handleNewChat}
            >
              <SquarePen aria-hidden="true" />
            </TooltipIconButton>
            <TooltipIconButton label="Search" shortcut={["mod", "K"]} side="right" size="icon" onClick={handleSearch}>
              <Search aria-hidden="true" />
            </TooltipIconButton>
          </>
        ) : (
          <>
            <Button variant="outline" className="w-full justify-start bg-card" onClick={handleNewChat}>
              <SquarePen aria-hidden="true" />
              New chat
              <ShortcutKeys keys={["mod", "Shift", "O"]} className="ml-auto max-md:hidden" />
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSearch}>
              <Search aria-hidden="true" />
              Search chats
              <ShortcutKeys keys={["mod", "K"]} className="ml-auto max-md:hidden" />
            </Button>
          </>
        )}
      </div>

      <nav aria-label="Workspace" className={cn("mt-4 px-2", collapsed && "flex flex-col items-center")}>
        <ul className={cn("space-y-0.5", collapsed && "flex flex-col items-center")}>
          {APP_NAV.map((item) => (
            <li key={item.href}>
              <SidebarNavLink
                item={item}
                active={isNavItemActive(item, pathname)}
                collapsed={collapsed}
                layoutScope={layoutScope}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </nav>

      {collapsed ? (
        <div className="flex-1" />
      ) : (
        <div className="mt-5 min-h-0 flex-1 thin-scrollbar overflow-y-auto px-2 pb-2">
          <h2 className="sr-only">Recent conversations</h2>
          <RecentConversations onNavigate={onNavigate} />
        </div>
      )}

      <div
        className={cn(
          "shrink-0 space-y-1 border-t border-sidebar-border p-2",
          collapsed && "flex flex-col items-center",
        )}
      >
        {collapsed ? (
          <TooltipIconButton
            label="Upgrade to Pro"
            side="right"
            size="icon"
            onClick={() => openOverlay("upgrade")}
            className="text-primary-text"
          >
            <Zap aria-hidden="true" />
          </TooltipIconButton>
        ) : (
          <button
            type="button"
            onClick={() => openOverlay("upgrade")}
            className="group/upgrade flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary-text">
              <Zap className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">Upgrade to Pro</span>
              <span className="block truncate text-xs text-muted-foreground">Every model, no daily limits</span>
            </span>
          </button>
        )}
        <SidebarNavLink
          item={SETTINGS_NAV_ITEM}
          active={isNavItemActive(SETTINGS_NAV_ITEM, pathname)}
          collapsed={collapsed}
          layoutScope={layoutScope}
          onNavigate={onNavigate}
        />
        <UserMenu collapsed={collapsed} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
