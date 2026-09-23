import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/** The EchoGPT mark: a source point with two echo waves. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-7 shrink-0", className)}>
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <circle cx="11" cy="16" r="3" fill="#fff" />
      <path d="M16.1 10.5A7.5 7.5 0 0 1 16.1 21.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path
        d="M19.9 8A12 12 0 0 1 19.9 24"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

interface LogoProps {
  href?: string;
  className?: string;
  /** Hide the wordmark, e.g. in the collapsed sidebar. */
  compact?: boolean;
}

export function Logo({ href = "/", className, compact = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg font-semibold tracking-tight text-foreground",
        className,
      )}
      aria-label="EchoGPT home"
    >
      <LogoMark />
      {!compact && <span className="text-[1.05rem]">EchoGPT</span>}
    </Link>
  );
}
