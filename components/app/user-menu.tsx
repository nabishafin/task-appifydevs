"use client";

import { ChevronsUpDown, ExternalLink, Keyboard, LogOut, Puzzle, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/constants/site";
import { DEMO_USER } from "@/data/user";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferences-store";
import { useUIStore } from "@/store/ui-store";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserMenu({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const openOverlay = useUIStore((state) => state.openOverlay);
  // The profile name comes from settings (or sign-up), so edits show up here immediately.
  const { displayName, email } = usePreferencesStore((state) => state.profile);
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${displayName}`}
        className={cn(
          "flex items-center gap-2.5 rounded-lg text-left transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-ring/40 data-[state=open]:bg-sidebar-accent",
          collapsed ? "size-9 justify-center" : "w-full p-1.5",
        )}
      >
        <Avatar className="size-7 rounded-lg">
          <AvatarFallback className="rounded-lg bg-primary/15 text-xs font-semibold text-primary-text">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{displayName}</span>
              <span className="block truncate text-xs text-muted-foreground">{DEMO_USER.plan}</span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side={collapsed ? "right" : "top"} align="start" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-sm font-medium text-foreground">{displayName}</span>
          <span className="block text-xs text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/settings?section=general" onClick={onNavigate}>
            <UserRound aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openOverlay("shortcuts")}>
          <Keyboard aria-hidden="true" />
          Keyboard shortcuts
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/extension">
            <Puzzle aria-hidden="true" />
            Chrome extension
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/">
            <ExternalLink aria-hidden="true" />
            EchoGPT website
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            toast.success("Signed out", { description: "Your demo data stays saved in this browser." });
            router.push(siteConfig.links.signIn);
          }}
        >
          <LogOut aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
