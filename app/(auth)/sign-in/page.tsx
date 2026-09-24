import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to EchoGPT to chat with every leading AI model in one workspace.",
  alternates: { canonical: "/sign-in" },
};

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" description="Sign in to pick up where you left off.">
      <SignInForm />
    </AuthShell>
  );
}
