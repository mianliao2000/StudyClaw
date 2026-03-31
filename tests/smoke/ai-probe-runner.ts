/**
 * Standalone runner for AI probe smoke tests.
 * Triggers real AI calls — use sparingly.
 *
 * Usage:
 *   PRODUCTION_URL=https://your-app.railway.app pnpm test:ai-probe
 */

import { runAiProbeSmoke } from "./ai-probe.smoke.js";

const BASE_URL = process.env.PRODUCTION_URL?.replace(/\/$/, "");

if (!BASE_URL) {
  console.error("Error: PRODUCTION_URL environment variable is not set.");
  process.exit(1);
}

console.log(`\nRunning AI probe tests against: ${BASE_URL}`);
console.log("This test triggers real AI calls and writes to the production database.\n");

async function main() {
  try {
    await runAiProbeSmoke(BASE_URL!);
    console.log("\n  PASS  All AI features reachable:");
    console.log("        - Planning chat (对话框)");
    console.log("        - Content generation (正文生成)");
    console.log("        - AI tutor (AI助手)");
    console.log("");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("\nAI probe FAILED:\n");
    for (const line of message.split("\n")) {
      console.error(`  ${line}`);
    }
    console.error("");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
