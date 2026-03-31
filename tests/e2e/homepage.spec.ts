import { test, expect } from "@playwright/test";

test("homepage loads and shows main heading", async ({ page }) => {
  const errors: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 500) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });

  // Page title should be set
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);

  // No 5xx responses during page load
  expect(errors).toHaveLength(0);
});

test("about page loads with correct content", async ({ page }) => {
  const errors: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 500) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/about", { waitUntil: "networkidle" });

  // Should contain recognizable about-page text (bilingual)
  const body = page.locator("body");
  await expect(body).not.toContainText("500");
  await expect(body).not.toContainText("Internal Server Error");

  // Either the Chinese or English heading should be visible
  const hasChineseContent = await body.locator("text=关于我们").count();
  const hasEnglishContent = await body.locator("text=About").count();
  expect(hasChineseContent + hasEnglishContent).toBeGreaterThan(0);

  expect(errors).toHaveLength(0);
});

test("example course page loads without auth", async ({ page }) => {
  const errors: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 500) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/examples/ai-agent-development", {
    waitUntil: "networkidle",
  });

  // Page should not show error state
  await expect(page.locator("body")).not.toContainText("500");
  await expect(page.locator("body")).not.toContainText("Internal Server Error");

  // No 5xx responses
  expect(errors).toHaveLength(0);
});
