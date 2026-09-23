"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function NewsletterPlaceholder() {
  return (
    <div aria-hidden="true" className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

// react-hook-form and zod only load when the footer approaches the viewport,
// keeping them out of the landing page's initial JavaScript.
const NewsletterForm = dynamic(() => import("./newsletter-form").then((module) => module.NewsletterForm), {
  ssr: false,
  loading: NewsletterPlaceholder,
});

export function LazyNewsletterForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>{isNearViewport ? <NewsletterForm /> : <NewsletterPlaceholder />}</div>;
}
