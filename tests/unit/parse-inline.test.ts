import { describe, expect, it } from "vitest";
import { blocksToPlainText, parseInline } from "@/features/chat/lib/parse-inline";

describe("parseInline", () => {
  it("splits bold and inline code from plain text", () => {
    expect(parseInline("Use **useMemo** with `deps` wisely")).toEqual([
      { type: "text", value: "Use " },
      { type: "bold", value: "useMemo" },
      { type: "text", value: " with " },
      { type: "code", value: "deps" },
      { type: "text", value: " wisely" },
    ]);
  });

  it("parses single-asterisk italics", () => {
    expect(parseInline("How *big* is it?")).toEqual([
      { type: "text", value: "How " },
      { type: "italic", value: "big" },
      { type: "text", value: " is it?" },
    ]);
  });

  it("leaves unmatched markers as text", () => {
    expect(parseInline("2 ** 3 and a lone `")).toEqual([{ type: "text", value: "2 ** 3 and a lone `" }]);
  });
});

describe("blocksToPlainText", () => {
  it("serializes every block type for copy-to-clipboard", () => {
    const text = blocksToPlainText([
      { type: "heading", text: "Plan" },
      { type: "list", ordered: true, items: ["**First** step", "Second"] },
      { type: "code", language: "ts", code: "const a = 1;" },
    ]);
    expect(text).toBe("Plan\n\n1. First step\n2. Second\n\n```ts\nconst a = 1;\n```");
  });
});
