"use client";

import { MessageSquareDashed } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ConversationItem } from "@/components/app/conversation-item";
import { EmptyState, SkeletonLoader } from "@/components/shared/states";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { groupByDate } from "@/lib/format";
import { useChatStore } from "@/store/chat-store";

const MAX_RECENT = 20;

export function RecentConversations({ onNavigate }: { onNavigate?: () => void }) {
  const hydrated = useStoreHydrated(useChatStore);
  const conversations = useChatStore((state) => state.conversations);
  const activeId = useChatStore((state) => state.activeConversationId);
  // Only highlight the open conversation while the chat view is actually showing.
  const isChatRoute = usePathname() === "/app";

  const groups = useMemo(() => {
    const recent = [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, MAX_RECENT);
    return groupByDate(recent, (conversation) => conversation.updatedAt);
  }, [conversations]);

  if (!hydrated) return <SkeletonLoader variant="list" count={5} className="px-2" />;

  if (groups.length === 0) {
    return (
      <EmptyState
        size="sm"
        icon={MessageSquareDashed}
        title="No conversations yet"
        description="Your chats will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {groups.map(({ group, items }) => (
        <section key={group} aria-label={group}>
          <h3 className="px-2 pb-1 text-[11px] font-medium tracking-wide text-subtle-foreground uppercase">{group}</h3>
          <ul className="space-y-px">
            {items.map((conversation) => (
              <li key={conversation.id}>
                <ConversationItem
                  conversation={conversation}
                  active={isChatRoute && conversation.id === activeId}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
