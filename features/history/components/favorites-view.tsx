"use client";

import { BookOpen, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { ConversationItem } from "@/components/app/conversation-item";
import { EmptyState, SkeletonLoader } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROMPT_TEMPLATES } from "@/data/prompts";
import { PromptCard } from "@/features/prompts/components/prompt-card";
import { UsePromptDialog } from "@/features/prompts/components/use-prompt-dialog";
import { usePromptLauncher } from "@/features/prompts/hooks/use-prompt-launcher";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useChatStore } from "@/store/chat-store";
import { usePromptStore } from "@/store/prompt-store";

export function FavoritesView() {
  const chatHydrated = useStoreHydrated(useChatStore);
  const promptsHydrated = useStoreHydrated(usePromptStore);
  const conversations = useChatStore((state) => state.conversations);
  const favoritePromptIds = usePromptStore((state) => state.favoritePromptIds);
  const customPrompts = usePromptStore((state) => state.customPrompts);
  const toggleFavoritePrompt = usePromptStore((state) => state.toggleFavoritePrompt);
  const { launch, dialogProps } = usePromptLauncher();

  const favoriteConversations = conversations
    .filter((conversation) => conversation.isFavorite)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const favoritePrompts = [...customPrompts, ...PROMPT_TEMPLATES].filter((prompt) =>
    favoritePromptIds.includes(prompt.id),
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Favorites</h2>
        <p className="mt-1 text-sm text-muted-foreground">The answers and prompts you come back to, in one place.</p>
      </div>

      <Tabs defaultValue="conversations" className="gap-5">
        <TabsList>
          <TabsTrigger value="conversations">
            <MessageSquare aria-hidden="true" />
            Conversations
            {chatHydrated && <span className="text-xs text-muted-foreground">{favoriteConversations.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="prompts">
            <BookOpen aria-hidden="true" />
            Prompts
            {promptsHydrated && <span className="text-xs text-muted-foreground">{favoritePrompts.length}</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          {!chatHydrated ? (
            <SkeletonLoader variant="list" count={3} />
          ) : favoriteConversations.length === 0 ? (
            <EmptyState
              icon={Star}
              title="No favorite conversations"
              description="Use the star in a conversation's menu or header to keep it here."
              action={
                <Button asChild variant="outline">
                  <Link href="/app/history">Browse history</Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-2">
              {favoriteConversations.map((conversation) => (
                <li key={conversation.id}>
                  <ConversationItem conversation={conversation} variant="row" />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="prompts">
          {!promptsHydrated ? (
            <SkeletonLoader variant="cards" count={2} />
          ) : favoritePrompts.length === 0 ? (
            <EmptyState
              icon={Star}
              title="No favorite prompts"
              description="Star prompts in the library to keep them one click away."
              action={
                <Button asChild variant="outline">
                  <Link href="/app/prompts">Open prompt library</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoritePrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isFavorite
                  onToggleFavorite={toggleFavoritePrompt}
                  onUse={launch}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <UsePromptDialog {...dialogProps} />
    </div>
  );
}
