"use client";

import { Check } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A feature's icon must be pre-rendered on the server (see FeaturesSection): a Server
 * Component can pass finished JSX across the client boundary, but not a raw icon
 * component reference for the client to call itself.
 */
export interface DrawerFeature {
  id: string;
  title: string;
  description: string;
  points: string[];
  /** Small, currentColor-friendly icon shown in the nav row (recolored via a wrapping span). */
  navIcon: React.ReactNode;
  /** Larger, already-tinted icon shown above the detail panel's heading. */
  panelIcon: React.ReactNode;
}

interface FeatureDrawerProps {
  features: DrawerFeature[];
  illustrations: Record<string, React.ReactNode>;
}

/**
 * Desktop-only: a feature list on the left; picking one slides its detail panel
 * and illustration in on the right, like a drawer. Below `lg` the section falls
 * back to the fully expanded stacked rows (see FeaturesSection) instead, so
 * nothing on mobile is hidden behind a tap.
 */
export function FeatureDrawer({ features, illustrations }: FeatureDrawerProps) {
  const [activeId, setActiveId] = useState(features[0].id);
  const active = features.find((feature) => feature.id === activeId) ?? features[0];

  return (
    <div className="hidden overflow-hidden rounded-lg border border-border lg:grid lg:grid-cols-[minmax(0,17rem)_1fr]">
      <nav aria-label="Features" className="flex flex-col divide-y divide-border border-r border-border">
        {features.map((feature) => {
          const isActive = feature.id === activeId;
          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => setActiveId(feature.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "group relative flex items-start gap-3 px-6 py-5 text-left transition-colors",
                isActive ? "bg-background-subtle" : "hover:bg-background-subtle/60",
              )}
            >
              {isActive && (
                <m.span
                  layoutId="feature-drawer-active"
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-0.5 bg-primary"
                />
              )}
              <span
                className={cn("mt-0.5 shrink-0", isActive ? "text-primary-text" : "text-subtle-foreground")}
                aria-hidden="true"
              >
                {feature.navIcon}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-sm font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {feature.title}
                </span>
                <span className="mt-1 line-clamp-2 block text-xs text-subtle-foreground">{feature.points[0]}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="relative min-h-[26rem] overflow-hidden bg-background">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="grid h-full items-center gap-10 p-10 xl:grid-cols-[minmax(0,20rem)_1fr]"
          >
            <div>
              {active.panelIcon}
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{active.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{active.description}</p>
              <ul className="mt-5 space-y-2">
                {active.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm text-foreground/90">
                    <Check className="size-4 text-primary-text" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">{illustrations[active.id]}</div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
