export type CodeTokenType = "keyword" | "string" | "comment" | "number" | "type" | "plain";

export interface CodeToken {
  type: CodeTokenType;
  value: string;
}

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "async",
  "await",
  "try",
  "catch",
  "finally",
  "new",
  "type",
  "interface",
  "extends",
  "class",
  "true",
  "false",
  "null",
  "undefined",
  "throw",
  "typeof",
  "instanceof",
  "in",
  "of",
  "SELECT",
  "FROM",
  "WHERE",
  "ORDER",
  "BY",
  "LIMIT",
  "CREATE",
  "INDEX",
  "ON",
  "DESC",
  "ASC",
  "CONCURRENTLY",
  "JOIN",
  "GROUP",
  "INSERT",
  "UPDATE",
  "DELETE",
  "def",
  "self",
  "None",
]);

// One combined pattern keeps tokenizing linear; groups map to token types in order.
const TOKEN_PATTERN =
  /(\/\/[^\n]*|--[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)/g;

/**
 * A deliberately small highlighter for the handful of languages in mock
 * responses. A real product would swap this for Shiki on the server.
 */
export function highlightCode(code: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) tokens.push({ type: "plain", value: code.slice(lastIndex, index) });

    const [value, comment, string, number, word] = match;
    if (comment) tokens.push({ type: "comment", value });
    else if (string) tokens.push({ type: "string", value });
    else if (number) tokens.push({ type: "number", value });
    else if (word && KEYWORDS.has(word)) tokens.push({ type: "keyword", value });
    else if (word && /^[A-Z]/.test(word)) tokens.push({ type: "type", value });
    else tokens.push({ type: "plain", value });

    lastIndex = index + value.length;
  }

  if (lastIndex < code.length) tokens.push({ type: "plain", value: code.slice(lastIndex) });
  return tokens;
}
