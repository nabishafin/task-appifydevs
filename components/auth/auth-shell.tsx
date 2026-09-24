import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { HeroBanner } from "@/components/shared/hero-banner";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/** Split layout for the auth pages: form on the left, the theme banner on the right (large screens). */
export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Home
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main id="main" className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>

      <aside
        aria-label="EchoGPT preview"
        className="relative hidden overflow-hidden border-l border-border bg-background-subtle lg:block"
      >
        <HeroBanner className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent px-10 pt-24 pb-10">
          <blockquote className="max-w-md text-lg leading-relaxed text-foreground">
            “I used to keep three AI tabs open. Now I ask once, compare two models and move on.”
          </blockquote>
          <p className="mt-3 text-sm text-muted-foreground">Nadia Rahman, Product Designer</p>
        </div>
      </aside>
    </div>
  );
}
