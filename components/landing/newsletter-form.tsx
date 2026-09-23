"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const newsletterSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address").pipe(z.email("Enter a valid email address")),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

/** Mock signup: validates on the client and confirms with a toast; nothing is sent. */
export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: NewsletterValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("You are on the list", { description: `Product updates will go to ${email}.` });
    reset();
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
      <Field data-invalid={errors.email ? true : undefined}>
        <FieldLabel htmlFor="newsletter-email">Product updates, once a month</FieldLabel>
        <div className="flex gap-2">
          <Input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "newsletter-email-error" : undefined}
            className="h-10 flex-1"
            {...register("email")}
          />
          <Button type="submit" variant="outline" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Joining…" : "Subscribe"}
          </Button>
        </div>
        <FieldError id="newsletter-email-error" errors={[errors.email]} />
      </Field>
    </form>
  );
}
