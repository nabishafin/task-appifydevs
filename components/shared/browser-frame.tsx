import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Extra toolbar content on the right, e.g. an extension icon. */
  toolbar?: React.ReactNode;
}

/** Minimal browser window chrome used for product previews and the extension demo. */
export function BrowserFrame({
  url = "echogpt.live/app",
  children,
  className,
  contentClassName,
  toolbar,
}: BrowserFrameProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-lg", className)}>
      <div className="flex h-10 items-center gap-3 border-b border-border bg-background-subtle px-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </div>
        <div className="mx-auto flex h-6 w-full max-w-sm min-w-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs text-muted-foreground">
          <Lock className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{url}</span>
        </div>
        <div className="flex min-w-10 items-center justify-end gap-1">{toolbar}</div>
      </div>
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}
