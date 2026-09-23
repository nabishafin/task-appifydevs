import { AlertTriangle, Loader2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function EmptyState({ icon: Icon, title, description, action, className, size = "md" }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "md" ? "gap-3 px-6 py-16" : "gap-2 px-4 py-10",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-xs",
          size === "md" ? "size-12" : "size-10",
        )}
      >
        <Icon className={size === "md" ? "size-5" : "size-4"} aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className={cn("font-medium text-foreground", size === "md" ? "text-base" : "text-sm")}>{title}</p>
        {description && <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = "Something went wrong", description, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Loading", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn("flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground", className)}
    >
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      <span>{label}…</span>
    </div>
  );
}

interface SkeletonLoaderProps {
  variant: "list" | "cards" | "message";
  count?: number;
  className?: string;
}

export function SkeletonLoader({ variant, count = 3, className }: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <div
      role="status"
      aria-label="Loading content"
      className={cn(variant === "cards" && "grid gap-3 sm:grid-cols-2", className)}
    >
      {items.map((index) => {
        if (variant === "cards") {
          return (
            <div key={index} className="space-y-3 rounded-xl border border-border bg-card p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          );
        }
        if (variant === "message") {
          return (
            <div key={index} className="flex gap-3 py-3">
              <Skeleton className="size-7 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          );
        }
        return (
          <div key={index} className="flex items-center gap-3 py-2">
            <Skeleton className="size-8 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
          </div>
        );
      })}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
