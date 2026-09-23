import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipIconButtonProps extends Omit<React.ComponentProps<typeof Button>, "aria-label"> {
  /** Used as both the accessible name and the tooltip text. */
  label: string;
  shortcut?: string[];
  side?: React.ComponentProps<typeof TooltipContent>["side"];
  /**
   * Render the button as the trigger of the surrounding <DropdownMenu>. Needed
   * because the tooltip root cannot receive trigger props via `asChild`.
   */
  asMenuTrigger?: boolean;
}

/** Icon-only button with a matching tooltip and accessible label. */
export function TooltipIconButton({
  label,
  shortcut,
  side = "top",
  size = "icon-sm",
  variant = "ghost",
  asMenuTrigger = false,
  children,
  ...props
}: TooltipIconButtonProps) {
  const button = (
    <Button size={size} variant={variant} aria-label={label} {...props}>
      {children}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {asMenuTrigger ? <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger> : button}
      </TooltipTrigger>
      <TooltipContent side={side}>
        {label}
        {shortcut && <ShortcutKeys keys={shortcut} />}
      </TooltipContent>
    </Tooltip>
  );
}
