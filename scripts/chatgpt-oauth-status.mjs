import fs from "node:fs";
import path from "node:path";
import { loadProjectEnv } from "./chatgpt-oauth-common.mjs";
import { CodexAppServerClient } from "./codex-app-server-client.mjs";

loadProjectEnv();

const root = process.cwd();
const hasChatGPTConfig = Boolean(
  process.env.CHATGPT_BRIDGE_SCRIPT?.trim() &&
    process.env.CHATGPT_MODEL?.trim()
);
const hasOpenRouterConfig = Boolean(
  process.env.OPENROUTER_API_KEY?.trim() ||
    process.env.OPENROUTER_MODEL_STRONG?.trim() ||
    process.env.OPENROUTER_MODEL_MEDIUM?.trim() ||
    process.env.OPENROUTER_MODEL_WEAK?.trim() ||
    process.env.OPENROUTER_BASE_URL?.trim()
);
const hasMiniMaxConfig = Boolean(
  process.env.MINIMAX_API_KEY?.trim() ||
    process.env.MINIMAX_MODEL?.trim() ||
    process.env.MINIMAX_BASE_URL?.trim()
);
const hasOpenAIConfig = Boolean(
  process.env.OPENAI_API_KEY?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    process.env.OPENAI_BASE_URL?.trim()
);
const chatgptActive =
  hasChatGPTConfig &&
  !hasOpenRouterConfig &&
  !hasMiniMaxConfig &&
  !hasOpenAIConfig;
const bridgeScript = process.env.CHATGPT_BRIDGE_SCRIPT
  ? path.resolve(root, process.env.CHATGPT_BRIDGE_SCRIPT)
  : path.resolve(root, "scripts/chatgpt-oauth-bridge.mjs");

function log(label, value) {
  process.stdout.write(`${label}: ${value}\n`);
}

async function main() {
  log("CHATGPT_CONFIG_PRESENT", String(hasChatGPTConfig));
  log("CHATGPT_ACTIVE", String(chatgptActive));
  log("CHATGPT_BRIDGE_SCRIPT", bridgeScript);

  const bridgeExists = fs.existsSync(bridgeScript);
  log("bridge_exists", String(bridgeExists));

  if ((chatgptActive || hasChatGPTConfig) && !bridgeExists) {
    process.exitCode = 1;
    log("status", "ChatGPT bridge is configured, but the bridge script is missing");
    return;
  }

  if (!chatgptActive) {
    log("status", "ChatGPT bridge is not the active provider block");
    return;
  }

  const client = new CodexAppServerClient({
    clientInfo: {
      name: "studyclaw",
      version: "0.1.0",
    },
  });

  try {
    await client.start();
    const result = await client.request("account/read", {
      refreshToken: false,
    });

    if (!result?.account) {
      process.exitCode = 1;
      log("status", "ChatGPT bridge is active, but Codex is not logged in");
      return;
    }

    log("status", "ChatGPT OAuth is available through Codex");
    log("account_type", result.account.type);
    if (result.account.type === "chatgpt") {
      log("email", result.account.email);
      log("plan", result.account.planType);
    }
    log("requiresOpenaiAuth", String(result.requiresOpenaiAuth));
  } finally {
    client.close();
  }
}

main().catch((error) => {
  process.exitCode = 1;
  console.error("\nChatGPT OAuth status check failed:");
  console.error(error instanceof Error ? error.message : String(error));
});
