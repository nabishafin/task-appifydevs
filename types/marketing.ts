import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  points: string[];
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: LucideIcon;
  metric?: { value: string; label: string };
}

export type BillingCycle = "monthly" | "yearly";

export interface PricingTier {
  id: "free" | "pro" | "team";
  name: string;
  description: string;
  /** Price per seat in USD. `null` means free. */
  price: Record<BillingCycle, number> | null;
  priceNote: string;
  cta: { label: string; href: string };
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavItem[];
}

export interface WorkflowComparisonRow {
  task: string;
  traditional: string;
  echo: string;
}
