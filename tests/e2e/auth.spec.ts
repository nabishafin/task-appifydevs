import { expect, test } from "@playwright/test";

test("header Sign in opens the sign-in page, validates and signs in", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile)
    await page
      .getByRole("button", { name: /open menu|menu/i })
      .first()
      .click();
  await page.getByRole("link", { name: "Sign in", exact: true }).first().click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText("Enter your email address.")).toBeVisible();
  await expect(page.getByText("Enter your password.")).toBeVisible();

  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Email").blur();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();

  await page.getByLabel("Email").fill("alex@company.com");
  await page.getByLabel("Password", { exact: true }).fill("secret123");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/, { timeout: 10_000 });
});

test("sign up stores the profile name shown in the workspace", async ({ page, isMobile }) => {
  await page.goto("/sign-up");
  await page.getByLabel("Full name").fill("Priya Desai");
  await page.getByLabel("Work email").fill("priya@atlas.health");
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByRole("button", { name: "Create free account" }).click();
  await expect(page.getByText("Use at least 8 characters.")).toBeVisible();

  await page.getByLabel("Password", { exact: true }).fill("longenough1");
  await page.getByRole("button", { name: "Create free account" }).click();
  await expect(page).toHaveURL(/\/app$/, { timeout: 10_000 });
  // On small screens the account menu lives inside the navigation drawer.
  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("button", { name: "Account menu for Priya Desai" })).toBeVisible();
});
