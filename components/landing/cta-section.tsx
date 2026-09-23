import { ArrowRight, Puzzle } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/shared/logo";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";

export function CTASection() {
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-28">
      <ResponsiveContainer size="lg">
        <Reveal className="relative isolate overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_50%_60%_at_50%_100%,black,transparent)] opacity-40" />
            <div className="absolute bottom-[-12rem] left-1/2 h-72 w-[min(40rem,100%)] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          </div>
          <LogoMark className="mx-auto size-10" />
          <h2
            id="cta-title"
            className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            Stop switching tabs. Start getting answers.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Every leading model, your prompt library and a sidebar on every page. Free to start, ready in seconds.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl">
              <Link href={siteConfig.links.app}>
                Start chatting free
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="ghost" className="text-foreground">
              <Link href={siteConfig.links.extension}>
                <Puzzle data-icon="inline-start" aria-hidden="true" />
                Install the extension
              </Link>
            </Button>
          </div>
        </Reveal>
      </ResponsiveContainer>
    </section>
  );
}
