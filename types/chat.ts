export type MessageBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "code"; language: string; code: string; filename?: string }
  | { type: "callout"; tone: "info" | "tip" | "warning"; text: string };

export type MessageFeedback = "up" | "down";

export interface Attachment {
  id: string;
  name: string;
  /** Size in bytes. */
  size: number;
  kind: "document" | "image" | "code";
}

interface BaseMessage {
  id: string;
  /** ISO timestamp. */
  createdAt: string;
}

export interface UserMessage extends BaseMessage {
  role: "user";
  content: string;
  attachments?: Attachment[];
}

export interface AssistantMessage extends BaseMessage {
  role: "assistant";
  modelId: string;
  blocks: MessageBlock[];
  status: "complete" | "error";
  errorMessage?: string;
  feedback?: MessageFeedback;
}

export type ChatMessage = UserMessage | AssistantMessage;

export type ConversationTag = "work" | "research" | "personal" | "code";

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  messages: ChatMessage[];
  tag?: ConversationTag;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
