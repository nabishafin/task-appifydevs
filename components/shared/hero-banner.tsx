import Image from "next/image";
import darkBanner from "@/public/hero-banner-dark.png";
import lightBanner from "@/public/hero-banner-light.png";
import { cn } from "@/lib/utils";

const ALT = "The EchoGPT workspace with the model switcher, prompt composer and Chrome sidebar";
const IMAGE_CLASS = "object-cover object-right";

interface HeroBannerProps {
  className?: string;
  imageClassName?: string;
  /** How much of the viewport the banner actually occupies, e.g. "50vw" on the split auth layout. */
  sizes?: string;
}

/**
 * Theme-matched product banner. Both images are lazy and the inactive one is
 * `display: none`, so the browser only downloads the banner for the current theme
 * (a hidden image is also dropped from the accessibility tree).
 */
export function HeroBanner({ className, imageClassName, sizes = "100vw" }: HeroBannerProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={lightBanner}
        alt={ALT}
        fill
        sizes={sizes}
        placeholder="blur"
        className={cn(IMAGE_CLASS, imageClassName, "dark:hidden")}
      />
      <Image
        src={darkBanner}
        alt={ALT}
        fill
        sizes={sizes}
        placeholder="blur"
        className={cn(IMAGE_CLASS, imageClassName, "hidden dark:block")}
      />
    </div>
  );
}
