import { getModel } from "@/data/models";
import { matchesQuery, truncate } from "@/lib/utils";
import type { ChatMessage, Conversation, ConversationTag } from "@/types/chat";

export interface ConversationFilters {
  query?: string;
  modelId?: string | "all";
  tag?: ConversationTag | "all";
  favoritesOnly?: boolean;
}

export interface ConversationSearchResult {
  conversation: Conversation;
  snippet: string;
}

function messageText(message: ChatMessage): string {
  if (message.role === "user") return message.content;
  return message.blocks
    .map((block) => {
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "code") return block.code;
      return block.text;
    })
    .join(" ");
}

function clean(text: string): string {
  return text
    .replace(/\*\*|`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Returns a short excerpt around the first matching term, or the latest message. */
function buildSnippet(conversation: Conversation, query: string): string {
  const texts = conversation.messages.map((message) => clean(messageText(message)));
  const term = query.toLowerCase().trim().split(/\s+/)[0];

  if (term) {
    for (const text of texts) {
      const index = text.toLowerCase().indexOf(term);
      if (index !== -1) {
        const start = Math.max(0, index - 30);
        return `${start > 0 ? "…" : ""}${truncate(text.slice(start), 110)}`;
      }
    }
  }
  return truncate(texts.at(-1) ?? "No messages yet", 110);
}

/** Filters and ranks conversations by recency; searches titles, model names and message bodies. */
export function searchConversations(
  conversations: Conversation[],
  { query = "", modelId = "all", tag = "all", favoritesOnly = false }: ConversationFilters,
): ConversationSearchResult[] {
  return conversations
    .filter((conversation) => {
      if (favoritesOnly && !conversation.isFavorite) return false;
      if (modelId !== "all" && conversation.modelId !== modelId) return false;
      if (tag !== "all" && conversation.tag !== tag) return false;
      return matchesQuery(query, [
        conversation.title,
        getModel(conversation.modelId).name,
        ...conversation.messages.map(messageText),
      ]);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((conversation) => ({ conversation, snippet: buildSnippet(conversation, query) }));
}
