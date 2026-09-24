"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/constants/site";
import { FEATURES } from "@/data/features";
import { cn } from "@/lib/utils";
import {
  CompareIllustration,
  MixedThreadIllustration,
  ModelSwitcherIllustration,
  QuickActionsIllustration,
} from "./feature-illustrations";

interface SpotlightCardData {
  id: string;
  step: string;
  tag: string;
  title: string;
  description: string;
  points: string[];
  ctaText?: string;
  ctaHref?: string;
  illustration: React.ReactNode;
}

const CARDS: SpotlightCardData[] = [
  {
    id: "multi-model",
    step: "01",
    tag: "Unified Ecosystem",
    title: "All leading AI models in one focused workspace",
    description:
      "Stop switching tabs and paying separate subscriptions. Switch between GPT-5, Claude Sonnet 4.5, Gemini 2.5 Pro, DeepSeek R1, and Mistral in a single continuous conversation.",
    points: [
      "10+ premier models ready instantly with one account",
      "Full conversation context carries over when switching models",
      "Unified attachments, prompt templates, and search history",
    ],
    ctaText: "Explore model catalog",
    ctaHref: siteConfig.links.models,
    illustration: (
      <div className="grid gap-3 sm:grid-cols-2">
        <ModelSwitcherIllustration />
        <MixedThreadIllustration className="hidden sm:flex" />
      </div>
    ),
  },
  {
    id: "model-switching",
    step: "02",
    tag: "Side-by-Side Compare",
    title: "Benchmark two models against the same prompt",
    description:
      "Unsure whether Claude or GPT handles your prompt better? Fire both in parallel, compare their response quality, reasoning depth, and latency side by side, then keep the best answer.",
    points: [
      "Dual simultaneous inference with real-time response generation",
      "Response time, token metrics, and formatting inspection",
      "Single-click branch-off to continue chat with the winning model",
    ],
    ctaText: "Try comparison mode",
    ctaHref: siteConfig.links.compare,
    illustration: <CompareIllustration />,
  },
  {
    id: "browser-sidebar",
    step: "03",
    tag: "Chrome Extension",
    title: "Instant AI assistant on any webpage you read",
    description:
      "Take your models and custom prompts anywhere. Highlight any text on the web to summarize, explain technical jargon, translate, or draft replies without ever leaving the tab.",
    points: [
      "Context-aware quick actions reading the active page",
      "Docked persistent sidebar or lightweight floating popup",
      "Full synchronization with your EchoGPT web workspace",
    ],
    ctaText: "Test extension demo",
    ctaHref: siteConfig.links.extension,
    illustration: <QuickActionsIllustration />,
  },
];

export function StickyFeatureCards() {
  return (
    <div className="relative mt-8 sm:mt-12 space-y-6 sm:space-y-10 [--stack-top:4.25rem] sm:[--stack-top:5rem] lg:[--stack-top:5.5rem]">
      {CARDS.map((card, index) => {
        // Progressive sticky top offset creates the layered card deck effect as the user scrolls
        const stickyTop = `calc(var(--stack-top) + ${index * 1.25}rem)`;
        const zIndex = 10 + index * 5;

        return (
          <div
            key={card.id}
            className="sticky transition-all duration-300 ease-out will-change-transform"
            style={{
              top: stickyTop,
              zIndex,
            }}
          >
            <article
              className={cn(
                "relative overflow-hidden rounded-2xl bg-card/95 p-5 sm:p-7 lg:p-9 backdrop-blur-xl transition-all duration-300",
                "shadow-[0_10px_35px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_50px_-15px_rgba(0,0,0,0.7)]",
              )}
            >

              <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
                {/* Left Column: Feature Details */}
                <div className="flex flex-col justify-center space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="flex size-6 sm:size-7 items-center justify-center rounded-md bg-primary/15 font-mono text-xs font-semibold text-primary-text">
                      {card.step}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-primary-text uppercase">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                  </div>

                  <ul className="space-y-2 sm:space-y-2.5 pt-0.5 sm:pt-1">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-foreground/90">
                        <span className="mt-0.5 flex size-3.5 sm:size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-text">
                          <Check className="size-2.5 sm:size-3" aria-hidden="true" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {card.ctaText && card.ctaHref && (
                    <div className="pt-1 sm:pt-2">
                      <Link
                        href={card.ctaHref}
                        className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-text hover:underline"
                      >
                        {card.ctaText}
                        <ArrowRight
                          className="size-3 sm:size-3.5 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right Column: Interactive Illustration Surface */}
                <div className="relative min-w-0 rounded-xl bg-background-subtle/80 p-3 sm:p-5 shadow-inner">
                  {card.illustration}
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
