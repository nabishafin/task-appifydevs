import { ArrowRight, Puzzle } from "lucide-react";
import Link from "next/link";
import { ModelIcon } from "@/components/shared/model-icon";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { TRUST_STATS } from "@/data/features";
import { PROVIDERS } from "@/data/models";
import { BrowserPreview } from "./browser-preview";

const PROVIDER_LIST = Object.values(PROVIDERS);
const ENTRANCE = "animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] opacity-50" />
        <div className="absolute top-[-14rem] left-1/2 h-[28rem] w-[min(56rem,120vw)] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20" />
      </div>

      <ResponsiveContainer size="xl">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href={siteConfig.links.extension}
            className={`${ENTRANCE} group inline-flex h-8 items-center gap-2 rounded-full border border-border bg-card/80 pr-3 pl-1 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:border-border-strong hover:text-foreground`}
          >
            <span className="rounded-full bg-primary/12 px-2 py-0.5 text-primary-text">New</span>
            Chrome sidebar 2.0
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>

          <h1
            id="hero-title"
            className={`${ENTRANCE} mt-6 text-4xl font-semibold tracking-tight text-balance text-foreground delay-75 sm:text-5xl lg:text-6xl`}
          >
            Every leading AI model. <span className="text-gradient-brand">One calm workspace.</span>
          </h1>

          <p
            className={`${ENTRANCE} mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground delay-150 sm:text-lg`}
          >
            Chat with GPT-5, Claude, Gemini, Mistral, DeepSeek and Llama from one app and a Chrome sidebar. Switch
            models mid-conversation, compare answers side by side and reuse the prompts that work.
          </p>

          <div
            className={`${ENTRANCE} mt-8 flex flex-col items-stretch justify-center gap-3 delay-200 sm:flex-row sm:items-center`}
          >
            <Button asChild size="xl">
              <Link href={siteConfig.links.app}>
                Start chatting free
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href={siteConfig.links.extension}>
                <Puzzle data-icon="inline-start" aria-hidden="true" />
                Add to Chrome
              </Link>
            </Button>
          </div>
          <p className={`${ENTRANCE} mt-3 text-xs text-subtle-foreground delay-200`}>
            Free plan included. No credit card required.
          </p>

          <div className={`${ENTRANCE} mt-10 delay-300`}>
            <p className="text-xs font-medium text-subtle-foreground">Works with models from</p>
            <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              {PROVIDER_LIST.map((provider) => (
                <li key={provider.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ModelIcon providerId={provider.id} size="sm" />
                  {provider.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl animate-in delay-300 duration-1000 fill-mode-both fade-in slide-in-from-bottom-4 sm:mt-16">
          <BrowserPreview />
        </div>

        <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 bg-background px-4 py-5 text-center">
              <dt className="order-2 text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </ResponsiveContainer>
    </section>
  );
}
