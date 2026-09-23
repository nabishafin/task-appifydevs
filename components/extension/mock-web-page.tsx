import { Sparkles } from "lucide-react";
import { DEMO_PAGE } from "@/data/extension";

function Paragraph({ text, onAskSelection }: { text: string; onAskSelection: () => void }) {
  const index = text.indexOf(DEMO_PAGE.selection);
  if (index === -1) return <p>{text}</p>;

  return (
    <p>
      {text.slice(0, index)}
      <mark className="rounded-[3px] bg-primary/20 [box-decoration-break:clone] px-0.5 text-foreground ring-1 ring-primary/30">
        <span className="sr-only">Selected text: </span>
        {DEMO_PAGE.selection}
      </mark>{" "}
      <button
        type="button"
        onClick={onAskSelection}
        className="inline-flex h-7 -translate-y-px items-center gap-1 rounded-md border border-border bg-card px-2 align-middle font-sans text-xs font-medium whitespace-nowrap text-foreground shadow-sm transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <Sparkles className="size-3.5 text-primary-text" aria-hidden="true" />
        Explain with EchoGPT
      </button>{" "}
      {text.slice(index + DEMO_PAGE.selection.length)}
    </p>
  );
}

/** A believable article page for the extension to "read". */
export function MockWebPage({ onAskSelection }: { onAskSelection: () => void }) {
  return (
    <div className="h-full overflow-y-auto bg-background-subtle">
      <div className="flex h-11 items-center justify-between border-b border-border bg-background px-6 text-xs text-muted-foreground">
        <span className="font-serif text-sm font-semibold tracking-tight text-foreground">The Example Journal</span>
        <nav aria-label="Example site" className="hidden gap-4 lg:flex">
          <span>Work</span>
          <span>Culture</span>
          <span>Technology</span>
        </nav>
      </div>
      <article className="mx-auto max-w-xl px-6 py-8">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Remote work</p>
        <h2 className="mt-2 font-serif text-2xl leading-tight font-semibold tracking-tight text-balance text-foreground lg:text-[1.75rem]">
          {DEMO_PAGE.title}
        </h2>
        <p className="mt-3 text-xs text-muted-foreground">
          By <span className="font-medium text-foreground">{DEMO_PAGE.author}</span> · {DEMO_PAGE.readTime}
        </p>
        <div className="mt-6 space-y-5 font-serif text-[15px] leading-7 text-foreground/85">
          {DEMO_PAGE.paragraphs.map((paragraph) => (
            <Paragraph key={paragraph.slice(0, 24)} text={paragraph} onAskSelection={onAskSelection} />
          ))}
        </div>
        <div className="mt-8 space-y-2" aria-hidden="true">
          <div className="h-2.5 w-full rounded-full bg-muted" />
          <div className="h-2.5 w-11/12 rounded-full bg-muted" />
          <div className="h-2.5 w-4/5 rounded-full bg-muted" />
        </div>
      </article>
    </div>
  );
}
