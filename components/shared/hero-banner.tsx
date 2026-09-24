import Image from "next/image";
import darkBanner from "@/public/hero-banner-dark.png";
import lightBanner from "@/public/hero-banner-light.png";
import { cn } from "@/lib/utils";

const ALT = "The EchoGPT workspace with the model switcher, prompt composer and Chrome sidebar";
const SIZES = "(min-width: 1280px) 60vw, 100vw";
const IMAGE_CLASS = "object-cover object-right";

/**
 * Theme-matched product banner. Both images are lazy and the inactive one is
 * `display: none`, so the browser only downloads the banner for the current theme
 * (a hidden image is also dropped from the accessibility tree).
 */
export function HeroBanner({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={lightBanner}
        alt={ALT}
        fill
        sizes={SIZES}
        placeholder="blur"
        className={cn(IMAGE_CLASS, "dark:hidden")}
      />
      <Image
        src={darkBanner}
        alt={ALT}
        fill
        sizes={SIZES}
        placeholder="blur"
        className={cn(IMAGE_CLASS, "hidden dark:block")}
      />
    </div>
  );
}
