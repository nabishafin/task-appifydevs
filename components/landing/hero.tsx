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
    <div className="mx-auto flex max-w-xl flex-col items-center text-center xl:mx-0 xl:max-w-lg xl:items-start xl:text-left">
      <Link
        href={siteConfig.links.extension}
        className={`${ENTRANCE} group inline-flex h-8 items-center gap-2 rounded-md border border-border bg-card/80 pr-3 pl-1 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur transition-colors hover:border-border-strong hover:text-foreground`}
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
        <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 xl:justify-start">
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
        {/* Wide screens: soft brand light on the left so the copy side echoes the banner's atmosphere. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-30 hidden xl:block">
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_45%_65%_at_18%_45%,black,transparent)] opacity-40" />
          <div className="absolute top-[12%] -left-48 h-[34rem] w-[46rem] rounded-full bg-primary/12 blur-[140px] dark:bg-primary/20" />
          <div className="absolute -bottom-24 left-[8%] h-72 w-[52rem] rounded-full bg-brand-secondary/10 blur-[140px] dark:bg-brand-secondary/15" />
        </div>
        {/* The banner itself is masked, so its edges dissolve into that light instead of a hard seam. */}
        <HeroBanner className="absolute inset-y-0 right-0 left-[34%] -z-20 hidden hero-banner-mask xl:block" />

        <ResponsiveContainer size="xl" className="pt-14 sm:pt-20 xl:flex xl:min-h-[44rem] xl:items-center xl:pt-0">
          <HeroCopy />
        </ResponsiveContainer>
      </div>

      <ResponsiveContainer size="xl">
        {/* Smaller screens: the banner sits below the copy instead of behind it. */}
        <HeroBanner className="mt-12 aspect-[16/10] animate-in rounded-lg border border-border delay-300 duration-1000 fill-mode-both fade-in slide-in-from-bottom-4 sm:mt-14 xl:hidden" />

        <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-y-6 pb-20 sm:grid-cols-4 sm:divide-x sm:divide-border sm:pb-28 xl:mt-6">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-4 text-center">
              <dt className="order-2 text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </ResponsiveContainer>
    </section>
  );
}
