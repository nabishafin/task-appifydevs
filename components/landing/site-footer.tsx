import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { siteConfig } from "@/constants/site";
import { FOOTER_LINKS } from "@/data/navigation";
import { LazyNewsletterForm } from "./lazy-newsletter-form";
import { GithubIcon, LinkedinIcon, XIcon } from "./social-icons";

const SOCIAL_LINKS = [
  { label: "EchoGPT on GitHub", href: siteConfig.links.github, icon: GithubIcon },
  { label: "EchoGPT on X", href: siteConfig.links.x, icon: XIcon },
  { label: "EchoGPT on LinkedIn", href: siteConfig.links.linkedin, icon: LinkedinIcon },
  { label: "EchoGPT community on Discord", href: siteConfig.links.discord, icon: MessageCircle },
];

function isExternal(href: string): boolean {
  return /^(https?:|mailto:)/.test(href);
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background-subtle">
      <ResponsiveContainer size="wide" className="py-10 sm:py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="space-y-6">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Every leading AI model in one calm workspace, on the web and in your browser sidebar.
            </p>
            <LazyNewsletterForm />
            <ul className="flex gap-1" aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-medium text-foreground">{group.title}</h2>
                <ul className="mt-4 space-y-1">
                  {group.links.map((link) => {
                    const className =
                      "inline-flex min-h-8 items-center text-sm text-muted-foreground transition-colors hover:text-foreground";
                    return (
                      <li key={link.label}>
                        {isExternal(link.href) ? (
                          <a
                            href={link.href}
                            className={className}
                            {...(link.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className={className}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 EchoGPT. Redesign concept for the AppifyDevs frontend assignment.</p>
          <a
            href={siteConfig.links.liveProduct}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Visit the current echogpt.live
          </a>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}
