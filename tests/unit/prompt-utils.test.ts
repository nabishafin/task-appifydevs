import { describe, expect, it } from "vitest";
import { PROMPT_TEMPLATES } from "@/data/prompts";
import { extractVariables, fillTemplate, filterPrompts } from "@/features/prompts/lib/prompt-utils";

describe("extractVariables", () => {
  it("returns unique variables in order", () => {
    expect(extractVariables("Write for {{audience}} in a {{ tone }} tone, again {{audience}}")).toEqual([
      "audience",
      "tone",
    ]);
  });
});

describe("fillTemplate", () => {
  it("replaces provided values and keeps missing placeholders", () => {
    expect(fillTemplate("Hi {{name}}, about {{topic}}", { name: "Sam", topic: "  " })).toBe("Hi Sam, about {{topic}}");
  });
});

describe("filterPrompts", () => {
  it("filters by surface, category and query together", () => {
    const results = filterPrompts(PROMPT_TEMPLATES, { surface: "extension", category: "coding", query: "review" });
    expect(results.map((prompt) => prompt.id)).toEqual(["code-review"]);
  });

  it("returns only favorites for the favorites filter", () => {
    const results = filterPrompts(PROMPT_TEMPLATES, { category: "favorites", favoriteIds: ["swot", "brainstorm"] });
    expect(results.map((prompt) => prompt.id).sort()).toEqual(["brainstorm", "swot"]);
  });
});
