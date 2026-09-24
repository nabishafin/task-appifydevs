import Image from "next/image";
import Link from "next/link";
import logoImg from "@/public/logo.png";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/** The EchoGPT official logo mark / image. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <Image
      src={logoImg}
      alt="EchoGPT logo"
      priority
      className={cn("h-7 w-auto object-contain", className)}
    />
  );
}

interface LogoProps {
  href?: string;
  className?: string;
  /** Hide the wordmark or render compact logo. */
  compact?: boolean;
}

export function Logo({ href = "/", className, compact = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="EchoGPT home"
    >
      <Image
        src={logoImg}
        alt="EchoGPT"
        priority
        className={cn(
          "h-16 w-auto object-contain",
          compact && "h-6",
        )}
      />
    </Link>
  );
}
