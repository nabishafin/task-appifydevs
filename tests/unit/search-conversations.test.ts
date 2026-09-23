import { describe, expect, it } from "vitest";
import { createSeedConversations } from "@/data/conversations";
import { searchConversations } from "@/features/history/lib/search-conversations";
import { getDateGroup, groupByDate } from "@/lib/format";

const conversations = createSeedConversations();

describe("searchConversations", () => {
  it("matches message bodies, not just titles, and returns a snippet", () => {
    const [result] = searchConversations(conversations, { query: "AbortController" });
    expect(result.conversation.id).toBe("c-debounce-hook");
    expect(result.snippet.toLowerCase()).toContain("abortcontroller");
  });

  it("combines model, tag and favorite filters", () => {
    const results = searchConversations(conversations, { modelId: "gpt-5", tag: "work", favoritesOnly: false });
    expect(
      results.every((result) => result.conversation.modelId === "gpt-5" && result.conversation.tag === "work"),
    ).toBe(true);
    expect(
      searchConversations(conversations, { favoritesOnly: true }).every((result) => result.conversation.isFavorite),
    ).toBe(true);
  });

  it("sorts newest first", () => {
    const dates = searchConversations(conversations, {}).map((result) => result.conversation.updatedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("groupByDate", () => {
  it("groups items into ordered recency buckets", () => {
    const now = new Date("2026-09-23T12:00:00");
    const items = ["2026-09-23T08:00:00", "2026-09-10T08:00:00", "2026-09-22T08:00:00", "2026-09-19T08:00:00"];
    const groups = groupByDate(items, (item) => item, now);
    expect(groups.map((group) => group.group)).toEqual(["Today", "Yesterday", "Previous 7 days", "Older"]);
    expect(getDateGroup("2026-09-17T08:00:00", now)).toBe("Previous 7 days");
    expect(getDateGroup("2026-09-16T08:00:00", now)).toBe("Older");
  });
});
