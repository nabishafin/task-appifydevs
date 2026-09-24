import { describe, expect, it } from "vitest";
import {
  buildMockResponse,
  deriveConversationTitle,
  detectIntent,
  MockCompletionError,
  requestCompletion,
} from "@/features/chat/lib/mock-responder";

describe("detectIntent", () => {
  it.each([
    ["Fix this React hook", "code"],
    ["Draft a follow-up email to a client", "email"],
    ["Translate this into Spanish", "translate"],
    ["Summarize this article", "summary"],
    ["Plan my week around two deadlines", "plan"],
    ["What makes a good team?", "general"],
  ])("classifies %j as %s", (prompt, intent) => {
    expect(detectIntent(prompt)).toBe(intent);
  });
});

describe("deriveConversationTitle", () => {
  it("uses the first line, capitalized, without trailing punctuation", () => {
    expect(deriveConversationTitle("how do I center a div?\nmore context")).toBe("How do I center a div");
  });

  it("truncates long prompts", () => {
    expect(deriveConversationTitle("a".repeat(120)).length).toBeLessThanOrEqual(48);
  });
});

describe("buildMockResponse", () => {
  it("returns a code block for coding prompts", () => {
    const blocks = buildMockResponse("Write a TypeScript function", "gpt-5");
    expect(blocks.some((block) => block.type === "code")).toBe(true);
  });

  it("gives different providers a distinct voice for side-by-side comparison", () => {
    const gpt = buildMockResponse("Compare REST and GraphQL", "gpt-5");
    const claude = buildMockResponse("Compare REST and GraphQL", "claude-sonnet-4-5");
    expect(gpt).not.toEqual(claude);
  });

  it("respects the response style", () => {
    const balanced = buildMockResponse("Summarize this article", "gpt-5", "balanced");
    const concise = buildMockResponse("Summarize this article", "gpt-5", "concise");
    const detailed = buildMockResponse("Summarize this article", "gpt-5", "detailed");
    expect(concise.length).toBeLessThanOrEqual(3);
    expect(concise.some((block) => block.type === "callout")).toBe(false);
    expect(detailed.length).toBe(balanced.length + 1);
  });
});

describe("requestCompletion", () => {
  it("rejects with a friendly error when asked to simulate one", async () => {
    await expect(
      requestCompletion({ prompt: "please simulate an error", modelId: "gpt-5-mini" }),
    ).rejects.toBeInstanceOf(MockCompletionError);
  });

  it("can be cancelled with an AbortSignal", async () => {
    const controller = new AbortController();
    const pending = requestCompletion({ prompt: "Hello", modelId: "gpt-5", signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toThrow("Aborted");
  });
});
