import type { FooterLinkGroup, NavItem } from "@/types/marketing";
import { siteConfig } from "@/constants/site";

export const MARKETING_NAV: NavItem[] = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "AI Models", href: "#models" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Web app", href: "/app" },
      { label: "Chrome extension", href: "/extension" },
      { label: "Model comparison", href: "/app/compare" },
      { label: "Prompt library", href: "/app/prompts" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Supported models", href: "/#models" },
      { label: "Keyboard shortcuts", href: "/app/settings?section=shortcuts" },
      { label: "FAQ", href: "/#faq" },
      { label: "Current EchoGPT", href: siteConfig.links.liveProduct },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why EchoGPT", href: "/#why" },
      { label: "Testimonials", href: "/#testimonials" },
      { label: "Contact", href: `mailto:${siteConfig.email}` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy settings", href: "/app/settings?section=privacy" },
      { label: "Data controls", href: "/app/settings?section=privacy" },
      { label: "Notifications", href: "/app/settings?section=notifications" },
    ],
  },
];
