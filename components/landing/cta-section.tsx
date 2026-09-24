import { ArrowRight, Puzzle } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";

export function CTASection() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-14rem] left-1/2 -z-10 h-80 w-[min(48rem,100%)] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
      />
      <ResponsiveContainer size="md">
        <Reveal className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2
              id="cta-title"
              className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl"
            >
              Stop switching tabs. Start getting answers.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              Every leading model, your prompt library and a sidebar on every page. Free to start, ready in seconds.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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
