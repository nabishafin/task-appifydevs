import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage";
import { createSeedConversations } from "@/data/conversations";
import { DEFAULT_MODEL_ID } from "@/data/models";
import { deriveConversationTitle, requestCompletion } from "@/features/chat/lib/mock-responder";
import { createId } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferences-store";
import type {
  AssistantMessage,
  Attachment,
  ChatMessage,
  Conversation,
  MessageFeedback,
  UserMessage,
} from "@/types/chat";
import type { ResponseStyle } from "@/types/settings";

interface SendOptions {
  attachments?: Attachment[];
  style?: ResponseStyle;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectedModelId: string;
  /** Conversation currently waiting for a model response. */
  pendingConversationId: string | null;

  selectModel: (modelId: string) => void;
  /** Clears the active conversation; optionally switches to the given model. */
  startNewChat: (modelId?: string) => void;
  openConversation: (id: string) => void;
  sendMessage: (content: string, options?: SendOptions) => Promise<void>;
  regenerate: (conversationId: string, messageId: string, style?: ResponseStyle) => Promise<void>;
  stopGenerating: () => void;
  setFeedback: (conversationId: string, messageId: string, feedback: MessageFeedback | undefined) => void;
  toggleFavorite: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  clearHistory: () => void;
}

// Kept outside the store: an AbortController is not serializable state.
let activeRequest: AbortController | null = null;

function now() {
  return new Date().toISOString();
}

function updateConversation(
  conversations: Conversation[],
  id: string,
  update: (conversation: Conversation) => Conversation,
) {
  return conversations.map((conversation) => (conversation.id === id ? update(conversation) : conversation));
}

function lastUserPrompt(messages: ChatMessage[], beforeIndex: number): string {
  for (let index = beforeIndex - 1; index >= 0; index--) {
    const message = messages[index];
    if (message.role === "user") return message.content;
  }
  return "";
}

async function runCompletion(
  get: () => ChatState,
  set: (partial: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>)) => void,
  conversationId: string,
  prompt: string,
  modelId: string,
  style?: ResponseStyle,
): Promise<AssistantMessage | null> {
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  set({ pendingConversationId: conversationId });

  try {
    const blocks = await requestCompletion({ prompt, modelId, style, signal: controller.signal });
    return { id: createId("m"), role: "assistant", modelId, blocks, status: "complete", createdAt: now() };
  } catch (error) {
    if (controller.signal.aborted) return null;
    return {
      id: createId("m"),
      role: "assistant",
      modelId,
      blocks: [],
      status: "error",
      errorMessage: error instanceof Error ? error.message : "Something went wrong.",
      createdAt: now(),
    };
  } finally {
    if (activeRequest === controller) {
      activeRequest = null;
      if (get().pendingConversationId === conversationId) set({ pendingConversationId: null });
    }
  }
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: createSeedConversations(),
      activeConversationId: null,
      selectedModelId: DEFAULT_MODEL_ID,
      pendingConversationId: null,

      selectModel: (selectedModelId) => set({ selectedModelId }),

      startNewChat: (modelId) => {
        get().stopGenerating();
        set((state) => ({ activeConversationId: null, selectedModelId: modelId ?? state.selectedModelId }));
      },

      openConversation: (id) => {
        const conversation = get().conversations.find((item) => item.id === id);
        if (!conversation) return;
        set({ activeConversationId: id, selectedModelId: conversation.modelId });
      },

      sendMessage: async (content, options = {}) => {
        const text = content.trim();
        if (!text || get().pendingConversationId) return;

        const { selectedModelId } = get();
        const userMessage: UserMessage = {
          id: createId("m"),
          role: "user",
          content: text,
          attachments: options.attachments,
          createdAt: now(),
        };

        let conversationId = get().activeConversationId;
        if (!conversationId) {
          conversationId = createId("c");
          const conversation: Conversation = {
            id: conversationId,
            title: deriveConversationTitle(text),
            modelId: selectedModelId,
            messages: [userMessage],
            isFavorite: false,
            createdAt: now(),
            updatedAt: now(),
          };
          set((state) => ({
            conversations: [conversation, ...state.conversations],
            activeConversationId: conversationId,
          }));
        } else {
          set((state) => ({
            conversations: updateConversation(state.conversations, conversationId!, (conversation) => ({
              ...conversation,
              modelId: selectedModelId,
              messages: [...conversation.messages, userMessage],
              updatedAt: now(),
            })),
          }));
        }

        const reply = await runCompletion(get, set, conversationId, text, selectedModelId, options.style);
        if (!reply) return;
        set((state) => ({
          conversations: updateConversation(state.conversations, conversationId!, (conversation) => ({
            ...conversation,
            messages: [...conversation.messages, reply],
            updatedAt: now(),
          })),
        }));
      },

      regenerate: async (conversationId, messageId, style) => {
        if (get().pendingConversationId) return;
        const conversation = get().conversations.find((item) => item.id === conversationId);
        if (!conversation) return;

        const index = conversation.messages.findIndex((message) => message.id === messageId);
        if (index === -1) return;
        const prompt = lastUserPrompt(conversation.messages, index);
        const modelId = get().selectedModelId;

        // Drop the old answer (and anything after it) so the new one replaces it in place.
        set((state) => ({
          conversations: updateConversation(state.conversations, conversationId, (item) => ({
            ...item,
            messages: item.messages.slice(0, index),
          })),
        }));

        const reply = await runCompletion(get, set, conversationId, prompt, modelId, style);
        if (!reply) return;
        set((state) => ({
          conversations: updateConversation(state.conversations, conversationId, (item) => ({
            ...item,
            messages: [...item.messages, reply],
            updatedAt: now(),
          })),
        }));
      },

      stopGenerating: () => {
        activeRequest?.abort();
        activeRequest = null;
        set({ pendingConversationId: null });
      },

      setFeedback: (conversationId, messageId, feedback) =>
        set((state) => ({
          conversations: updateConversation(state.conversations, conversationId, (conversation) => ({
            ...conversation,
            messages: conversation.messages.map((message) =>
              message.id === messageId && message.role === "assistant" ? { ...message, feedback } : message,
            ),
          })),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          conversations: updateConversation(state.conversations, id, (conversation) => ({
            ...conversation,
            isFavorite: !conversation.isFavorite,
          })),
        })),

      renameConversation: (id, title) =>
        set((state) => ({
          conversations: updateConversation(state.conversations, id, (conversation) => ({
            ...conversation,
            title: title.trim() || conversation.title,
          })),
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((conversation) => conversation.id !== id),
          activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
        })),

      clearHistory: () => {
        get().stopGenerating();
        set({ conversations: [], activeConversationId: null });
      },
    }),
    {
      name: STORAGE_KEYS.chat,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Respect Settings → Privacy → "Save conversation history".
      partialize: (state) =>
        usePreferencesStore.getState().privacy.saveHistory
          ? {
              conversations: state.conversations,
              activeConversationId: state.activeConversationId,
              selectedModelId: state.selectedModelId,
            }
          : { selectedModelId: state.selectedModelId },
      skipHydration: true,
    },
  ),
);

export function selectActiveConversation(state: ChatState): Conversation | undefined {
  return state.conversations.find((conversation) => conversation.id === state.activeConversationId);
}
