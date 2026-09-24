"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/constants/site";
import { signInSchema, type SignInInput } from "@/schemas/auth";
import { AuthDivider, PasswordInput, SocialButtons } from "./auth-fields";
import { useDemoAuth } from "./use-demo-auth";

export function SignInForm() {
  const { pending, authenticate } = useDemoAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(() => authenticate("email"));

  return (
    <div className="space-y-6">
      <SocialButtons pending={pending} onSelect={(provider) => void authenticate(provider)} />
      <AuthDivider />

      <form onSubmit={onSubmit} noValidate>
        <FieldGroup className="gap-4">
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
            <Input
              id="sign-in-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field data-invalid={Boolean(errors.password)}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
              <button
                type="button"
                className="text-xs font-medium text-primary-text underline-offset-4 hover:underline"
                onClick={() =>
                  toast.info("Password reset is not available in the demo", {
                    description: "Any email and password will sign you in.",
                  })
                }
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              id="sign-in-password"
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending !== null}>
            {pending === "email" && <Loader2 className="animate-spin" aria-hidden="true" />}
            {pending === "email" ? "Signing in…" : "Sign in"}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to EchoGPT?{" "}
        <Link
          href={siteConfig.links.signUp}
          className="font-medium text-primary-text underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
