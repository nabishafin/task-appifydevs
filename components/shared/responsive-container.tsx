import { cn } from "@/lib/utils";

const WIDTHS = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  /** Wider than `xl`, but capped so lines don't run edge to edge on very large screens. */
  wide: "xl:max-w-[104rem] xl:px-16",
} as const;

interface ResponsiveContainerProps extends React.ComponentProps<"div"> {
  size?: keyof typeof WIDTHS;
}

/** Shared horizontal gutter, so every page (landing, app, extension, auth) lines up at the same breakpoints. */
export const PAGE_GUTTER = "px-4 sm:px-6 lg:px-8 xl:px-10";

export function ResponsiveContainer({ size = "lg", className, ...props }: ResponsiveContainerProps) {
  return <div className={cn("mx-auto w-full", PAGE_GUTTER, WIDTHS[size], className)} {...props} />;
}
