import { defineConfig, devices } from "@playwright/test";

const PRODUCTION_URL = process.env.PRODUCTION_URL?.replace(/\/$/, "");

if (!PRODUCTION_URL) {
  throw new Error(
    "PRODUCTION_URL environment variable is required.\n" +
      "Usage: PRODUCTION_URL=https://your-app.railway.app pnpm test:e2e"
  );
}

export default defineConfig({
  testDir: "./",
  timeout: 30_000,
  retries: 1,
  workers: 1, // single worker — avoids parallel guest logins hitting prod DB
  use: {
    baseURL: PRODUCTION_URL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: [
    ["list"],
    ["github"], // annotates failing tests in GitHub Actions PR checks
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
});
