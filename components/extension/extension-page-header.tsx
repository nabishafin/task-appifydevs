import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export function ExtensionPageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <ResponsiveContainer size="xl" className="flex h-14 items-center gap-3">
        <Logo />
        <span className="hidden text-sm text-muted-foreground sm:inline">/ Chrome extension</span>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/app">
              Open web app
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
          <ThemeToggle className="size-9 md:size-8" />
        </div>
      </ResponsiveContainer>
    </header>
  );
}
