import { expect, test } from "@playwright/test";

test("landing page leads into the app", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Every leading AI model");
  await page
    .getByRole("link", { name: /start chatting free/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/app$/);
});

test("select a model, send a prompt and receive a mock response", async ({ page }) => {
  await page.goto("/app");

  await page.getByRole("button", { name: /change model/i }).click();
  await page.getByPlaceholder(/search models/i).fill("haiku");
  await page.getByRole("option", { name: /claude haiku 4\.5/i }).click();
  await expect(page.getByRole("button", { name: /model: claude haiku 4\.5/i })).toBeVisible();

  const composer = page.getByLabel("Message", { exact: true });
  const send = page.getByRole("button", { name: "Send message" });
  await expect(send).toBeDisabled();

  await composer.fill("Summarize the key ideas of Deep Work in five bullet points");
  await composer.press("Enter");

  await expect(page.getByRole("article", { name: "You said" })).toContainText("Deep Work");
  await expect(page.getByRole("status").filter({ hasText: "is thinking" })).toBeVisible();

  const reply = page.getByRole("article", { name: "Claude Haiku 4.5 replied" });
  await expect(reply).toBeVisible({ timeout: 10_000 });
  await expect(reply.getByRole("listitem").first()).toBeVisible();
  await expect(composer).toHaveValue("");
});
