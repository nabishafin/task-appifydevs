import { Compass } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24">
      <Logo />
      <EmptyState
        icon={Compass}
        title="This page does not exist"
        description="The link may be broken or the page may have moved. Head back to the homepage or open the app."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/app">Open EchoGPT</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        }
      />
    </main>
  );
}
