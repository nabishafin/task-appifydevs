import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useChatStore } from "@/store/chat-store";

const initialState = useChatStore.getState();

describe("chat store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useChatStore.setState({ ...initialState, conversations: [], activeConversationId: null }, true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a conversation and appends a mock reply", async () => {
    useChatStore.getState().selectModel("claude-haiku-4-5");
    const sending = useChatStore.getState().sendMessage("Summarize this article");

    const pending = useChatStore.getState();
    expect(pending.conversations).toHaveLength(1);
    expect(pending.pendingConversationId).toBe(pending.activeConversationId);

    await vi.runAllTimersAsync();
    await sending;

    const [conversation] = useChatStore.getState().conversations;
    expect(conversation.title).toBe("Summarize this article");
    expect(conversation.messages.map((message) => message.role)).toEqual(["user", "assistant"]);
    const reply = conversation.messages[1];
    expect(reply.role === "assistant" && reply.modelId).toBe("claude-haiku-4-5");
    expect(useChatStore.getState().pendingConversationId).toBeNull();
  });

  it("ignores empty messages", async () => {
    await useChatStore.getState().sendMessage("   ");
    expect(useChatStore.getState().conversations).toHaveLength(0);
  });

  it("stops generating without adding a reply", async () => {
    const sending = useChatStore.getState().sendMessage("Hello there");
    useChatStore.getState().stopGenerating();
    await vi.runAllTimersAsync();
    await sending;

    const [conversation] = useChatStore.getState().conversations;
    expect(conversation.messages).toHaveLength(1);
    expect(useChatStore.getState().pendingConversationId).toBeNull();
  });

  it("toggles favorites and deletes conversations", async () => {
    const sending = useChatStore.getState().sendMessage("Plan my week");
    await vi.runAllTimersAsync();
    await sending;
    const id = useChatStore.getState().conversations[0].id;

    useChatStore.getState().toggleFavorite(id);
    expect(useChatStore.getState().conversations[0].isFavorite).toBe(true);

    useChatStore.getState().deleteConversation(id);
    expect(useChatStore.getState().conversations).toHaveLength(0);
    expect(useChatStore.getState().activeConversationId).toBeNull();
  });
});
