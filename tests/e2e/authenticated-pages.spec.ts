import { test, expect, type Page } from "@playwright/test";

/**
 * Authenticated page tests.
 * All tests share one guest login session (beforeAll).
 */

let sharedPage: Page;

test.beforeAll(async ({ browser }) => {
  sharedPage = await browser.newPage();

  // Guest login
  await sharedPage.goto("/login", { waitUntil: "networkidle" });
  const guestButton = sharedPage.getByRole("button").filter({ hasText: /guest|游客/i });
  await expect(guestButton).toBeVisible();
  await Promise.all([
    sharedPage.waitForURL(/\/dashboard/, { timeout: 15_000 }),
    guestButton.click(),
  ]);
});

test.afterAll(async () => {
  await sharedPage.close();
});

test("dashboard loads after guest login", async () => {
  const errors: string[] = [];
  sharedPage.on("response", (response) => {
    if (response.status() >= 500) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await sharedPage.goto("/dashboard", { waitUntil: "networkidle" });

  // Should not be redirected away from dashboard
  expect(sharedPage.url()).toContain("/dashboard");

  // No error content
  const body = sharedPage.locator("body");
  await expect(body).not.toContainText("Internal Server Error");
  await expect(body).not.toContainText("500");

  expect(errors).toHaveLength(0);
});

test("planning page loads after creating a project", async () => {
  const errors: string[] = [];
  sharedPage.on("response", (response) => {
    if (response.status() >= 500) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  // /projects/new creates a project client-side and redirects to /projects/[id]/plan
  await sharedPage.goto("/projects/new", { waitUntil: "networkidle" });

  // Wait for the redirect to the plan page (client-side navigation)
  await sharedPage.waitForURL(/\/projects\/.+\/plan/, { timeout: 20_000 });

  const url = sharedPage.url();
  expect(url).toMatch(/\/projects\/.+\/plan/);

  // Plan page should render without 500 errors
  const body = sharedPage.locator("body");
  await expect(body).not.toContainText("Internal Server Error");
  await expect(body).not.toContainText("500");

  expect(errors).toHaveLength(0);
});
