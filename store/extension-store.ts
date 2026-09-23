import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage";
import { createExtensionSeedConversations, DEFAULT_EXTENSION_SETTINGS, DEMO_PAGE } from "@/data/extension";
import { getModel } from "@/data/models";
import { deriveConversationTitle, requestCompletion } from "@/features/chat/lib/mock-responder";
import { createId } from "@/lib/utils";
import type { AssistantMessage, Attachment, Conversation, MessageFeedback, UserMessage } from "@/types/chat";
import type { ExtensionLayout, ExtensionSettings, ExtensionView, QuickAction } from "@/types/extension";

interface ExtensionState {
  view: ExtensionView;
  layout: ExtensionLayout;
  /** Whether the popup or sidebar panel is shown in the demo browser. */
  popupOpen: boolean;
  modelId: string;
  conversations: Conversation[];
  activeConversationId: string | null;
  pendingConversationId: string | null;
  /** Composer text, shared so the prompt library can fill it. Not persisted. */
  draft: string;
  settings: ExtensionSettings;

  setView: (view: ExtensionView) => void;
  setLayout: (layout: ExtensionLayout) => void;
  setPopupOpen: (open: boolean) => void;
  selectModel: (modelId: string) => void;
  setDraft: (draft: string) => void;
  startNewChat: () => void;
  openConversation: (id: string) => void;
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  runQuickAction: (action: QuickAction) => Promise<void>;
  regenerate: (messageId: string) => Promise<void>;
  stopGenerating: () => void;
  setFeedback: (messageId: string, feedback: MessageFeedback | undefined) => void;
  deleteConversation: (id: string) => void;
  clearHistory: () => void;
  updateSettings: (patch: Partial<ExtensionSettings>) => void;
}

let activeRequest: AbortController | null = null;

function now() {
  return new Date().toISOString();
}

function mapConversation(
  conversations: Conversation[],
  id: string,
  update: (conversation: Conversation) => Conversation,
) {
  return conversations.map((conversation) => (conversation.id === id ? update(conversation) : conversation));
}

/** The message shown in the chat, including the selection or page it refers to. */
export function buildQuickActionMessage(action: QuickAction, settings: ExtensionSettings): string {
  const prompt =
    action.id === "translate" ? `Translate the selected text into ${settings.translateTo}.` : action.prompt;
  if (action.requiresSelection) return `${prompt}\n\n“${DEMO_PAGE.selection}”`;
  if (!settings.autoReadPage) return prompt;
  return `${prompt}\n\nPage: ${DEMO_PAGE.title}`;
}

type SetState = (partial: Partial<ExtensionState> | ((state: ExtensionState) => Partial<ExtensionState>)) => void;

