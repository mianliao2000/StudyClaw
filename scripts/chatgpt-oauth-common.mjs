import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const PROJECT_ROOT = process.cwd();
const ENV_FILE = path.resolve(PROJECT_ROOT, ".env");

export function loadProjectEnv() {
  if (!fs.existsSync(ENV_FILE)) {
    return;
  }

  const raw = fs.readFileSync(ENV_FILE, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadProjectEnv();

export const DEFAULT_MODEL = process.env.CHATGPT_MODEL || "gpt-5.4-mini";

export function resolveBridgeScript() {
  return process.env.CHATGPT_BRIDGE_SCRIPT
    ? path.resolve(PROJECT_ROOT, process.env.CHATGPT_BRIDGE_SCRIPT)
    : path.resolve(PROJECT_ROOT, "scripts/chatgpt-oauth-bridge.mjs");
}

function getExistingPath(candidates) {
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function findCodexInVsCodeExtensions() {
  const userProfile = process.env.USERPROFILE || process.env.HOME;
  if (!userProfile) {
    return null;
  }

  const extensionRoots = [
    path.join(userProfile, ".vscode", "extensions"),
    path.join(userProfile, ".vscode-insiders", "extensions"),
  ];

  for (const root of extensionRoots) {
    if (!fs.existsSync(root)) {
      continue;
    }

    const entries = fs
      .readdirSync(root, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() && entry.name.startsWith("openai.chatgpt-")
      )
      .map((entry) => entry.name)
      .sort((a, b) => b.localeCompare(a));

    const candidates = entries.map((entry) =>
      path.join(root, entry, "bin", "windows-x86_64", "codex.exe")
    );

    const resolved = getExistingPath(candidates);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}

function findCodexOnPath() {
  try {
    const output = execFileSync("where.exe", ["codex"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    return getExistingPath(output);
  } catch {
    return null;
  }
}

export function resolveCodexBinary() {
  const explicit = process.env.CODEX_BIN || process.env.CHATGPT_CODEX_BIN;
  if (explicit) {
    const resolved = path.isAbsolute(explicit)
      ? explicit
      : path.resolve(PROJECT_ROOT, explicit);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }

  if (process.platform === "win32") {
    return (
      findCodexInVsCodeExtensions() ||
      findCodexOnPath() ||
      "codex"
    );
  }

  return findCodexOnPath() || "codex";
}
