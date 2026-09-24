"use client";

import { Check, Loader2, Zap } from "lucide-react";
import { RadioGroup } from "radix-ui";
import { useState } from "react";
import { toast } from "sonner";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PRICING_TIERS } from "@/data/pricing";
import { cn, sleep } from "@/lib/utils";
import { useOverlay } from "@/store/ui-store";
import type { BillingCycle, PricingTier } from "@/types/marketing";

const BILLING_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "-25%" },
] as const;

const PAID_TIERS = PRICING_TIERS.filter(
  (tier): tier is PricingTier & { price: Record<BillingCycle, number> } => tier.price !== null,
);

export function UpgradeDialog() {
  const { open, onOpenChange } = useOverlay("upgrade");
  const [billing, setBilling] = useState<BillingCycle>("yearly");
  const [selectedId, setSelectedId] = useState<PricingTier["id"]>("pro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selected = PAID_TIERS.find((tier) => tier.id === selectedId) ?? PAID_TIERS[0];

  async function handleUpgrade() {
    setIsSubmitting(true);
    await sleep(900);
    setIsSubmitting(false);
    onOpenChange(false);
    toast.success(`${selected.name} trial started`, {
      description: "Demo only — no payment was processed.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-2xl">
        <DialogHeader className="items-start">
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary-text">
            <Zap className="size-5" aria-hidden="true" />
          </span>
          <DialogTitle className="text-lg">Upgrade your workspace</DialogTitle>
          <DialogDescription>Unlock every model, side-by-side comparison and unlimited history.</DialogDescription>
        </DialogHeader>

        <SegmentedControl
          id="upgrade-billing"
          label="Billing cycle"
          value={billing}
          onValueChange={setBilling}
          options={BILLING_OPTIONS}
          className="self-start"
        />

        <RadioGroup.Root
          aria-label="Plan"
          value={selectedId}
          onValueChange={(value) => {
            const tier = PAID_TIERS.find((item) => item.id === value);
            if (tier) setSelectedId(tier.id);
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          {PAID_TIERS.map((tier) => {
            const isSelected = tier.id === selectedId;
            return (
              <RadioGroup.Item
                key={tier.id}
                value={tier.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border p-4 text-left transition-[border-color,box-shadow]",
                  isSelected
                    ? "border-primary shadow-sm ring-3 ring-primary/15"
                    : "border-border hover:border-border-strong",
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{tier.name}</span>
                  {tier.badge && (
                    <span className="rounded-md bg-primary/12 px-2 py-0.5 text-[11px] font-medium text-primary-text">
                      {tier.badge}
                    </span>
                  )}
                </span>
                <span className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tracking-tight text-foreground">${tier.price[billing]}</span>
                  <span className="text-sm text-muted-foreground">{tier.priceNote}</span>
                </span>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {tier.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </RadioGroup.Item>
            );
          })}
        </RadioGroup.Root>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">Cancel any time. This is a demo checkout.</p>
          <Button size="lg" onClick={handleUpgrade} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
            {isSubmitting ? "Starting trial…" : `Start ${selected.name} trial`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
