import type { MessageBlock } from "@/types/chat";

export type InlineToken = { type: "text" | "bold" | "italic" | "code"; value: string };

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*\s][^*\n]*\*|`[^`]+`)/g;

/** Splits text into plain, **bold**, *italic* and `code` tokens. Intentionally tiny: no nesting. */
export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  for (const part of text.split(INLINE_PATTERN)) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      tokens.push({ type: "bold", value: part.slice(2, -2) });
    } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      tokens.push({ type: "italic", value: part.slice(1, -1) });
    } else if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      tokens.push({ type: "code", value: part.slice(1, -1) });
    } else {
      tokens.push({ type: "text", value: part });
    }
  }
  return tokens;
}

/** Plain-text version of a message, used for copy-to-clipboard. */
export function blocksToPlainText(blocks: MessageBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
        case "callout":
          return block.text.replace(/\*\*?|`/g, "");
        case "list":
          return block.items
            .map((item, index) => `${block.ordered ? `${index + 1}.` : "-"} ${item.replace(/\*\*?|`/g, "")}`)
            .join("\n");
        case "code":
          return `\`\`\`${block.language}\n${block.code}\n\`\`\``;
      }
    })
    .join("\n\n");
}
