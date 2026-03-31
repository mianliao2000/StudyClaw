import { test, expect } from "@playwright/test";

test("guest login redirects to dashboard", async ({ page }) => {
  await page.goto("/login", { waitUntil: "networkidle" });

  // Verify the login page loaded
  await expect(page.locator("h1")).toContainText("Pandora AI");

  // Click the guest login button (secondary variant, contains User icon + login text)
  // The button text comes from t("login.guest") — match by role + partial text
  const guestButton = page.getByRole("button").filter({
    hasText: /guest|游客/i,
  });
  await expect(guestButton).toBeVisible();

  // Click and wait for navigation to dashboard
  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 15_000 }),
    guestButton.click(),
  ]);

  expect(page.url()).toContain("/dashboard");

  // Dashboard should not show an error
  await expect(page.locator("body")).not.toContainText("Internal Server Error");
});
