"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sleep } from "@/lib/utils";
import { LANGUAGE_OPTIONS, profileSchema, type ProfileInput } from "@/schemas/settings";
import { usePreferencesStore } from "@/store/preferences-store";
import { SettingsSection } from "./settings-section";

export function GeneralSettings() {
  const profile = usePreferencesStore((state) => state.profile);
  const setPreference = usePreferencesStore((state) => state.setPreference);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    // Profile values come from a store that hydrates after mount; `values` keeps the form in sync.
    values: profileSchema.safeParse(profile).data ?? {
      displayName: profile.displayName,
      email: profile.email,
      language: "en",
    },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    await sleep(500);
    setPreference("profile", values);
    reset(values);
    toast.success("Profile updated");
  });

  return (
    <SettingsSection
      id="general"
      title="General"
      description="Your profile and language. Changes save to this browser."
    >
      <form onSubmit={onSubmit} noValidate className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.displayName)}>
              <FieldLabel htmlFor="profile-name">Display name</FieldLabel>
              <Input
                id="profile-name"
                autoComplete="name"
                aria-invalid={Boolean(errors.displayName)}
                {...register("displayName")}
              />
              <FieldError errors={[errors.displayName]} />
            </Field>
            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <Input
                id="profile-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
          </div>
          <Field data-invalid={Boolean(errors.language)} className="sm:max-w-xs">
            <FieldLabel htmlFor="profile-language">Interface language</FieldLabel>
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="profile-language" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldDescription>Models reply in the language you write in, whatever you choose here.</FieldDescription>
          </Field>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="ghost" disabled={!isDirty || isSubmitting} onClick={() => reset()}>
              Discard
            </Button>
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
              Save changes
            </Button>
          </div>
        </FieldGroup>
      </form>
    </SettingsSection>
  );
}
