import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free EchoGPT account and start chatting with GPT, Claude, Gemini and more.",
  alternates: { canonical: "/sign-up" },
};

export default function SignUpPage() {
  return (
    <AuthShell title="Create your account" description="Free forever plan. No credit card required.">
      <SignUpForm />
    </AuthShell>
  );
}
