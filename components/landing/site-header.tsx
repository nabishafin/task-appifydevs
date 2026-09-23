import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { DesktopNav } from "./desktop-nav";
import { HeaderShell } from "./header-shell";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <HeaderShell>
      <ResponsiveContainer size="xl" className="flex h-16 items-center gap-4">
        <Logo />
        <div className="flex flex-1 justify-center">
          <DesktopNav />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle className="size-10 lg:size-8" />
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link href={siteConfig.links.app}>Sign in</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={siteConfig.links.app}>Get started</Link>
          </Button>
          <MobileNav />
        </div>
      </ResponsiveContainer>
    </HeaderShell>
  );
}
