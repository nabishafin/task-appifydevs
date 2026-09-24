"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/constants/site";
import { signUpSchema, type SignUpInput } from "@/schemas/auth";
import { AuthDivider, PasswordInput, SocialButtons } from "./auth-fields";
import { useDemoAuth } from "./use-demo-auth";

export function SignUpForm() {
  const { pending, authenticate } = useDemoAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(({ name, email }) => authenticate("email", { name, email }));

  return (
    <div className="space-y-6">
      <SocialButtons pending={pending} onSelect={(provider) => void authenticate(provider)} />
      <AuthDivider />

      <form onSubmit={onSubmit} noValidate>
        <FieldGroup className="gap-4">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="sign-up-name">Full name</FieldLabel>
            <Input
              id="sign-up-name"
              autoComplete="name"
              placeholder="Alex Morgan"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="sign-up-email">Work email</FieldLabel>
            <Input
              id="sign-up-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field data-invalid={Boolean(errors.password)}>
            <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
            <PasswordInput
              id="sign-up-password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={Boolean(errors.password)}
              aria-describedby="sign-up-password-hint"
              {...register("password")}
            />
            {errors.password ? (
              <FieldError errors={[errors.password]} />
            ) : (
              <FieldDescription id="sign-up-password-hint">Use 8 or more characters with a number.</FieldDescription>
            )}
          </Field>

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending !== null}>
            {pending === "email" && <Loader2 className="animate-spin" aria-hidden="true" />}
            {pending === "email" ? "Creating your account…" : "Create free account"}
          </Button>
          <p className="text-center text-xs text-subtle-foreground">
            By continuing you agree to the Terms and Privacy Policy. This is a demo — no data leaves your browser.
          </p>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={siteConfig.links.signIn}
          className="font-medium text-primary-text underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
