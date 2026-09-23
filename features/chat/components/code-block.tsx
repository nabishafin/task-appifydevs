import { useMemo } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import { highlightCode } from "../lib/highlight";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const tokens = useMemo(() => highlightCode(code), [code]);

  return (
    <figure
      className={cn(
        "code-surface overflow-hidden rounded-xl border border-code-border bg-code text-code-foreground",
        className,
      )}
    >
      <figcaption className="flex h-9 items-center justify-between gap-2 border-b border-code-border pr-1.5 pl-3.5 text-xs">
        <span className="flex min-w-0 items-center gap-2 text-(--code-muted)">
          <span className="font-mono font-medium tracking-wide uppercase">{language}</span>
          {filename && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate font-mono">{filename}</span>
            </>
          )}
        </span>
        <CopyButton
          value={code}
          label="Copy code"
          size="icon-xs"
          className="text-(--code-muted) hover:bg-white/10 hover:text-white"
        />
      </figcaption>
      <pre className="thin-scrollbar overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6">
        <code>
          {tokens.map((token, index) =>
            token.type === "plain" ? (
              token.value
            ) : (
              <span key={index} className={`token-${token.type}`}>
                {token.value}
              </span>
            ),
          )}
        </code>
      </pre>
    </figure>
  );
}
