import { DEFAULT_MODEL } from "./chatgpt-oauth-common.mjs";
import { runCodexExec } from "./codex-exec-common.mjs";

async function main() {
  const model = process.env.CHATGPT_MODEL || DEFAULT_MODEL;
  const prompt = [
    "Reply with exactly one sentence:",
    "ChatGPT OAuth is working",
  ].join("\n");

  const result = await runCodexExec({
    prompt,
    model,
    cwd: process.cwd(),
  });

  console.log("Probe model:", model);
  console.log("Probe response:");
  console.log(result.content.trim());
}

main().catch((error) => {
  console.error("\nChatGPT OAuth probe failed:");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
