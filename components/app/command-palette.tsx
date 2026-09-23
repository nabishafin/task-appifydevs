"use client";

import { Columns2, Keyboard, MessageSquare, Monitor, Moon, PanelLeft, SquarePen, Sun, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ModelIcon } from "@/components/shared/model-icon";
import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { APP_NAV, SETTINGS_NAV_ITEM } from "@/constants/app-navigation";
import { getProvider, MODELS } from "@/data/models";
import { useStartNewChat } from "@/features/chat/hooks/use-start-new-chat";
import { useChatStore } from "@/store/chat-store";
import { useThemeStore } from "@/store/theme-store";
import { useOverlay, useUIStore } from "@/store/ui-store";
import type { ThemePreference } from "@/types/settings";

const THEME_COMMANDS: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Switch to light theme", icon: Sun },
  { value: "dark", label: "Switch to dark theme", icon: Moon },
  { value: "system", label: "Use system theme", icon: Monitor },
];

export function CommandPalette() {
  const router = useRouter();
  const { open, onOpenChange } = useOverlay("command");
  const openOverlay = useUIStore((state) => state.openOverlay);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const conversations = useChatStore((state) => state.conversations);
  const selectModel = useChatStore((state) => state.selectModel);
  const startNewChat = useStartNewChat();
  const openConversation = useChatStore((state) => state.openConversation);
  const setTheme = useThemeStore((state) => state.setTheme);

  const recent = [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  /** Closes the palette, then runs the command. */
  function run(action: () => void) {
    onOpenChange(false);
    action();
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command palette"
      description="Search for actions, pages, models and conversations"
      className="sm:max-w-xl"
    >
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList className="max-h-[min(26rem,60vh)]">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => run(() => startNewChat())}>
              <SquarePen aria-hidden="true" />
              New chat
              <ShortcutKeys keys={["mod", "Shift", "O"]} className="ml-auto" />
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/app/compare"))}>
              <Columns2 aria-hidden="true" />
              Compare two models
            </CommandItem>
            <CommandItem onSelect={() => run(toggleSidebar)}>
              <PanelLeft aria-hidden="true" />
              Toggle sidebar
              <ShortcutKeys keys={["mod", "B"]} className="ml-auto" />
            </CommandItem>
            <CommandItem onSelect={() => run(() => openOverlay("shortcuts"))}>
              <Keyboard aria-hidden="true" />
              Keyboard shortcuts
              <ShortcutKeys keys={["mod", "/"]} className="ml-auto" />
            </CommandItem>
            <CommandItem onSelect={() => run(() => openOverlay("upgrade"))}>
              <Zap aria-hidden="true" />
              Upgrade to Pro
            </CommandItem>
          </CommandGroup>

          {recent.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recent conversations">
                {recent.map((conversation) => (
                  <CommandItem
                    key={conversation.id}
                    value={`conversation ${conversation.title}`}
                    onSelect={() =>
                      run(() => {
                        openConversation(conversation.id);
                        router.push("/app");
                      })
                    }
                  >
                    <MessageSquare aria-hidden="true" />
                    <span className="truncate">{conversation.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          <CommandGroup heading="Switch model">
            {MODELS.map((model) => (
              <CommandItem
                key={model.id}
                value={`model ${model.name} ${getProvider(model.providerId).name}`}
                onSelect={() =>
                  run(() => {
                    selectModel(model.id);
                    toast.success(`Switched to ${model.name}`);
                  })
                }
              >
                <ModelIcon providerId={model.providerId} size="xs" />
                {model.name}
                <span className="ml-auto text-xs text-muted-foreground">{getProvider(model.providerId).name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Go to">
            {[...APP_NAV, SETTINGS_NAV_ITEM].map((item) => (
              <CommandItem
                key={item.href}
                value={`go ${item.label}`}
                onSelect={() => run(() => router.push(item.href))}
              >
                <item.icon aria-hidden="true" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Theme">
            {THEME_COMMANDS.map(({ value, label, icon: Icon }) => (
              <CommandItem key={value} onSelect={() => run(() => setTheme(value))}>
                <Icon aria-hidden="true" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
