import { getProvider } from "@/data/models";
import { cn } from "@/lib/utils";
import type { ProviderId } from "@/types/models";

const SIZES = {
  xs: "size-4 rounded-[5px] text-[9px]",
  sm: "size-5 rounded-md text-[10px]",
  md: "size-7 rounded-lg text-xs",
  lg: "size-10 rounded-lg text-sm",
} as const;

interface ModelIconProps {
  providerId: ProviderId;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * Neutral tile with a provider monogram. The provider color is limited to a
 * thin inner ring and the letter, so it never competes with the EchoGPT brand.
 */
export function ModelIcon({ providerId, size = "md", className }: ModelIconProps) {
  const provider = getProvider(providerId);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center border border-border bg-background-subtle font-semibold",
        SIZES[size],
        className,
      )}
      style={{
        color: provider.accent,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${provider.accent} 22%, transparent)`,
      }}
    >
      {provider.monogram}
    </span>
  );
}
