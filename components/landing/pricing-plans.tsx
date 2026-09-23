"use client";

import { useState } from "react";
import { type SegmentedOption, SegmentedControl } from "@/components/shared/segmented-control";
import { PRICING_TIERS } from "@/data/pricing";
import type { BillingCycle } from "@/types/marketing";
import { PricingCard } from "./pricing-card";

const BILLING_OPTIONS: ReadonlyArray<SegmentedOption<BillingCycle>> = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "-25%" },
];

export function PricingPlans() {
  const [billing, setBilling] = useState<BillingCycle>("yearly");

  return (
    <>
      <div className="mt-10 flex justify-center">
        <SegmentedControl
          id="billing-cycle"
          label="Billing cycle"
          value={billing}
          onValueChange={setBilling}
          options={BILLING_OPTIONS}
        />
      </div>
      <ul className="mx-auto mt-10 grid max-w-md gap-4 lg:max-w-none lg:grid-cols-3 lg:gap-6">
        {PRICING_TIERS.map((tier) => (
          <li key={tier.id}>
            <PricingCard tier={tier} billing={billing} />
          </li>
        ))}
      </ul>
    </>
  );
}
