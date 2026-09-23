import { cn } from "@/lib/utils";

const WIDTHS = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
} as const;

interface ResponsiveContainerProps extends React.ComponentProps<"div"> {
  size?: keyof typeof WIDTHS;
}

export function ResponsiveContainer({ size = "lg", className, ...props }: ResponsiveContainerProps) {
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", WIDTHS[size], className)} {...props} />;
}
