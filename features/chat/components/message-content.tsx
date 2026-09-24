import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { MessageBlock } from "@/types/chat";
import { parseInline } from "../lib/parse-inline";
import { CodeBlock } from "./code-block";

export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((token, index) => {
        if (token.type === "bold") {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {token.value}
            </strong>
          );
        }
        if (token.type === "italic") return <em key={index}>{token.value}</em>;
        if (token.type === "code") {
          return (
            <code
              key={index}
              className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
            >
              {token.value}
            </code>
          );
        }
        return <Fragment key={index}>{token.value}</Fragment>;
      })}
    </>
  );
}

const CALLOUT_STYLES = {
  info: {
    icon: Info,
    label: "Note",
    className: "border-border bg-background-subtle",
    iconClassName: "text-primary-text",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    className: "border-primary/25 bg-primary/5",
    iconClassName: "text-primary-text",
  },
  warning: {
    icon: AlertTriangle,
    label: "Heads up",
    className: "border-warning/30 bg-warning/5",
    iconClassName: "text-warning",
  },
} as const;

function Block({ block }: { block: MessageBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="pt-2 text-[0.95rem] font-semibold tracking-tight text-foreground">{block.text}</h3>;
    case "paragraph":
      return (
        <p className="whitespace-pre-line">
          <InlineText text={block.text} />
        </p>
      );
    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={cn("space-y-1.5 pl-5", block.ordered ? "list-decimal" : "list-disc marker:text-subtle-foreground")}
        >
          {block.items.map((item, index) => (
            <li key={index} className="pl-1">
              <InlineText text={item} />
            </li>
          ))}
        </ListTag>
      );
    }
    case "code":
      return <CodeBlock code={block.code} language={block.language} filename={block.filename} />;
    case "callout": {
      const style = CALLOUT_STYLES[block.tone];
      const Icon = style.icon;
      return (
        <aside className={cn("flex gap-3 rounded-xl border p-3.5", style.className)}>
          <Icon className={cn("mt-0.5 size-4 shrink-0", style.iconClassName)} aria-hidden="true" />
          <p>
            <span className="sr-only">{style.label}: </span>
            <InlineText text={block.text} />
          </p>
        </aside>
      );
    }
  }
}

interface MessageContentProps {
  blocks: MessageBlock[];
  className?: string;
}

/** Renders structured assistant output (headings, paragraphs, lists, code, callouts). */
export function MessageContent({ blocks, className }: MessageContentProps) {
  return (
    <div className={cn("space-y-3 text-(length:--chat-font-size) leading-7 text-foreground/90", className)}>
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}
