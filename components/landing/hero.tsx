import { ArrowRight, Puzzle } from "lucide-react";
import Link from "next/link";
import { ModelIcon } from "@/components/shared/model-icon";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { TRUST_STATS } from "@/data/features";
import { PROVIDERS } from "@/data/models";
import { HeroBanner } from "@/components/shared/hero-banner";

const PROVIDER_LIST = Object.values(PROVIDERS);
const ENTRANCE = "animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both";

function HeroCopy() {
  return (
    <div className="flex max-w-xl flex-col items-start text-left xl:max-w-[min(32rem,31vw)]">
      <Link
        href={siteConfig.links.extension}
        className={`${ENTRANCE} group inline-flex h-8 items-center gap-2 rounded-full bg-card/90 pr-3 pl-1.5 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur transition-colors hover:text-foreground`}
      >
        <span className="rounded-md bg-primary/12 px-2 py-0.5 text-primary-text">New</span>
        Chrome sidebar 2.0
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>

      <h1
        id="hero-title"
        className={`${ENTRANCE} mt-6 text-4xl font-semibold tracking-tight text-balance text-foreground delay-75 sm:text-5xl xl:text-6xl`}
      >
        Every leading AI model. <span className="text-gradient-brand">One calm workspace.</span>
      </h1>

      <p
        className={`${ENTRANCE} mt-5 text-base leading-relaxed text-pretty text-muted-foreground delay-150 sm:text-lg`}
      >
        Chat with GPT-5, Claude, Gemini, Mistral, DeepSeek and Llama from one app and a Chrome sidebar. Switch models
        mid-conversation, compare answers side by side and reuse the prompts that work.
      </p>

      <div
        className={`${ENTRANCE} mt-8 flex w-full flex-col items-stretch gap-3 delay-200 sm:w-auto sm:flex-row sm:items-center`}
      >
        <Button asChild size="xl">
          <Link href={siteConfig.links.app}>
            Start chatting free
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="xl" variant="outline" className="bg-background/60 backdrop-blur">
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
        <ul className="mt-3 flex flex-wrap items-center justify-start gap-x-5 gap-y-3">
          {PROVIDER_LIST.map((provider) => (
            <li key={provider.id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <ModelIcon providerId={provider.id} size="sm" />
              {provider.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden">
      <div className="relative isolate">
        {/* Wide screens: the banner covers the whole hero, fully visible; only the edges fade into the page. */}
        <HeroBanner imageClassName="object-[100%_35%]" className="absolute inset-0 -z-20 hidden xl:block" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-32 bg-gradient-to-t from-background to-transparent xl:block"
        />
        {/* Keeps the transparent header legible over whatever part of the banner sits underneath it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-32 bg-gradient-to-b from-background/70 to-transparent xl:block"
        />

        <ResponsiveContainer
          size="wide"
          className="pt-28 sm:pt-32 xl:flex xl:min-h-[max(40rem,38vw)] xl:items-center xl:pt-24"
        >
          <HeroCopy />
        </ResponsiveContainer>

        {/* Bottom-right stats on wide screens */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden xl:block">
          <ResponsiveContainer size="wide" className="flex justify-end">
            <dl className="pointer-events-auto flex items-center gap-6 rounded-2xl bg-card/85 px-6 py-3.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-both">
              {TRUST_STATS.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6">
                  {i > 0 && <div className="h-7 w-px bg-border/60" aria-hidden="true" />}
                  <div className="flex flex-col text-left">
                    <dd className="text-xl font-bold tracking-tight text-foreground">{stat.value}</dd>
                    <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  </div>
                </div>
              ))}
            </dl>
          </ResponsiveContainer>
        </div>
      </div>

      <ResponsiveContainer size="wide">
        {/* Smaller screens: the banner sits below the copy instead of behind it. */}
        <div className="mt-8 sm:mt-10 xl:hidden">
          <HeroBanner className="aspect-[16/10] animate-in rounded-2xl shadow-xl delay-300 duration-1000 fill-mode-both fade-in slide-in-from-bottom-4" />
        </div>

        {/* Clean, spacious stats for smaller screens - no cramped card clump */}
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 pb-6 sm:grid-cols-4 sm:gap-8 sm:pb-8 xl:hidden">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start gap-1">
              <dd className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{stat.value}</dd>
              <dt className="text-xs leading-normal text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </ResponsiveContainer>
    </section>
  );
}