async function complete(
  get: () => ExtensionState,
  set: SetState,
  conversationId: string,
  prompt: string,
  modelId: string,
) {
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  set({ pendingConversationId: conversationId });

  let reply: AssistantMessage | null;
  try {
    const blocks = await requestCompletion({
      prompt,
      modelId,
      style: get().settings.responseStyle,
      signal: controller.signal,
    });
    reply = { id: createId("m"), role: "assistant", modelId, blocks, status: "complete", createdAt: now() };
  } catch (error) {
    reply = controller.signal.aborted
      ? null
      : {
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

  if (!reply) return;
  const message = reply;
  set((state) => ({
    conversations: mapConversation(state.conversations, conversationId, (conversation) => ({
      ...conversation,
      messages: [...conversation.messages, message],
      updatedAt: now(),
    })),
  }));
}

export const useExtensionStore = create<ExtensionState>()(
  persist(
    (set, get) => ({
      view: "chat",
      layout: "popup",
      popupOpen: true,
      modelId: DEFAULT_EXTENSION_SETTINGS.defaultModelId,
      conversations: createExtensionSeedConversations(),
      activeConversationId: null,
      pendingConversationId: null,
      draft: "",
      settings: DEFAULT_EXTENSION_SETTINGS,

      setView: (view) => set({ view }),
      setLayout: (layout) => set({ layout, popupOpen: true }),
      setPopupOpen: (popupOpen) => set({ popupOpen }),
      selectModel: (modelId) => set({ modelId }),
      setDraft: (draft) => set({ draft }),

      startNewChat: () => {
        get().stopGenerating();
        set({ activeConversationId: null, view: "chat", draft: "", modelId: get().settings.defaultModelId });
      },

      openConversation: (id) => {
        const conversation = get().conversations.find((item) => item.id === id);
        if (!conversation) return;
        get().stopGenerating();
        set({ activeConversationId: id, modelId: conversation.modelId, view: "chat" });
      },

      sendMessage: async (content, attachments) => {
        const text = content.trim();
        if (!text || get().pendingConversationId) return;

        const { modelId } = get();
        const userMessage: UserMessage = {
          id: createId("m"),
          role: "user",
          content: text,
          attachments: attachments?.length ? attachments : undefined,
          createdAt: now(),
        };
        let conversationId = get().activeConversationId;

        if (conversationId && get().conversations.some((item) => item.id === conversationId)) {
          const id = conversationId;
          set((state) => ({
            conversations: mapConversation(state.conversations, id, (conversation) => ({
              ...conversation,
              modelId,
              messages: [...conversation.messages, userMessage],
              updatedAt: now(),
            })),
          }));
        } else {
          conversationId = createId("c");
          const conversation: Conversation = {
            id: conversationId,
            title: deriveConversationTitle(text),
            modelId,
            messages: [userMessage],
            isFavorite: false,
            createdAt: now(),
            updatedAt: now(),
          };
          set((state) => ({
            conversations: [conversation, ...state.conversations],
            activeConversationId: conversation.id,
          }));
        }

        set({ draft: "", view: "chat" });
        await complete(get, set, conversationId, text, modelId);
      },

      runQuickAction: (action) => get().sendMessage(buildQuickActionMessage(action, get().settings)),

      regenerate: async (messageId) => {
        const { activeConversationId, pendingConversationId, modelId, conversations } = get();
        if (!activeConversationId || pendingConversationId) return;
        const conversation = conversations.find((item) => item.id === activeConversationId);
        if (!conversation) return;
        const index = conversation.messages.findIndex((message) => message.id === messageId);
        if (index === -1) return;
        const prompt = conversation.messages
          .slice(0, index)
          .findLast((message): message is UserMessage => message.role === "user")?.content;
        if (!prompt) return;

        set((state) => ({
          conversations: mapConversation(state.conversations, activeConversationId, (item) => ({
            ...item,
            messages: item.messages.slice(0, index),
          })),
        }));
        await complete(get, set, activeConversationId, prompt, modelId);
      },

      stopGenerating: () => {
        activeRequest?.abort();
        activeRequest = null;
        set({ pendingConversationId: null });
      },

      setFeedback: (messageId, feedback) => {
        const id = get().activeConversationId;
        if (!id) return;
        set((state) => ({
          conversations: mapConversation(state.conversations, id, (conversation) => ({
            ...conversation,
            messages: conversation.messages.map((message) =>
              message.id === messageId && message.role === "assistant" ? { ...message, feedback } : message,
            ),
          })),
        }));
      },

      deleteConversation: (id) => {
        if (get().pendingConversationId === id) get().stopGenerating();
        set((state) => ({
          conversations: state.conversations.filter((conversation) => conversation.id !== id),
          activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
        }));
      },

      clearHistory: () => {
        get().stopGenerating();
        set({ conversations: [], activeConversationId: null });
      },

      updateSettings: (patch) => {
        const settings = { ...get().settings, ...patch };
        // Keep the model valid if an unknown id ever slips in from storage.
        settings.defaultModelId = getModel(settings.defaultModelId).id;
        set({ settings });
      },
    }),
    {
      name: STORAGE_KEYS.extension,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        view: state.view,
        layout: state.layout,
        popupOpen: state.popupOpen,
        modelId: state.modelId,
        settings: state.settings,
        conversations: state.settings.saveHistory ? state.conversations : [],
        activeConversationId: state.settings.saveHistory ? state.activeConversationId : null,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<ExtensionState>;
        return { ...current, ...saved, settings: { ...DEFAULT_EXTENSION_SETTINGS, ...saved.settings } };
      },
    },
  ),
);

export function selectActiveExtensionConversation(state: ExtensionState): Conversation | undefined {
  return state.conversations.find((conversation) => conversation.id === state.activeConversationId);
}
