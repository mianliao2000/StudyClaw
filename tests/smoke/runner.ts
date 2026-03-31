import { runPageSmoke } from "./pages.smoke.js";
import { runApiAuthSmoke } from "./api-auth.smoke.js";
import { runApiProtectedSmoke } from "./api-protected.smoke.js";
import { runAuthPagesSmoke } from "./auth-pages.smoke.js";

const BASE_URL = process.env.PRODUCTION_URL?.replace(/\/$/, "");

if (!BASE_URL) {
  console.error("Error: PRODUCTION_URL environment variable is not set.");
  console.error("Usage: PRODUCTION_URL=https://your-app.railway.app pnpm test:smoke");
  process.exit(1);
}

console.log(`\nRunning smoke tests against: ${BASE_URL}\n`);

let failures = 0;
const results: Array<{ name: string; passed: boolean; error?: string }> = [];

async function run(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, error });
    failures++;
  }
}

async function main() {
  await run("Page availability (public)", () => runPageSmoke(BASE_URL!));
  await run("Guest auth flow", () => runApiAuthSmoke(BASE_URL!));
  await run("Protected endpoints → 401", () => runApiProtectedSmoke(BASE_URL!));
  await run("Authenticated pages (dashboard + planning)", () => runAuthPagesSmoke(BASE_URL!));

  // Print results
  console.log("Results:");
  for (const { name, passed, error } of results) {
    if (passed) {
      console.log(`  PASS  ${name}`);
    } else {
      console.error(`  FAIL  ${name}`);
      if (error) {
        for (const line of error.split("\n")) {
          console.error(`        ${line}`);
        }
      }
    }
  }

  console.log("");
  if (failures > 0) {
    console.error(`${failures} smoke check(s) failed.`);
    process.exit(1);
  } else {
    console.log("All smoke checks passed.");
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
