import { test, expect } from "@playwright/test";

test("Google OAuth button redirects to accounts.google.com", async ({
  page,
}) => {
  await page.goto("/login", { waitUntil: "networkidle" });

  // Verify login page loaded
  await expect(page.locator("h1")).toContainText("Pandora AI");

  // Find the Google sign-in button (contains the Google SVG logo or the text from t("login.google"))
  const googleButton = page.getByRole("button").filter({
    hasText: /google/i,
  });
  await expect(googleButton).toBeVisible();

  // Click and capture the navigation target
  // We intercept the navigation before it goes to Google to avoid leaving the test domain
  const [request] = await Promise.all([
    page.waitForRequest((req) => req.url().includes("accounts.google.com"), {
      timeout: 10_000,
    }),
    googleButton.click(),
  ]);

  expect(request.url()).toContain("accounts.google.com");
});
