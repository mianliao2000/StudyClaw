import { spawn } from "node:child_process";
import { CodexAppServerClient } from "./codex-app-server-client.mjs";

const args = new Set(process.argv.slice(2));
const DEBUG = args.has("--debug");
const SHOW_HELP = args.has("--help") || args.has("-h");
const NO_OPEN = args.has("--no-open");

function printHelp() {
  console.log("Usage: corepack pnpm chatgpt:login [--debug] [--no-open]");
  console.log("");
  console.log("Options:");
  console.log("  --debug    Print the auth URL and login result");
  console.log("  --no-open  Do not launch the browser automatically");
  console.log("  --help     Show this help message");
}

function openBrowser(url) {
  const platform = process.platform;
  if (platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { stdio: "ignore", detached: true }).unref();
    return;
  }
  if (platform === "darwin") {
    spawn("open", [url], { stdio: "ignore", detached: true }).unref();
    return;
  }
  spawn("xdg-open", [url], { stdio: "ignore", detached: true }).unref();
}

async function main() {
  if (SHOW_HELP) {
    printHelp();
    return;
  }

  const client = new CodexAppServerClient({
    clientInfo: {
      name: "studyclaw",
      version: "0.1.0",
    },
  });

  await client.start();

  try {
    const result = await client.request("account/login/start", {
      type: "chatgpt",
    });

    if (!result || result.type !== "chatgpt") {
      throw new Error(`Unexpected login response: ${JSON.stringify(result)}`);
    }

    console.log("Started ChatGPT login through Codex app-server");
    console.log(`loginId: ${result.loginId}`);
    console.log(`authUrl: ${result.authUrl}`);

    if (DEBUG) {
      console.log("\n[debug] Waiting for notifications:");
      console.log("- account/login/completed");
      console.log("- account/updated");
    }

    if (!NO_OPEN) {
      try {
        openBrowser(result.authUrl);
        console.log("\nA browser window should open automatically\n");
      } catch {
        console.log("\nCould not open the browser automatically. Please open authUrl manually\n");
      }
    } else {
      console.log("\n--no-open enabled, browser launch skipped\n");
    }

    const completed = await client.waitForNotification(
      "account/login/completed",
      (params) => params?.loginId === result.loginId || params?.loginId == null,
      300000
    );

    if (DEBUG) {
      console.log("\n[debug] account/login/completed:");
      console.log(JSON.stringify(completed, null, 2));
    }

    if (!completed?.success) {
      throw new Error(completed?.error || "ChatGPT login failed");
    }

    const account = await client.request("account/read", {
      refreshToken: true,
    });

    console.log("\nChatGPT OAuth login complete via Codex app-server");
    if (DEBUG) {
      console.log("\n[debug] account/read:");
      console.log(JSON.stringify(account, null, 2));
    } else if (account?.account?.type === "chatgpt") {
      console.log(`Signed in as: ${account.account.email}`);
      console.log(`Plan: ${account.account.planType}`);
    }

    console.log("You can now run: corepack pnpm chatgpt:probe");
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error("\nChatGPT OAuth login failed:");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
