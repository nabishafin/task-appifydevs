"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/constants/site";
import { MARKETING_NAV } from "@/data/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open menu">
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] max-w-sm gap-0 p-0">
        <div className="flex h-16 items-center border-b border-border px-4">
          <Logo className="h-10" />
        </div>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Jump to a section or open EchoGPT.</SheetDescription>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="flex flex-col">
            {MARKETING_NAV.map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <a
                    href={item.href}
                    className="flex h-11 items-center rounded-lg px-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-2 border-t border-border p-4">
          <Button asChild size="lg" onClick={close}>
            <Link href={siteConfig.links.app}>
              Get started
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" onClick={close}>
            <Link href={siteConfig.links.app}>Sign in</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
